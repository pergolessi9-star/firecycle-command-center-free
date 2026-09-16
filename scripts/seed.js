const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const files = fs.readdirSync(path.join(__dirname, '..', 'database', 'seed')).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      await client.query(fs.readFileSync(path.join(__dirname, '..', 'database', 'seed', file), 'utf8'));
      console.log(`Seeded ${file}`);
    }
  } finally { await client.end(); }
}
main().catch(e => { console.error(e); process.exit(1); });
