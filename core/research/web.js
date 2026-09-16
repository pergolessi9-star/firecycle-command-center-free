function firecrawlConfig() { return { key: process.env.FIRECRAWL_API_KEY || '' }; }

async function search(query, limit = 5) {
  const { key } = firecrawlConfig();
  if (!key) throw Object.assign(new Error('FIRECRAWL_API_KEY is required for live web research'), { code:'WEB_RESEARCH_NOT_CONFIGURED' });
  const response = await fetch('https://api.firecrawl.dev/v2/search', {
    method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},
    body:JSON.stringify({ query, limit, sources:['web'], scrapeOptions:{ formats:[{type:'markdown'}] } })
  });
  const data=await response.json().catch(()=>({}));
  if (!response.ok || data.success === false) throw Object.assign(new Error(data?.error || `Firecrawl returned HTTP ${response.status}`), { code:'WEB_RESEARCH_PROVIDER_ERROR' });
  const results=Array.isArray(data.data?.web) ? data.data.web : [];
  return results.map(item=>({
    uri:item.url || null,
    title:item.title || item.metadata?.title || null,
    snippet:item.markdown?.slice(0,4000) || item.description || '',
    source_type:'WEB',
    provenance:{ provider:'firecrawl', retrieved_at:new Date().toISOString(), job_id:data.id || null }
  })).filter(x=>x.uri);
}
module.exports={search};
