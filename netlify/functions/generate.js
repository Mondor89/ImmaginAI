exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) {
    return { statusCode: 503, body: JSON.stringify({ error: 'NO_TOKEN' }) };
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

  const MODELS = [
    { id: 'black-forest-labs/FLUX.1-schnell',          steps: 4,  guidance: 0   },
    { id: 'stabilityai/stable-diffusion-xl-base-1.0',  steps: 25, guidance: 7.5 },
    { id: 'runwayml/stable-diffusion-v1-5',            steps: 20, guidance: 7.5 },
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
            parameters: {
              width,
              height,
              num_inference_steps: model.steps,
              guidance_scale: model.guidance,
            },
          }),
        }
      );

      if (!res.ok) continue;

      const buf = await res.arrayBuffer();
      if (!buf.byteLength) continue;

      const b64 = Buffer.from(buf).toString('base64');
      const ct  = res.headers.get('content-type') || 'image/jpeg';

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: `data:${ct};base64,${b64}` }),
      };
    } catch (e) {
      continue;
    }
  }

  return {
    statusCode: 503,
    body: JSON.stringify({ error: 'ALL_MODELS_FAILED' }),
  };
};
