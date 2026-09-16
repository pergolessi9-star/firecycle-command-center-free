const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const files = fs.readdirSync(path.join(__dirname, '..', 'database', 'migrations')).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      const version = file.replace(/\.sql$/, '');
      const exists = await client.query('SELECT 1 FROM schema_migrations WHERE version=$1', [version]);
      if (exists.rowCount) continue;
      const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'migrations', file), 'utf8');
      await client.query('BEGIN');
      try { await client.query(sql); await client.query('INSERT INTO schema_migrations(version) VALUES($1)', [version]); await client.query('COMMIT'); }
      catch (e) { await client.query('ROLLBACK'); throw e; }
      console.log(`Applied ${version}`);
    }
  } finally { await client.end(); }
}
main().catch(e => { console.error(e); process.exit(1); });
