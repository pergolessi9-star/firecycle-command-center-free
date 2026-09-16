const { getPool } = require('../lib/db');
const { complete } = require('../core/ai/provider');
const { search } = require('../core/research/web');
const { extractEvidence, buildFindings } = require('../core/evidence/engine');
const { AGENTS } = require('../core/agents/catalog');

const send = (res, status, body) => res.status(status).json(body);

async function executeAgent(client, run, project, input, agent) {
  const started = Date.now();
  const row = await client.query(`INSERT INTO agent_runs (discovery_run_id,agent_key,status,input) VALUES ($1,$2,'RUNNING',$3::jsonb) RETURNING id`, [run.id, agent.key, JSON.stringify({ project, discovery: input, focus: agent.focus })]);
  const id = row.rows[0].id;
  try {
    const sources = await search(`${project.name} ${project.description || ''} ${input.objective} ${agent.focus}`.slice(0, 900), 5);
    const sourceIds = [];
    for (const s of sources) {
      const r = await client.query(`INSERT INTO sources (discovery_run_id,uri,title,source_type,provenance,retrieved_at) VALUES ($1,$2,$3,$4,$5::jsonb,now()) RETURNING id`, [run.id,s.uri,s.title,s.source_type,JSON.stringify(s.provenance)]);
      sourceIds.push(r.rows[0].id);
    }
    const ai = await complete({
      system: `You are the ${agent.label} agent in PROJECT FORGE. Research ${agent.focus}. Use only supplied web material for factual claims. Distinguish observations, gaps and recommendations. Never label evidence VERIFIED.`,
      user: JSON.stringify({ project, objective: input.objective, scope: input.scope, sources: sources.map(s => ({ title:s.title, uri:s.uri, snippet:s.snippet })) }),
      maxTokens: 1600
    });
    const evidence = extractEvidence(ai.text);
    const evidenceIds = [];
    for (const e of evidence) {
      const r = await client.query(`INSERT INTO evidence (project_id,source_id,truth_state,statement,sha256,metadata) VALUES ($1,$2,'OBSERVED',$3,$4,$5::jsonb) RETURNING id`, [project.id,sourceIds[0] || null,e.statement,e.sha256,JSON.stringify({agent_key:agent.key,discovery_run_id:run.id})]);
      evidenceIds.push(r.rows[0].id);
    }
    for (const f of buildFindings(agent.key, ai.text)) {
      await client.query(`INSERT INTO findings (discovery_run_id,severity,title,description,evidence_ids,status) VALUES ($1,$2,$3,$4,$5,'OPEN')`, [run.id,f.severity,f.title,f.description,evidenceIds]);
    }
    const output = { state:'EXECUTED', agent:agent.key, label:agent.label, answer:ai.text, source_count:sources.length, evidence_count:evidenceIds.length, model:ai.model };
    const confidence = Math.min(0.99, 0.55 + sources.length * 0.08);
    await client.query(`UPDATE agent_runs SET status='COMPLETED',output=$2::jsonb,sources=$3::jsonb,confidence=$4,tokens=$5,duration_ms=$6,completed_at=now() WHERE id=$1`, [id,JSON.stringify(output),JSON.stringify(sources),confidence,ai.tokens,Date.now()-started]);
    return { id, agent_key:agent.key, status:'COMPLETED', output, confidence, evidence_count:evidenceIds.length };
  } catch (error) {
    const output = { state:'FAILED', agent:agent.key, code:error.code || 'AGENT_FAILED', message:error.message };
    await client.query(`UPDATE agent_runs SET status='FAILED',output=$2::jsonb,error_message=$3,duration_ms=$4,completed_at=now() WHERE id=$1`, [id,JSON.stringify(output),error.message,Date.now()-started]);
    return { id, agent_key:agent.key, status:'FAILED', output };
  }
}

