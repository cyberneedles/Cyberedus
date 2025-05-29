import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjqujwxgkqvvzmabcytt.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabaseSchema() {
  try {
    console.log('Connecting to Supabase...');
    
    // First, check current table structure
    const { data: columns, error: checkError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'courses' 
          ORDER BY ordinal_position;
        `
      });

    if (checkError) {
      console.log('Checking columns with direct query...');
      // Try a different approach - just query the table to see what exists
      const { data: testData, error: testError } = await supabase
        .from('courses')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('Error accessing courses table:', testError);
        return;
      }
      
      console.log('Current table structure detected from sample row:', Object.keys(testData[0] || {}));
    } else {
      console.log('Current columns:', columns?.map(c => c.column_name));
    }

    // Add the missing columns using SQL
    console.log('Adding missing columns...');
    
    const alterTableSQL = `
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS overview TEXT,
      ADD COLUMN IF NOT EXISTS main_image TEXT,
      ADD COLUMN IF NOT EXISTS logo TEXT,
      ADD COLUMN IF NOT EXISTS curriculum JSONB,
      ADD COLUMN IF NOT EXISTS batches JSONB,
      ADD COLUMN IF NOT EXISTS fees JSONB,
      ADD COLUMN IF NOT EXISTS career_opportunities JSONB,
      ADD COLUMN IF NOT EXISTS tools_and_technologies TEXT;
    `;

    const { data: result, error: alterError } = await supabase
      .rpc('exec_sql', { sql: alterTableSQL });

    if (alterError) {
      console.error('Error altering table:', alterError);
      
      // Try alternative approach with individual ALTER statements
      console.log('Trying individual column additions...');
      
      const columns = [
        'overview TEXT',
        'main_image TEXT', 
        'logo TEXT',
        'curriculum JSONB',
        'batches JSONB',
        'fees JSONB',
        'career_opportunities JSONB',
        'tools_and_technologies TEXT'
      ];
      
      for (const column of columns) {
        const { error: columnError } = await supabase
          .rpc('exec_sql', {
            sql: `ALTER TABLE courses ADD COLUMN IF NOT EXISTS ${column};`
          });
        
        if (columnError) {
          console.log(`Column ${column} might already exist or error:`, columnError.message);
        } else {
          console.log(`Added column: ${column}`);
        }
      }
    } else {
      console.log('Schema updated successfully!');
    }

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
    
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
    } else {
      console.log('Verification - available columns:', Object.keys(verifyData[0] || {}));
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateDatabaseSchema();