import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjqujwxgkqvvzmabcytt.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcXVqd3hna3F2dnptYWJjeXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODA3NjMwMiwiZXhwIjoyMDYzNjUyMzAyfQ.J3MjjqT76vOttVH9j1mXfmhjYa4V3ERmBw783jOTWzU';

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addMissingColumns() {
  console.log('Connecting to Supabase with service role...');
  
  try {
    // Check current table structure
    const { data: existingData, error: checkError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('Error accessing courses table:', checkError);
      return;
    }
    
    const existingColumns = Object.keys(existingData[0] || {});
    console.log('Current columns:', existingColumns);
    
    // Define the columns we need to add
    const requiredColumns = [
      'overview',
      'main_image', 
      'logo',
      'curriculum',
      'batches',
      'fees',
      'career_opportunities',
      'tools_and_technologies'
    ];
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    console.log('Missing columns:', missingColumns);
    
    if (missingColumns.length === 0) {
      console.log('All required columns already exist!');
      return;
    }
    
    // Add missing columns using direct SQL execution via REST API
    const alterSQL = `
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
    
    console.log('Executing ALTER TABLE command...');
    
    // Use the REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({ sql: alterSQL })
    });
    
    if (!response.ok) {
      // If exec_sql doesn't exist, try direct SQL endpoint
      console.log('Trying alternative method...');
      
      // Use pg_dump style approach or try individual columns
      const columnSpecs = [
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS overview TEXT;',
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS main_image TEXT;',
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS logo TEXT;',
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS curriculum JSONB;',
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS batches JSONB;',
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS fees JSONB;',
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS career_opportunities JSONB;',
        'ALTER TABLE courses ADD COLUMN IF NOT EXISTS tools_and_technologies TEXT;'
      ];
      
      for (const sql of columnSpecs) {
        try {
          const colResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
              'apikey': serviceRoleKey
            },
            body: JSON.stringify({ sql })
          });
          
          if (colResponse.ok) {
            console.log('✓ Successfully executed:', sql);
          } else {
            console.log('× Failed to execute:', sql);
          }
        } catch (err) {
          console.log('Error with individual column:', err.message);
        }
      }
    } else {
      console.log('✓ Successfully executed ALTER TABLE command');
    }
    
    // Verify the changes
    console.log('Verifying changes...');
    const { data: updatedData, error: verifyError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
    
    if (verifyError) {
      console.error('Error verifying changes:', verifyError);
    } else {
      const finalColumns = Object.keys(updatedData[0] || {});
      console.log('Final columns:', finalColumns);
      
      const stillMissing = requiredColumns.filter(col => !finalColumns.includes(col));
      if (stillMissing.length === 0) {
        console.log('🎉 All columns successfully added!');
      } else {
        console.log('Still missing:', stillMissing);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addMissingColumns();