import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function updateSchema() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Connecting to database...');
    
    // First, check existing columns
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses'
      ORDER BY ordinal_position;
    `);
    
    console.log('Current columns:', checkColumns.rows.map(r => r.column_name));
    
    // Add the missing columns
    console.log('Adding new columns...');
    
    const alterTable = `
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
    
    await pool.query(alterTable);
    console.log('Schema updated successfully!');
    
    // Verify the update
    const verifyColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses'
      ORDER BY ordinal_position;
    `);
    
    console.log('Updated columns:', verifyColumns.rows.map(r => r.column_name));
    
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    await pool.end();
  }
}

updateSchema();