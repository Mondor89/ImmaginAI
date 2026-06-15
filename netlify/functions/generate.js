exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let prompt, width, height;
  try {
    const body = JSON.parse(event.body);
    prompt = body.prompt || '';
    width  = Math.round((body.width  || 512) / 8) * 8;
    height = Math.round((body.height || 512) / 8) * 8;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'BAD_REQUEST' }) };
  }

  const log = [];

  // 1. Cloudflare Workers AI — FLUX.1-schnell (gratis, 100k/giorno, 3-8s)
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
          body: JSON.stringify({ prompt, num_steps: 8, width, height }),
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
        log.push('CF_NO_IMAGE: ' + JSON.stringify(data).slice(0,200));
      } else {
        const txt = await res.text();
        log.push('CF_HTTP_' + res.status + ': ' + txt.slice(0,200));
      }
    } catch (e) { log.push('CF_ERR: ' + e.message); }
  } else {
    log.push('CF_MISSING_ENV: account=' + !!CF_ACCOUNT_ID + ' token=' + !!CF_API_TOKEN);
  }

  // 2. Together.ai — FLUX.1-schnell-Free (gratis con deposito, 2-5s)
  const TOGETHER_KEY = process.env.TOGETHER_KEY;
  if (TOGETHER_KEY) {
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
        log.push('TOGETHER_NO_IMAGE');
      } else {
        log.push('TOGETHER_HTTP_' + res.status);
      }
    } catch (e) { log.push('TOGETHER_ERR: ' + e.message); }
  } else {
    log.push('TOGETHER_MISSING_KEY');
  }

  // 3. HuggingFace — SD fallback
  const HF_TOKEN = process.env.HF_TOKEN;
  if (HF_TOKEN) {
    const MODELS = [
      { id: 'stabilityai/stable-diffusion-2-1',  steps: 20, guidance: 7.5 },
      { id: 'runwayml/stable-diffusion-v1-5',     steps: 20, guidance: 7.5 },
    ];
    for (const model of MODELS) {
      try {
        const res = await fetch(
          `https://api-inference.huggingface.co/models/${model.id}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HF_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: { width, height, num_inference_steps: model.steps, guidance_scale: model.guidance },
            }),
          }
        );
        if (!res.ok) { log.push('HF_HTTP_' + res.status + '_' + model.id.split('/')[1]); continue; }
        const buf = await res.arrayBuffer();
        if (!buf.byteLength) { log.push('HF_EMPTY_' + model.id.split('/')[1]); continue; }
        const b64 = Buffer.from(buf).toString('base64');
        const ct  = res.headers.get('content-type') || 'image/jpeg';
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: `data:${ct};base64,${b64}` }),
        };
      } catch (e) { log.push('HF_ERR_' + model.id.split('/')[1] + ': ' + e.message); continue; }
    }
  } else {
    log.push('HF_MISSING_TOKEN');
  }

  return { statusCode: 503, body: JSON.stringify({ error: 'ALL_MODELS_FAILED', log }) };
};
