import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function updateSchema() {
  // Use the exact connection string from your .env
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  
  try {
    console.log('Connecting to database...');
    
    // Check current columns
    const checkColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Current columns:');
    checkColumns.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    // Add missing columns one by one
    const columnsToAdd = [
      { name: 'overview', type: 'TEXT' },
      { name: 'main_image', type: 'TEXT' },
      { name: 'logo', type: 'TEXT' },
      { name: 'curriculum', type: 'JSONB' },
      { name: 'batches', type: 'JSONB' },
      { name: 'fees', type: 'JSONB' },
      { name: 'career_opportunities', type: 'JSONB' },
      { name: 'tools_and_technologies', type: 'TEXT' }
    ];
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        try {
          console.log(`Adding column: ${column.name}`);
          await pool.query(`ALTER TABLE courses ADD COLUMN ${column.name} ${column.type};`);
          console.log(`✓ Successfully added ${column.name}`);
        } catch (error) {
          console.log(`× Error adding ${column.name}:`, error.message);
        }
      } else {
        console.log(`✓ Column ${column.name} already exists`);
      }
    }
    
    // Verify final structure
    const finalCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\nFinal table structure:');
    finalCheck.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    console.log('\nSchema update completed!');
    
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    await pool.end();
  }
}

updateSchema();