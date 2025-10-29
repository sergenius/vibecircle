import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use service role key for admin operations
const supabaseUrl = 'https://cwvxlnzuyndjtghohbq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dnhsbnp1eW5kanRnaG9odGJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY5MTc2NiwiZXhwIjoyMDc3MjY3NzY2fQ.WQ-pkKcSnVWjNHis9XXukyiDS0BlZijjysGraY_h06Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250128_initial_schema.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('Connecting to Supabase...');
    console.log('Running migration...');

    // Execute the SQL using the RPC method
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('Database schema created with all tables and policies.');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();
