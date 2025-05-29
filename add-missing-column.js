import { Pool } from 'pg';

const DATABASE_URL = "postgresql://postgres.qjqujwxgkqvvzmabcytt:S57%24vq2Xh%26%40BDNa@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

async function addMissingColumn() {
  const pool = new Pool({ 
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Adding missing is_active column to courses table...');
    
    await pool.query(`
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
    
    console.log('✅ Successfully added is_active column');
    
    // Update any existing courses to have is_active = true
    const result = await pool.query(`
      UPDATE courses SET is_active = true WHERE is_active IS NULL;
    `);
    
    console.log(`✅ Updated ${result.rowCount} existing courses`);
    
  } catch (error) {
    console.error('❌ Error adding column:', error);
  } finally {
    await pool.end();
  }
}

addMissingColumn();