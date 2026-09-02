// Allowlist esplicita — mai un valore singolo, mai l'header Host (vulnerabile a DNS rebinding, vedi CLAUDE.md → Allineamento al template, U-025)
const ALLOWED_ORIGINS = [
  'https://wonderspit-ai.netlify.app',
  'http://localhost:8888', // netlify dev locale
];

// Rate limit in-memory, best-effort: sopravvive solo finché il container Netlify resta "caldo",
// si azzera ad ogni cold start. Riduce l'abuso rapido da un singolo IP, non lo elimina — vedi
// docs/immaginai_sicurezza.md per il limite noto e accettato.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 6; // il cooldown client è 16s → uso legittimo ~3-4 richieste/min
const requestLog = new Map(); // ip -> [timestamp, ...]

function isRateLimited(ip) {
  const now = Date.now();
  // Pota le entry scadute invece di azzerare tutta la mappa: un azzeramento totale
  // regalerebbe a chiunque generi abbastanza IP distinti un modo per resettare anche
  // il conteggio degli IP legittimi già tracciati.
  for (const [key, timestamps] of requestLog) {
    const fresh = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length) requestLog.set(key, fresh);
    else requestLog.delete(key);
  }
  const timestamps = requestLog.get(ip) || [];
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const origin = event.headers.origin || event.headers.Origin;
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'ORIGIN_NOT_ALLOWED' }) };
  }

  // Solo l'header impostato da Netlify stesso: x-forwarded-for è fornito dal client
  // e falsificabile, userlo come fallback vanificherebbe il rate limit.
  const clientIp = event.headers['x-nf-client-connection-ip'] || 'unknown';
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, body: JSON.stringify({ error: 'RATE_LIMITED' }) };
  }

  // Clamp a un intervallo sano (multiplo di 8, come richiesto dai provider) — un valore
  // non numerico o assurdo (es. 999999) non va mai inoltrato a un'API a pagamento.
  function clampDim(v, def) {
    const n = Number(v);
    if (!Number.isFinite(n)) return def;
    return Math.min(1024, Math.max(256, Math.round(n / 8) * 8));
  }

  let prompt, width, height;
  try {
    const body = JSON.parse(event.body);
    prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > 800) {
      return { statusCode: 400, body: JSON.stringify({ error: 'INVALID_PROMPT' }) };
    }
    width  = clampDim(body.width, 512);
    height = clampDim(body.height, 512);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'BAD_REQUEST' }) };
  }

  // Timeout esplicito: senza questo una CF appesa consuma tutto il budget della function
  // finché non la uccide Netlify stesso, e Together non viene mai provato.
  // 8s per provider: ipotesi di lavoro basata sul limite di default delle Netlify Functions
  // sincrone (~10s, non documentato in modo definitivo da Netlify — vedi CLAUDE.md → Principi
  // di debug). Con Together disattivato di default (TOGETHER_ENABLED), oggi al massimo un
  // provider per richiesta usa questo timeout; se Together verrà riattivato, ridurre il valore
  // per restare sotto il tetto anche con CF+Together in sequenza nella stessa richiesta.
  const PROVIDER_TIMEOUT_MS = 8000;

  // 1. Cloudflare Workers AI — FLUX.1-schnell (gratis, 10k neuroni/giorno, 3-8s)
  const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const CF_API_TOKEN  = process.env.CF_API_TOKEN;
  if (CF_ACCOUNT_ID && CF_API_TOKEN) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, steps: 4, width, height }),
          signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const b64 = data?.result?.image;
        if (b64) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: `data:image/png;base64,${b64}` }),
          };
        }
      } else {
        console.error('CF fail', res.status);
      }
    } catch (e) { console.error('CF error', e.message); }
  }

  // 2. Together.ai — FLUX.1-schnell-Free (gratis con deposito, 2-5s)
  // Scartato come primario in S16 (richiede deposito) — gate esplicito su TOGETHER_ENABLED,
  // non solo sull'esistenza della key: se TOGETHER_KEY viene impostata per errore (es. test,
  // variabile lasciata da una prova), il provider non torna attivo senza un secondo consenso esplicito.
  const TOGETHER_KEY = process.env.TOGETHER_KEY;
  const TOGETHER_ENABLED = process.env.TOGETHER_ENABLED === 'true';
  if (TOGETHER_ENABLED && TOGETHER_KEY) {
    try {
      const res = await fetch('https://api.together.xyz/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOGETHER_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'black-forest-labs/FLUX.1-schnell-Free',
          prompt, width, height, steps: 4, n: 1, response_format: 'b64_json',
        }),
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      });
      if (res.ok) {
        const data = await res.json();
        const b64 = data?.data?.[0]?.b64_json;
        if (b64) {
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: `data:image/jpeg;base64,${b64}` }),
          };
        }
      } else {
        console.error('Together fail', res.status);
      }
    } catch (e) { console.error('Together error', e.message); }
  }

  // 3. HuggingFace — rimosso in S22: api-inference.huggingface.co non risolve più via DNS
  // (dominio dismesso, verificato con curl — non un errore 4xx, un fallimento di risoluzione).
  // Il sostituto (router.huggingface.co) usa un formato di risposta diverso e richiede una
  // verifica separata prima di riscrivere questo step — vedi backlog in immaginai_stato.md.
  // HORDE_API_KEY (rinominata da HF_TOKEN in S24 — era la chiave Stable Horde, non HuggingFace)
  // resta letta/usata altrove (Immaginai.html), non toccarla qui.

  return { statusCode: 503, body: JSON.stringify({ error: 'ALL_MODELS_FAILED' }) };
};
