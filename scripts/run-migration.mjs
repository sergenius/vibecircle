import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connection string for Supabase
// Format: postgresql://postgres:[YOUR-PASSWORD]@db.cwvxlnzuyndjtghohbq.supabase.co:5432/postgres
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.cwvxlnzuyndjtghohbq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres';

async function runMigration() {
  const client = new Client({
    connectionString,
  });

  try {
    console.log('📦 Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!');

    console.log('📖 Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250128_initial_schema.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('🚀 Running migration...');
    await client.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('📊 Database schema created with all tables and policies.');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
