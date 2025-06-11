import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing backend database connection...');
console.log('📊 DATABASE_URL from env:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

// Use the same connection logic as the backend
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testBackendConnection() {
  try {
    console.log('🔌 Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    
    // Check database info
    const dbInfo = await client.query('SELECT current_database() as db, current_schema() as schema');
    console.log('📊 Connected to database:', dbInfo.rows[0].db);
    console.log('📊 Using schema:', dbInfo.rows[0].schema);
    
    // Check leads table columns
    const columns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'leads' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Leads table columns:');
    columns.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });
    
    // Check if current_location exists
    const currentLocationExists = columns.rows.find(col => col.column_name === 'current_location');
    if (currentLocationExists) {
      console.log('\n✅ current_location column EXISTS in backend connection');
    } else {
      console.log('\n❌ current_location column DOES NOT EXIST in backend connection');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  } finally {
    await pool.end();
  }
}

testBackendConnection().catch(console.error); 