module.exports = async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  let pool; try { pool=getPool(); } catch (e) { return send(res,503,{ok:false,error:'DATABASE_NOT_CONFIGURED'}); }
  try {
    if (req.method === 'GET') {
      const projectId=req.query?.project_id; if (!projectId) return send(res,400,{ok:false,error:'PROJECT_ID_REQUIRED'});
      const r=await pool.query(`SELECT id,project_id,status,input,output,error_message,started_at,completed_at,created_at FROM discovery_runs WHERE project_id=$1 ORDER BY created_at DESC LIMIT 20`,[projectId]);
      return send(res,200,{ok:true,runs:r.rows});
    }
    if (req.method !== 'POST') { res.setHeader('Allow','GET, POST'); return send(res,405,{ok:false,error:'METHOD_NOT_ALLOWED'}); }
    const body=req.body && typeof req.body==='object' ? req.body : {};
    const projectId=String(body.project_id || '').trim(); if (!projectId) return send(res,400,{ok:false,error:'PROJECT_ID_REQUIRED'});
    const p=await pool.query('SELECT id,name,slug,description,metadata FROM projects WHERE id=$1',[projectId]);
    if (!p.rowCount) return send(res,404,{ok:false,error:'PROJECT_NOT_FOUND'});
    const project=p.rows[0];
    const input={objective:body.objective ? String(body.objective) : 'Initial operational discovery',scope:body.scope || {},source:'project-forge-ui',execution:'real-ai-web-evidence'};
    const rr=await pool.query(`INSERT INTO discovery_runs (project_id,status,input,started_at) VALUES ($1,'RUNNING',$2::jsonb,now()) RETURNING id,project_id,status,input,started_at,created_at`,[projectId,JSON.stringify(input)]);
    const run=rr.rows[0];
    await pool.query(`INSERT INTO audit_events (project_id,discovery_run_id,event_type,actor,payload) VALUES ($1,$2,'DISCOVERY_STARTED','system',$3::jsonb)`,[projectId,run.id,JSON.stringify({agent_count:AGENTS.length,execution:'real-ai-web-evidence'})]);
    const client=await pool.connect(); let agents; try { agents=await Promise.all(AGENTS.map(a=>executeAgent(client,run,project,input,a))); } finally { client.release(); }
    const successful=agents.filter(a=>a.status==='COMPLETED');
    let synthesis=null;
    if (successful.length) {
      try {
        const ai=await complete({system:'You are the PROJECT FORGE synthesis engine. Synthesize agent research into decision support. Preserve uncertainty and never upgrade OBSERVED evidence to VERIFIED.',user:JSON.stringify({project,input,agents:successful.map(a=>({agent:a.agent_key,answer:a.output.answer,evidence_count:a.evidence_count}))}),maxTokens:1800});
        const s=await pool.query(`INSERT INTO synthesis (discovery_run_id,summary,result,confidence) VALUES ($1,$2,$3::jsonb,$4) RETURNING id,summary,result,confidence,created_at`,[run.id,`Operational discovery synthesis for ${project.name}`,JSON.stringify({state:'EXECUTED',report:ai.text,successful_agents:successful.length,total_agents:AGENTS.length}),successful.length/AGENTS.length]);
        synthesis=s.rows[0];
      } catch(error) {
        const s=await pool.query(`INSERT INTO synthesis (discovery_run_id,summary,result,confidence) VALUES ($1,$2,$3::jsonb,0) RETURNING id,summary,result,confidence,created_at`,[run.id,`Synthesis unavailable for ${project.name}`,JSON.stringify({state:'FAILED',code:error.code || 'SYNTHESIS_FAILED',message:error.message})]);
        synthesis=s.rows[0];
      }
    }
    const finalStatus=successful.length===AGENTS.length?'COMPLETED':'FAILED';
    const output={state:'EXECUTED',agent_count:AGENTS.length,successful_agents:successful.length,failed_agents:AGENTS.length-successful.length,synthesis_id:synthesis?.id || null};
    const fr=await pool.query(`UPDATE discovery_runs SET status=$2,output=$3::jsonb,completed_at=now() WHERE id=$1 RETURNING id,project_id,status,input,output,started_at,completed_at,created_at`,[run.id,finalStatus,JSON.stringify(output)]);
    await pool.query(`INSERT INTO audit_events (project_id,discovery_run_id,event_type,actor,payload) VALUES ($1,$2,$3,'system',$4::jsonb)`,[projectId,run.id,finalStatus==='COMPLETED'?'DISCOVERY_COMPLETED':'DISCOVERY_PARTIAL_FAILURE',JSON.stringify(output)]);
    return send(res,finalStatus==='COMPLETED'?201:207,{ok:finalStatus==='COMPLETED',run:fr.rows[0],agents,synthesis});
  } catch(error) { console.error(error); return send(res,500,{ok:false,error:'DISCOVERY_API_FAILED',message:error.message}); }
};
