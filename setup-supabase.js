import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up Supabase database...');
    
    // Create all tables
    await client.query(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table created');

    await client.query(`
      -- Courses table
      CREATE TABLE IF NOT EXISTS courses (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          description TEXT NOT NULL,
          duration VARCHAR(100) NOT NULL,
          prerequisites TEXT,
          mode VARCHAR(50) NOT NULL,
          level VARCHAR(50) NOT NULL,
          price INTEGER,
          features TEXT[],
          syllabus_url VARCHAR(500),
          batch_dates TEXT[],
          icon VARCHAR(100) NOT NULL,
          category VARCHAR(100) NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Courses table created');

    await client.query(`
      -- Quizzes table
      CREATE TABLE IF NOT EXISTS quizzes (
          id SERIAL PRIMARY KEY,
          course_id INTEGER REFERENCES courses(id),
          title VARCHAR(255) NOT NULL,
          questions JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Quizzes table created');

    await client.query(`
      -- Leads table
      CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          course_interest VARCHAR(255),
          source VARCHAR(100) NOT NULL,
          experience VARCHAR(100),
          message TEXT,
          quiz_results JSONB,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Leads table created');

    await client.query(`
      -- Blog posts table
      CREATE TABLE IF NOT EXISTS blog_posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          content TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          featured_image VARCHAR(500),
          author_id INTEGER,
          is_published BOOLEAN DEFAULT false,
          reading_time INTEGER DEFAULT 5,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Blog posts table created');

    await client.query(`
      -- Testimonials table
      CREATE TABLE IF NOT EXISTS testimonials (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          course_id INTEGER REFERENCES courses(id),
          course_name VARCHAR(255) NOT NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          review TEXT NOT NULL,
          job_title VARCHAR(255),
          company VARCHAR(255),
          image VARCHAR(500),
          is_approved BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Testimonials table created');

    await client.query(`
      -- FAQs table
      CREATE TABLE IF NOT EXISTS faqs (
          id SERIAL PRIMARY KEY,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          "order" INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ FAQs table created');

    // Insert sample admin user
    await client.query(`
      INSERT INTO users (email, password, role) VALUES 
      ('admin@cyberedus.com', '$2b$10$hash', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Sample admin user created');

    console.log('🎉 Supabase database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase().catch(console.error);