import { Pool } from 'pg';

const DATABASE_URL = "postgresql://postgres.qjqujwxgkqvvzmabcytt:S57$vq2Xh&@BDNa@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

async function setupNewSupabase() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Connecting to your new Supabase database...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');

    console.log('🔄 Creating database tables...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        duration VARCHAR(100),
        mode VARCHAR(50),
        level VARCHAR(50),
        icon VARCHAR(100),
        category VARCHAR(100),
        prerequisites TEXT,
        price DECIMAL(10,2),
        features JSONB,
        syllabus_url VARCHAR(255),
        batch_dates VARCHAR[],
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create leads table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        source VARCHAR(100) NOT NULL,
        course_interest VARCHAR(255),
        experience VARCHAR(100),
        message TEXT,
        quiz_results JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create testimonials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        course_id INTEGER,
        course_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT NOT NULL,
        job_title VARCHAR(255),
        company VARCHAR(255),
        image VARCHAR(255),
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create blog_posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        featured_image VARCHAR(255),
        author_id INTEGER,
        is_published BOOLEAN DEFAULT false,
        reading_time INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create quizzes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        course_id INTEGER,
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create faqs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0
      );
    `);

    console.log('✅ All tables created successfully!');

    console.log('🔄 Creating admin user...');
    
    // Create admin user
    await pool.query(`
      INSERT INTO users (email, password, role) 
      VALUES ('admin@cyberedus.com', 'secure_admin_2024', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log('✅ Admin user created!');
    console.log('🎉 Database setup complete!');
    console.log('');
    console.log('📧 Admin Login Credentials:');
    console.log('   Email: admin@cyberedus.com');
    console.log('   Password: secure_admin_2024');
    console.log('');

    await pool.end();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

setupNewSupabase();