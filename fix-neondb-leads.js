import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the same connection logic as the backend
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixNeondbLeads() {
  try {
    console.log('🔧 Fixing leads table in neondb...');
    
    const client = await pool.connect();
    
    // Check database info
    const dbInfo = await client.query('SELECT current_database() as db, current_schema() as schema');
    console.log('📊 Working on database:', dbInfo.rows[0].db);
    
    // Check if current_location column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'leads' AND column_name = 'current_location'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('🔧 Adding current_location column...');
      await client.query('ALTER TABLE leads ADD COLUMN current_location TEXT');
      console.log('✅ Successfully added current_location column');
    } else {
      console.log('ℹ️  current_location column already exists');
    }
    
    // Verify the column was added
    const verifyColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Updated leads table columns:');
    verifyColumns.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });
    
    client.release();
    console.log('\n🎉 Database fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixNeondbLeads().catch(console.error); 