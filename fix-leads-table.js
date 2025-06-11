import { Pool } from 'pg';

async function fixLeadsTable() {
  const pool = new Pool({ 
    connectionString: 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('🔧 Fixing leads table...');
    
    // Drop the existing leads table
    await pool.query('DROP TABLE IF EXISTS leads CASCADE;');
    console.log('✅ Dropped existing leads table');
    
    // Recreate the leads table with the correct schema
    await pool.query(`
      CREATE TABLE leads (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        course_interest VARCHAR(255),
        source VARCHAR(100) NOT NULL,
        experience VARCHAR(50),
        message TEXT,
        current_location TEXT,
        quiz_results JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Recreated leads table with current_location column');
    
    console.log('🎉 Leads table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixLeadsTable(); 