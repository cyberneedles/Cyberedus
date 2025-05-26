// Direct API test to bypass Vite middleware
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { courses } = require('./shared/schema');

async function testDirectCourseCreation() {
  try {
    console.log("Testing direct course creation...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not found");
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    const courseData = {
      title: "Test Course Direct",
      slug: "test-course-direct",
      description: "Test description",
      duration: "4 weeks",
      mode: "online",
      level: "beginner",
      category: "cybersecurity",
      icon: "shield",
      price: 199,
      prerequisites: "None",
      features: ["hands-on labs"],
      syllabusUrl: "",
      batchDates: ["2024-06-01"],
      isActive: true
    };

    const [newCourse] = await db.insert(courses).values(courseData).returning();
    console.log("✅ Course created successfully:", newCourse);
    
    // Test fetching courses
    const allCourses = await db.select().from(courses);
    console.log("✅ Total courses in database:", allCourses.length);

    await pool.end();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testDirectCourseCreation();