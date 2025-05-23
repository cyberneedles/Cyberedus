import { 
  users, 
  courses, 
  quizzes, 
  leads, 
  blogPosts, 
  testimonials, 
  faqs,
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type Quiz,
  type InsertQuiz,
  type Lead,
  type InsertLead,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial,
  type FAQ,
  type InsertFAQ
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  
  // Quiz operations
  getQuizByCourseId(courseId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  
  // Blog operations
  getAllBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Testimonial operations
  getAllTestimonials(approved?: boolean): Promise<Testimonial[]>;
  getTestimonialsByCourse(courseId: number): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // FAQ operations
  getAllFAQs(active?: boolean): Promise<FAQ[]>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private quizzes: Map<number, Quiz>;
  private leads: Map<number, Lead>;
  private blogPosts: Map<number, BlogPost>;
  private testimonials: Map<number, Testimonial>;
  private faqs: Map<number, FAQ>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.quizzes = new Map();
    this.leads = new Map();
    this.blogPosts = new Map();
    this.testimonials = new Map();
    this.faqs = new Map();
    this.currentId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentId++,
      email: "admin@cyberedus.com",
      password: "admin123", // In production, this should be hashed
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Seed courses
    const courseData = [
      {
        title: "Certified Ethical Hacker (CEH)",
        slug: "certified-ethical-hacker-ceh",
        description: "EC-Council certified program covering cyber threats, penetration testing, and security tools. Perfect for beginners.",
        duration: "40 Hours",
        prerequisites: "Basic computer knowledge",
        mode: "both",
        level: "beginner",
        price: 25000,
        features: ["EC-Council Certification", "Hands-on Labs", "Real-world Scenarios", "Industry Tools"],
        icon: "fas fa-shield-alt",
        category: "cybersecurity",
        batchDates: ["2024-02-15", "2024-03-01", "2024-03-15"],
      },
      {
        title: "Advanced Cybersecurity Mastery",
        slug: "advanced-cybersecurity-mastery",
        description: "Deep dive into SIEM, threat hunting, cloud security, and red teaming for cybersecurity professionals.",
        duration: "90 Hours",
        prerequisites: "Some IT/Networking knowledge preferred",
        mode: "both",
        level: "intermediate",
        price: 45000,
        features: ["SIEM Training", "Threat Hunting", "Cloud Security", "Red Teaming"],
        icon: "fas fa-brain",
        category: "cybersecurity",
        batchDates: ["2024-02-20", "2024-03-10", "2024-04-01"],
      },
      {
        title: "Bug Bounty Program",
        slug: "bug-bounty-program",
        description: "Learn ethical bug hunting with real-world vulnerability simulation on HackerOne & Bugcrowd platforms.",
        duration: "3.5 Months",
        prerequisites: "Familiarity with networking & OSI layers",
        mode: "both",
        level: "intermediate",
        price: 35000,
        features: ["HackerOne Platform", "Bugcrowd Training", "Real Vulnerabilities", "Bounty Practice"],
        icon: "fas fa-bug",
        category: "cybersecurity",
        batchDates: ["2024-02-25", "2024-03-20", "2024-04-15"],
      },
      {
        title: "Full Stack Java Development",
        slug: "full-stack-java-development",
        description: "Complete web development with frontend, Spring Boot backend, MySQL, and cloud deployment.",
        duration: "3 Months",
        prerequisites: "Basic programming understanding",
        mode: "both",
        level: "intermediate",
        price: 30000,
        features: ["Spring Boot", "Frontend Development", "MySQL Database", "Cloud Deployment"],
        icon: "fab fa-java",
        category: "development",
        batchDates: ["2024-02-18", "2024-03-05", "2024-03-25"],
      },
      {
        title: "Python Programming",
        slug: "python-programming",
        description: "From basics to advanced web development with Flask/Django, automation, and data analysis.",
        duration: "2 Months",
        prerequisites: "None",
        mode: "both",
        level: "beginner",
        price: 20000,
        features: ["Flask/Django", "Automation", "Data Analysis", "Portfolio Projects"],
        icon: "fab fa-python",
        category: "development",
        batchDates: ["2024-02-12", "2024-02-28", "2024-03-18"],
      },
      {
        title: "Interview Preparation Bootcamp",
        slug: "interview-preparation-bootcamp",
        description: "Intensive preparation with aptitude, resume building, group discussions, and mock interviews.",
        duration: "2 Weeks",
        prerequisites: "Final-year students or job seekers",
        mode: "offline",
        level: "beginner",
        price: 5000,
        features: ["Mock Interviews", "Resume Building", "Group Discussions", "Aptitude Training"],
        icon: "fas fa-handshake",
        category: "career",
        batchDates: ["2024-02-26", "2024-03-12", "2024-03-26"],
      },
    ];

    courseData.forEach(course => {
      const newCourse: Course = {
        id: this.currentId++,
        ...course,
        isActive: true,
        createdAt: new Date(),
      };
      this.courses.set(newCourse.id, newCourse);
    });

    // Seed testimonials
    const testimonialData = [
      {
        name: "Rohit Mehta",
        courseId: 1,
        courseName: "CEH",
        rating: 5,
        review: "The CEH course at CyberEdu completely transformed my career. The hands-on labs and real-world scenarios helped me land a cybersecurity analyst role at a top IT company.",
        jobTitle: "Cybersecurity Analyst",
        company: "TCS",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      },
      {
        name: "Ankita Singh",
        courseId: 4,
        courseName: "Full Stack Java",
        rating: 5,
        review: "The Full Stack Java program gave me all the skills I needed. The project-based learning approach and mentorship helped me transition from a non-tech background to a developer role.",
        jobTitle: "Software Developer",
        company: "Infosys",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      },
      {
        name: "Vikram Joshi",
        courseId: 2,
        courseName: "Advanced Cybersecurity",
        rating: 5,
        review: "As an experienced IT professional, the Advanced Cybersecurity Mastery program took my skills to the next level. The SIEM and threat hunting modules were exceptional.",
        jobTitle: "Security Consultant",
        company: "Independent",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      },
    ];

    testimonialData.forEach(testimonial => {
      const newTestimonial: Testimonial = {
        id: this.currentId++,
        ...testimonial,
        isApproved: true,
        createdAt: new Date(),
      };
      this.testimonials.set(newTestimonial.id, newTestimonial);
    });

    // Seed FAQs
    const faqData = [
      {
        question: "Do you provide placement assistance?",
        answer: "Yes, we provide comprehensive placement assistance including resume building, interview preparation, and direct connections with our 40+ industry partners. While we don't guarantee placement, we provide real support and mentoring to help you succeed.",
        category: "placement",
        order: 1,
      },
      {
        question: "What is the 80% practical approach?",
        answer: "Our curriculum is designed with 80% hands-on practice and 20% theory. Students work on real projects, use industry tools, and solve actual cybersecurity challenges rather than just learning concepts.",
        category: "curriculum",
        order: 2,
      },
      {
        question: "Are there any prerequisites for cybersecurity courses?",
        answer: "For CEH, you only need basic computer knowledge. For Advanced Cybersecurity, some IT/networking knowledge is preferred. For Bug Bounty, familiarity with networking & OSI layers is recommended.",
        category: "prerequisites",
        order: 3,
      },
    ];

    faqData.forEach(faq => {
      const newFaq: FAQ = {
        id: this.currentId++,
        ...faq,
        isActive: true,
      };
      this.faqs.set(newFaq.id, newFaq);
    });

    // Seed sample quizzes
    const sampleQuiz: Quiz = {
      id: this.currentId++,
      courseId: 1,
      title: "CEH Assessment Quiz",
      questions: [
        {
          question: "What does CEH stand for?",
          options: ["Certified Ethical Hacker", "Computer Ethics Hacker", "Cyber Ethical Handler", "Certified Expert Hacker"],
          correct: 0
        },
        {
          question: "Which of the following is a passive reconnaissance technique?",
          options: ["Port scanning", "Social engineering", "WHOIS lookup", "Vulnerability scanning"],
          correct: 2
        },
        {
          question: "What is the primary goal of ethical hacking?",
          options: ["To cause damage", "To find vulnerabilities", "To steal data", "To disrupt services"],
          correct: 1
        }
      ],
      createdAt: new Date(),
    };
    this.quizzes.set(sampleQuiz.id, sampleQuiz);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.isActive);
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    return Array.from(this.courses.values()).find(course => course.slug === slug);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentId++;
    const course: Course = {
      ...insertCourse,
      id,
      createdAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: number, courseUpdate: Partial<InsertCourse>): Promise<Course | undefined> {
    const existing = this.courses.get(id);
    if (!existing) return undefined;
    
    const updated: Course = { ...existing, ...courseUpdate };
    this.courses.set(id, updated);
    return updated;
  }

  async getQuizByCourseId(courseId: number): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(quiz => quiz.courseId === courseId);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentId++;
    const quiz: Quiz = {
      ...insertQuiz,
      id,
      createdAt: new Date(),
    };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async updateQuiz(id: number, quizUpdate: Partial<InsertQuiz>): Promise<Quiz | undefined> {
    const existing = this.quizzes.get(id);
    if (!existing) return undefined;
    
    const updated: Quiz = { ...existing, ...quizUpdate };
    this.quizzes.set(id, updated);
    return updated;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentId++;
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAllBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    if (published !== undefined) {
      return posts.filter(post => post.isPublished === published);
    }
    return posts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentId++;
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, postUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated: BlogPost = { 
      ...existing, 
      ...postUpdate,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async getAllTestimonials(approved?: boolean): Promise<Testimonial[]> {
    const testimonials = Array.from(this.testimonials.values());
    if (approved !== undefined) {
      return testimonials.filter(t => t.isApproved === approved);
    }
    return testimonials.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTestimonialsByCourse(courseId: number): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(t => t.courseId === courseId && t.isApproved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId++;
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      createdAt: new Date(),
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async getAllFAQs(active?: boolean): Promise<FAQ[]> {
    const faqs = Array.from(this.faqs.values());
    if (active !== undefined) {
      return faqs.filter(faq => faq.isActive === active);
    }
    return faqs.sort((a, b) => a.order - b.order);
  }

  async createFAQ(insertFaq: InsertFAQ): Promise<FAQ> {
    const id = this.currentId++;
    const faq: FAQ = {
      ...insertFaq,
      id,
    };
    this.faqs.set(id, faq);
    return faq;
  }
}

export const storage = new MemStorage();
