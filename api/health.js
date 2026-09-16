const { Client } = require('pg');

module.exports = async function handler(req, res) {
  if (!process.env.DATABASE_URL) return res.status(503).json({ ok:false, status:'DATABASE_NOT_CONFIGURED', message:'DATABASE_URL is required' });
  const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: isLocal ? false : { rejectUnauthorized:false }, connectionTimeoutMillis:5000 });
  try {
    await client.connect();
    const ping = await client.query('SELECT now() AS database_time');
    const required = ['projects','discovery_runs','agent_runs','sources','evidence','findings','synthesis','audit_events'];
    const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name = ANY($1::text[])", [required]);
    const present = tables.rows.map(r => r.table_name);
    const missing = required.filter(t => !present.includes(t));
    const migrations = await client.query("SELECT version, applied_at FROM schema_migrations ORDER BY version").catch(() => ({ rows:[] }));
    const extensions = await client.query("SELECT extname, extversion FROM pg_extension WHERE extname IN ('pgcrypto','vector')");
    const extensionMap = Object.fromEntries(extensions.rows.map(r => [r.extname, r.extversion]));
    const missingExtensions = ['pgcrypto','vector'].filter(name => !extensionMap[name]);
    const applied = new Set(migrations.rows.map(r => r.version));
    const requiredMigrations = ['001_foundation.sql','002_operational_hardening.sql'];
    const missingMigrations = requiredMigrations.filter(version => !applied.has(version));
    const ok = missing.length === 0 && missingExtensions.length === 0 && missingMigrations.length === 0;
    return res.status(ok ? 200 : 503).json({
      ok,
      status: ok ? 'DATABASE_CONNECTED' : 'DATABASE_SCHEMA_INCOMPLETE',
      database_time: ping.rows[0].database_time,
      required_tables: required,
      present_tables: present,
      missing_tables: missing,
      extensions: extensionMap,
      missing_extensions: missingExtensions,
      required_migrations: requiredMigrations,
      missing_migrations: missingMigrations,
      migrations: migrations.rows
    });
  } catch (error) {
    return res.status(503).json({ ok:false, status:'DATABASE_UNAVAILABLE', message:error.message });
  } finally { await client.end().catch(()=>{}); }
};
