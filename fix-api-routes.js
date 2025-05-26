import { storage } from './server/storage.js';

// Direct course creation bypass for immediate fix
export async function createCourseDirectly(courseData) {
  try {
    console.log("Creating course directly:", courseData);
    const course = await storage.createCourse(courseData);
    console.log("Course created successfully:", course);
    return course;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}

// Test the fix
const testCourse = {
  title: "Direct API Test Course",
  slug: "direct-api-test", 
  description: "Testing direct API creation",
  duration: "4 weeks",
  mode: "online",
  level: "beginner", 
  category: "cybersecurity",
  icon: "shield"
};

createCourseDirectly(testCourse)
  .then(course => {
    console.log("✅ SUCCESS! Course created:", course.title);
    process.exit(0);
  })
  .catch(error => {
    console.log("❌ FAILED:", error.message);
    process.exit(1);
  });