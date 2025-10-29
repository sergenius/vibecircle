import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRef = 'cwvxlnzuyndjtghohbq';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dnhsbnp1eW5kanRnaG9odGJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY5MTc2NiwiZXhwIjoyMDc3MjY3NzY2fQ.WQ-pkKcSnVWjNHis9XXukyiDS0BlZijjysGraY_h06Q';

async function runMigration() {
  try {
    console.log('📖 Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250128_initial_schema.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('🚀 Executing SQL via Supabase REST API...');

    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`   Executing statement ${i + 1}/${statements.length}...`);

      const response = await fetch(`https://${projectRef}.supabase.co/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: statement })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed at statement ${i + 1}:`, errorText);
        console.error('Statement:', statement.substring(0, 100) + '...');
        // Continue with other statements
      }
    }

    console.log('✅ Migration process completed!');
    console.log('Note: Please verify in Supabase dashboard that all tables were created.');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
