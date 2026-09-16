const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

  const isLocal = /localhost|127\.0\.0.1/.test(process.env.DATABASE_URL);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  });

  await client.connect();
  try {
    const seedDir = path.join(__dirname, '..', 'database', 'seed');
    const files = fs.readdirSync(seedDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      await client.query(fs.readFileSync(path.join(seedDir, file), 'utf8'));
      console.log(`Seeded ${file}`);
    }
  } finally {
    await client.end();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
