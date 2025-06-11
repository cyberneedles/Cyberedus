import { db, pool } from './server/db.js';
import { courses } from './shared/schema.js';

async function testCourseCreation() {
  try {
    const newCourse = {
      title: "Certified Ethical Hacker (CEH)",
      slug: "certified-ethical-hacker-ceh",
      description: "The Certified Ethical Hacker (CEH) program is a widely recognized cybersecurity certification that focuses on ethical hacking techniques.",
      duration: "16",
      mode: "online",
      level: "beginner",
      category: "Cybersecurity",
      icon: "shield",
      price: 125000,
      prerequisites: "",
      overview: "The CEH course teaches how to:\n\nIdentify system vulnerabilities\n\nAnalyze threats\n\nUse tools and techniques hackers use\n\nPenetrate networks and systems (legally)\n\nSecure and harden systems",
      mainImage: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      logo: "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg",
      curriculum: [
        { sectionTitle: "Introduction to Ethical Hacking", items: ["What is Ethical Hacking?", "Types of Hackers", "Phases of Hacking"] },
        { sectionTitle: "Footprinting and Reconnaissance", items: ["Google Hacking", "Whois Lookup", "DNS Enumeration"] }
      ],
      batches: [
        { startDate: "2025-06-20", startTime: "10:00", endTime: "12:00", mode: "online", instructor: "John Doe" }
      ],
      fees: [
        { label: "Standard", amount: 12500, notes: "Includes course materials and certification exam voucher" }
      ],
      careerOpportunities: ["Ethical Hacker", "Penetration Tester", "Security Analyst"],
      toolsAndTechnologies: "Nmap\nWireshark\nMetasploit",
      whatYouWillLearn: "Vulnerability Assessment\nNetwork Scanning\nWeb Application Hacking",
      isActive: true
    };

    console.log("Creating course:", newCourse);
    
    const [createdCourse] = await db
      .insert(courses)
      .values(newCourse)
      .returning();

    console.log("Course created successfully:", createdCourse);
    
  } catch (error) {
    console.error("Error creating course:", error);
  }
}

testCourseCreation();