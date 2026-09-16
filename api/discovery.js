const { getPool, withTransaction } = require('../lib/db');

function send(res, status, body) {
  res.status(status).json(body);
}

const AGENTS = [
  { key: 'project_profile', label: 'Project Profile' },
  { key: 'regulatory', label: 'Regulatory & Compliance' },
  { key: 'market', label: 'Market & Ecosystem' },
  { key: 'technology', label: 'Technology & Architecture' },
  { key: 'funding', label: 'Funding & Programme Fit' }
];

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const pool = getPool();

    if (req.method === 'GET') {
      const projectId = req.query && req.query.project_id;
      if (!projectId) return send(res, 400, { ok: false, error: 'PROJECT_ID_REQUIRED' });
      const runs = await pool.query(`
        SELECT id, project_id, status, input, output, error_message, started_at, completed_at, created_at
        FROM discovery_runs WHERE project_id = $1 ORDER BY created_at DESC LIMIT 20
      `, [projectId]);
      return send(res, 200, { ok: true, runs: runs.rows });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
    }

    const body = typeof req.body === 'object' && req.body ? req.body : {};
    const projectId = String(body.project_id || '').trim();
    if (!projectId) return send(res, 400, { ok: false, error: 'PROJECT_ID_REQUIRED' });

    const result = await withTransaction(async (client) => {
      const project = await client.query('SELECT id, name, slug, description, metadata FROM projects WHERE id = $1', [projectId]);
      if (!project.rowCount) {
        const error = new Error('Project not found');
        error.code = 'PROJECT_NOT_FOUND';
        throw error;
      }

      const input = {
        objective: body.objective ? String(body.objective) : 'Initial operational discovery',
        scope: body.scope || {},
        source: 'project-forge-ui'
      };

      const runInsert = await client.query(`
        INSERT INTO discovery_runs (project_id, status, input, started_at)
        VALUES ($1, 'RUNNING', $2::jsonb, now())
        RETURNING id, project_id, status, input, started_at, created_at
      `, [projectId, JSON.stringify(input)]);
      const run = runInsert.rows[0];

      const agentRows = [];
      for (const agent of AGENTS) {
        const agentInput = { project: project.rows[0], discovery: input, agent: agent.key };
        const output = {
          state: 'DEFINED',
          agent: agent.key,
          label: agent.label,
          message: 'Agent execution record created. External research/AI connectors remain gated until configured.',
          project: { id: project.rows[0].id, name: project.rows[0].name, slug: project.rows[0].slug }
        };
        const inserted = await client.query(`
          INSERT INTO agent_runs (discovery_run_id, agent_key, status, input, output, sources, confidence, duration_ms, completed_at)
          VALUES ($1, $2, 'COMPLETED', $3::jsonb, $4::jsonb, '[]'::jsonb, 0, 0, now())
          RETURNING id, agent_key, status, output, confidence, duration_ms, completed_at
        `, [run.id, agent.key, JSON.stringify(agentInput), JSON.stringify(output)]);
        agentRows.push(inserted.rows[0]);
      }

      const summary = `Discovery foundation completed for ${project.rows[0].name}. ${agentRows.length} agent execution records persisted.`;
      const synthesis = await client.query(`
        INSERT INTO synthesis (discovery_run_id, summary, result, confidence)
        VALUES ($1, $2, $3::jsonb, 0)
        RETURNING id, summary, result, confidence, created_at
      `, [run.id, summary, JSON.stringify({ state: 'DEFINED', agents: agentRows.map(a => a.agent_key), next_step: 'configure external research/AI connectors' })]);

      const finalRun = await client.query(`
        UPDATE discovery_runs
        SET status = 'COMPLETED', output = $2::jsonb, completed_at = now()
        WHERE id = $1
        RETURNING id, project_id, status, input, output, started_at, completed_at, created_at
      `, [run.id, JSON.stringify({ synthesis_id: synthesis.rows[0].id, agent_count: agentRows.length, state: 'DEFINED' })]);

      await client.query(`
        INSERT INTO audit_events (project_id, discovery_run_id, event_type, actor, payload)
        VALUES ($1, $2, 'DISCOVERY_COMPLETED', 'system', $3::jsonb)
      `, [projectId, run.id, JSON.stringify({ agent_count: agentRows.length, synthesis_id: synthesis.rows[0].id })]);

      return { run: finalRun.rows[0], agents: agentRows, synthesis: synthesis.rows[0] };
    });

    return send(res, 201, { ok: true, ...result });
  } catch (error) {
    if (error.code === 'PROJECT_NOT_FOUND') return send(res, 404, { ok: false, error: error.code, message: error.message });
    if (error.code === 'DATABASE_NOT_CONFIGURED') return send(res, 503, { ok: false, error: error.code });
    console.error(error);
    return send(res, 500, { ok: false, error: 'DISCOVERY_API_FAILED', message: error.message });
  }
};
