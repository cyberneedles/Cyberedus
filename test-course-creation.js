const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { courses } = require('./shared/schema');

async function testCourseCreation() {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    const newCourse = {
      title: "Certified Ethical Hacker (CEH)",
      slug: "certified-ethical-hacker-ceh",
      description: "The Certified Ethical Hacker (CEH) program is a widely recognized cybersecurity certification that focuses on ethical hacking techniques.",
      duration: "16",
      mode: "Online",
      level: "Intermediate",
      category: "Cybersecurity",
      icon: "Shield",
      price: 125000,
      prerequisites: null,
      features: ["Hands-on labs", "Industry certification", "Expert instruction"],
      syllabusUrl: null,
      batchDates: ["2024-02-01", "2024-03-01"],
      isActive: true
    };

    console.log("Creating course:", newCourse);
    
    const [createdCourse] = await db
      .insert(courses)
      .values(newCourse)
      .returning();

    console.log("Course created successfully:", createdCourse);
    
    // Close the connection
    await pool.end();
    
  } catch (error) {
    console.error("Error creating course:", error);
  }
}

testCourseCreation();