import { Pool } from 'pg';

async function migrateLeadsTable() {
  const pool = new Pool({ 
    connectionString: 'postgresql://postgres.nnkkbbbbpvmpvmrhovwu:Needle%4010041010@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('🔧 Migrating leads table...');
    
    // Check if current_location column exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'leads' AND column_name = 'current_location'
    `);
    
    if (checkColumn.rows.length === 0) {
      // Add the missing current_location column
      await pool.query(`
        ALTER TABLE leads 
        ADD COLUMN current_location TEXT
      `);
      console.log('✅ Added current_location column to leads table');
    } else {
      console.log('ℹ️  current_location column already exists');
    }
    
    // Verify the column was added
    const verifyColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leads' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Current leads table columns:');
    verifyColumns.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateLeadsTable().catch(console.error); 