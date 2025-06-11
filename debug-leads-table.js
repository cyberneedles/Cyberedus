import { Pool } from 'pg';

async function debugLeadsTable() {
  const pool = new Pool({ 
    connectionString: 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('🔍 Debugging leads table...');
    
    // Check current database and schema
    const dbInfo = await pool.query('SELECT current_database() as db, current_schema() as schema');
    console.log('📊 Database:', dbInfo.rows[0].db);
    console.log('📊 Schema:', dbInfo.rows[0].schema);
    
    // Check if leads table exists
    const tableExists = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'leads' AND table_schema = 'public'
    `);
    
    if (tableExists.rows.length === 0) {
      console.log('❌ Leads table does not exist!');
      return;
    }
    
    console.log('✅ Leads table exists');
    
    // Get all columns with detailed info
    const columns = await pool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        ordinal_position
      FROM information_schema.columns 
      WHERE table_name = 'leads' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current leads table columns:');
    columns.rows.forEach(row => {
      console.log(`   ${row.ordinal_position}. ${row.column_name} (${row.data_type}) - Nullable: ${row.is_nullable}`);
    });
    
    // Check if current_location column exists specifically
    const currentLocationExists = columns.rows.find(col => col.column_name === 'current_location');
    if (currentLocationExists) {
      console.log('\n✅ current_location column EXISTS');
    } else {
      console.log('\n❌ current_location column DOES NOT EXIST');
      
      // Try to add it
      console.log('🔧 Attempting to add current_location column...');
      try {
        await pool.query('ALTER TABLE leads ADD COLUMN current_location TEXT');
        console.log('✅ Successfully added current_location column');
      } catch (error) {
        console.log('❌ Failed to add column:', error.message);
      }
    }
    
    // Show sample data if any exists
    const sampleData = await pool.query('SELECT * FROM leads LIMIT 3');
    if (sampleData.rows.length > 0) {
      console.log('\n📄 Sample leads data:');
      sampleData.rows.forEach((row, index) => {
        console.log(`   Lead ${index + 1}:`, row);
      });
    } else {
      console.log('\n📄 No leads data found');
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await pool.end();
  }
}

debugLeadsTable().catch(console.error); 