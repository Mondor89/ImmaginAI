// Editing reale di un'immagine esistente via Pollinations Kontext (gen.pollinations.ai/v1/images/edits).
// Feature aggiuntiva rispetto alla Modifica classica (Immaginai.html → generateModifica), che
// resta gratis/illimitata: questa richiede una chiave sk_ a pagamento (~200 immagini/Pollen) e
// un budget giornaliero condiviso da tutti i visitatori — vedi CLAUDE.md → Principio Prodotto 4,
// valutato esplicitamente con Fabio in Sessione 27 prima di scrivere questo file.
//
// Origin/rate-limit duplicati da generate.js invece di un modulo condiviso: stesso pattern,
// ma un limite più stretto (vedi RATE_LIMIT_MAX sotto) perché qui ogni richiesta ha un costo
// monetario reale, non solo una quota gratuita — refactoring in un helper comune è fuori scope
// per questa sessione (tocca un file che funziona, "una sessione risolve una cosa sola").

const ALLOWED_ORIGINS = [
  'https://wonderspit-ai.netlify.app',
  'http://localhost:8888', // netlify dev locale
];

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3; // più stretto di generate.js (6): qui ogni richiesta costa denaro reale, non solo quota gratuita
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
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

function clampDim(v, def) {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.min(1024, Math.max(256, Math.round(n / 8) * 8));
}

// Timeout più lungo di generate.js (8s): nessuna documentazione ufficiale sul tempo tipico di
// un editing Kontext, ipotesi di lavoro basata sul fatto che un image-to-image è tipicamente
// più pesante di una generazione da zero — verificare/aggiustare quando ci sono dati reali.
const KONTEXT_TIMEOUT_MS = 20000;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const origin = event.headers.origin || event.headers.Origin;
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return { statusCode: 403, body: JSON.stringify({ error: 'ORIGIN_NOT_ALLOWED' }) };
  }

  // Gate esplicito, stesso schema di TOGETHER_ENABLED: la sola presenza della chiave non basta,
  // serve un secondo consenso esplicito prima che il provider sia raggiungibile davvero.
  // Controllato PRIMA del rate limit: mentre la feature è spenta (stato di default, oggi),
  // ogni tentativo consumerebbe comunque uno dei 3 slot/minuto per niente — un utente curioso
  // che clicca 4 volte vedrebbe RATE_LIMITED invece del messaggio corretto "non è ancora attiva".
  const POLLINATIONS_KEY = process.env.POLLINATIONS_KEY;
  const KONTEXT_ENABLED = process.env.KONTEXT_ENABLED === 'true';
  if (!KONTEXT_ENABLED || !POLLINATIONS_KEY) {
    return { statusCode: 503, body: JSON.stringify({ error: 'KONTEXT_DISABLED' }) };
  }

  const clientIp = event.headers['x-nf-client-connection-ip'] || 'unknown';
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, body: JSON.stringify({ error: 'RATE_LIMITED' }) };
  }

  let imageDataUrl, prompt, width, height;
  try {
    const body = JSON.parse(event.body);
    prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > 500) {
      return { statusCode: 400, body: JSON.stringify({ error: 'INVALID_PROMPT' }) };
    }
    imageDataUrl = typeof body.image === 'string' ? body.image : '';
    // Solo un data: URL con i byte dell'immagine — mai un URL da far risolvere al server:
    // generate.js non lo fa mai per lo stesso motivo (CLAUDE.md → Allineamento al template,
    // U-029/U-048), e questa Function segue la stessa regola.
    if (!imageDataUrl.startsWith('data:image/')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'INVALID_IMAGE' }) };
    }
    width = clampDim(body.width, 1024);
    height = clampDim(body.height, 1024);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'BAD_REQUEST' }) };
  }

  // Payload base64 troppo grande — Netlify Functions sincrone hanno un limite di ~6MB sul body
  // della richiesta. Un errore chiaro qui è meglio di un fallimento silenzioso a metà.
  if (imageDataUrl.length > 6 * 1024 * 1024) {
    return { statusCode: 413, body: JSON.stringify({ error: 'IMAGE_TOO_LARGE' }) };
  }

  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return { statusCode: 400, body: JSON.stringify({ error: 'INVALID_IMAGE' }) };
  }
  const mimeType = match[1];
  const buffer = Buffer.from(match[2], 'base64');

  try {
    const form = new FormData();
    form.append('image', new Blob([buffer], { type: mimeType }), 'source.png');
    form.append('prompt', prompt);
    form.append('model', 'kontext');
    form.append('size', `${width}x${height}`);

    const res = await fetch('https://gen.pollinations.ai/v1/images/edits', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${POLLINATIONS_KEY}` },
      body: form,
      signal: AbortSignal.timeout(KONTEXT_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error('Kontext fail', res.status);
      if (res.status === 402) {
        return { statusCode: 402, body: JSON.stringify({ error: 'KONTEXT_BUDGET_EXHAUSTED' }) };
      }
      if (res.status === 401 || res.status === 403) {
        return { statusCode: 502, body: JSON.stringify({ error: 'KONTEXT_AUTH_ERROR' }) };
      }
      if (res.status === 429) {
        return { statusCode: 429, body: JSON.stringify({ error: 'RATE_LIMITED' }) };
      }
      return { statusCode: 502, body: JSON.stringify({ error: 'KONTEXT_FAILED' }) };
    }

    const data = await res.json();
    let b64 = data?.data?.[0]?.b64_json;
    const remoteUrl = data?.data?.[0]?.url;
    if (!b64 && remoteUrl) {
      // La risposta di Pollinations (non un URL fornito dal client — quello resta vietato, vedi
      // sopra) può restituire un url invece di b64_json a seconda del modello — recuperato
      // server-side per mantenere al client un contratto unico (riceve sempre un data: URL).
      // Allowlist di schema/host anche qui: se la risposta del provider fosse manipolata, questo
      // fetch non deve poter raggiungere un host arbitrario (SSRF) né restituire una risposta
      // enorme senza limite.
      let parsed;
      try { parsed = new URL(remoteUrl); } catch (e) { parsed = null; }
      const hostOk = parsed && parsed.protocol === 'https:' && /(^|\.)pollinations\.ai$/.test(parsed.hostname);
      if (hostOk) {
        const imgRes = await fetch(remoteUrl, { signal: AbortSignal.timeout(KONTEXT_TIMEOUT_MS) });
        if (imgRes.ok) {
          const ab = await imgRes.arrayBuffer();
          if (ab.byteLength <= 8 * 1024 * 1024) {
            b64 = Buffer.from(ab).toString('base64');
          }
        }
      } else {
        console.error('Kontext remoteUrl host non in allowlist', remoteUrl);
      }
    }
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: 'KONTEXT_EMPTY' }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: `data:image/png;base64,${b64}` }),
    };
  } catch (e) {
    console.error('Kontext error', e.message);
    return { statusCode: 502, body: JSON.stringify({ error: 'KONTEXT_FAILED' }) };
  }
};
