function config() {
  return {
    provider: String(process.env.AI_PROVIDER || 'openai').toLowerCase(),
    apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    baseUrl: (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
  };
}

function extractText(data) {
  if (typeof data?.output_text === 'string') return data.output_text;
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(x => x?.text || '').join('');
  return '';
}

async function complete({ system, user, temperature = 0.1, maxTokens = 1400 }) {
  const c = config();
  if (!c.apiKey) {
    const e = new Error('AI_API_KEY is required for real agent execution');
    e.code = 'AI_NOT_CONFIGURED';
    throw e;
  }
  const response = await fetch(`${c.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${c.apiKey}` },
    body: JSON.stringify({ model: c.model, temperature, max_tokens: maxTokens, messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ] })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const e = new Error(data?.error?.message || `AI provider returned HTTP ${response.status}`);
    e.code = 'AI_PROVIDER_ERROR';
    throw e;
  }
  const text = extractText(data);
  if (!text) throw Object.assign(new Error('AI provider returned no text'), { code: 'AI_EMPTY_RESPONSE' });
  return {
    text,
    model: data.model || c.model,
    tokens: data.usage?.total_tokens || null
  };
}

module.exports = { complete, config };
