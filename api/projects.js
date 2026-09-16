const { getPool, withTransaction } = require('../lib/db');

function send(res, status, body) {
  res.status(status).json(body);
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const pool = getPool();
    if (req.method === 'GET') {
      const result = await pool.query(`
        SELECT id, slug, name, description, status, metadata, created_at, updated_at
        FROM projects ORDER BY created_at DESC LIMIT 50
      `);
      return send(res, 200, { ok: true, projects: result.rows });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
    }

    const body = typeof req.body === 'object' && req.body ? req.body : {};
    const name = String(body.name || '').trim();
    if (!name) return send(res, 400, { ok: false, error: 'NAME_REQUIRED' });

    const description = body.description ? String(body.description).trim() : null;
    const requestedSlug = slugify(body.slug || name);
    if (!requestedSlug) return send(res, 400, { ok: false, error: 'SLUG_REQUIRED' });

    const project = await withTransaction(async (client) => {
      const existing = await client.query('SELECT id FROM projects WHERE slug = $1', [requestedSlug]);
      if (existing.rowCount) {
        const error = new Error('A project with this slug already exists');
        error.code = 'PROJECT_SLUG_EXISTS';
        throw error;
      }
      const inserted = await client.query(`
        INSERT INTO projects (slug, name, description, status, metadata)
        VALUES ($1, $2, $3, 'ACTIVE', $4::jsonb)
        RETURNING id, slug, name, description, status, metadata, created_at, updated_at
      `, [requestedSlug, name, description, JSON.stringify(body.metadata || {})]);
      const row = inserted.rows[0];
      await client.query(`
        INSERT INTO audit_events (project_id, event_type, actor, payload)
        VALUES ($1, 'PROJECT_CREATED', 'user', $2::jsonb)
      `, [row.id, JSON.stringify({ source: 'project-forge-ui', name: row.name })]);
      return row;
    });

    return send(res, 201, { ok: true, project });
  } catch (error) {
    if (error.code === 'PROJECT_SLUG_EXISTS') return send(res, 409, { ok: false, error: error.code, message: error.message });
    if (error.code === 'DATABASE_NOT_CONFIGURED') return send(res, 503, { ok: false, error: error.code });
    console.error(error);
    return send(res, 500, { ok: false, error: 'PROJECTS_API_FAILED', message: error.message });
  }
};
