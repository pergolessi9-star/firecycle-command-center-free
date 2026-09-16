function firecrawlConfig() {
  return { key: process.env.FIRECRAWL_API_KEY || '' };
}

async function search(query, limit = 5) {
  const { key } = firecrawlConfig();
  if (!key) {
    const e = new Error('FIRECRAWL_API_KEY is required for live web research');
    e.code = 'WEB_RESEARCH_NOT_CONFIGURED';
    throw e;
  }
  const response = await fetch('https://api.firecrawl.dev/v2/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query, limit, sources: ['web'] })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const e = new Error(data?.error || `Firecrawl returned HTTP ${response.status}`);
    e.code = 'WEB_RESEARCH_PROVIDER_ERROR';
    throw e;
  }
  const results = Array.isArray(data.data) ? data.data : Array.isArray(data.results) ? data.results : [];
  return results.map(item => ({
    uri: item.url || item.link || null,
    title: item.title || item.metadata?.title || null,
    snippet: item.description || item.snippet || item.markdown?.slice(0, 1200) || '',
    source_type: 'WEB',
    provenance: { provider: 'firecrawl', retrieved_at: new Date().toISOString() }
  })).filter(x => x.uri);
}

module.exports = { search };
