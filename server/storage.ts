import { Course, Quiz, BlogPost, Testimonial, FAQ, User } from '../shared/types';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | null>;
  createCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course | null>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Quiz operations
  getQuizByCourseId(courseId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz>;
  updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz | null>;
  deleteQuiz(id: number): Promise<boolean>;
  
  // Lead operations
  createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role' | 'email' | 'createdAt'>>;
  getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role' | 'email' | 'createdAt'>[]>;
  
  // Blog operations
  getAllBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | null>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Testimonial operations
  getAllTestimonials(approved?: boolean): Promise<Testimonial[]>;
  getTestimonialsByCourse(courseId: number): Promise<Testimonial[]>;
  createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | null>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // FAQ operations
  getAllFAQs(active?: boolean): Promise<FAQ[]>;
  createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ>;
  updateFAQ(id: number, faq: Partial<FAQ>): Promise<FAQ | null>;
  deleteFAQ(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private users: User[] = [];
  private courses: Course[] = [];
  private quizzes: Quiz[] = [];
  private blogPosts: BlogPost[] = [];
  private testimonials: Testimonial[] = [];
  private faqs: FAQ[] = [];
  private leads: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[] = [];
  private nextId: number = 1;

  constructor() {
    this.seedData();
  }

  private getNextId(): number {
    return this.nextId++;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.getNextId(),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courses;
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    return this.courses.find(course => course.slug === slug) || null;
  }

  async createCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: this.getNextId(),
      createdAt: new Date(),
      isActive: true,
      syllabusUrl: null,
      overview: null,
      mainImage: null,
      logo: null,
      price: null,
      features: null,
      batchDates: [],
      category: course.category,
      icon: course.icon,
      prerequisites: course.prerequisites ?? null,
      level: course.level,
      duration: course.duration,
      description: course.description,
      mode: course.mode,
      title: course.title
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<Course>): Promise<Course | null> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.courses[index] = { ...this.courses[index], ...course };
    return this.courses[index];
  }

  async deleteCourse(id: number): Promise<boolean> {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(c => c.id !== id);
    return this.courses.length < initialLength;
  }

  async getQuizByCourseId(courseId: number): Promise<Quiz | undefined> {
    return this.quizzes.find(quiz => quiz.courseId === courseId);
  }

  async createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> {
    const newQuiz: Quiz = {
      ...quiz,
      id: this.getNextId(),
      createdAt: new Date(),
      courseId: quiz.courseId ?? null,
      questions: quiz.questions
    };
    this.quizzes.push(newQuiz);
    return newQuiz;
  }

  async updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz | null> {
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) return null;
    this.quizzes[index] = { ...this.quizzes[index], ...quiz };
    return this.quizzes[index];
  }

  async deleteQuiz(id: number): Promise<boolean> {
    const initialLength = this.quizzes.length;
    this.quizzes = this.quizzes.filter(q => q.id !== id);
    return this.quizzes.length < initialLength;
  }

  async createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role' | 'email' | 'createdAt'>> {
    this.leads.push(lead);
    return {
      email: lead.email
    };
  }

  async getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role' | 'email' | 'createdAt'>[]> {
    return this.leads;
  }

  async getAllBlogPosts(published?: boolean): Promise<BlogPost[]> {
    if (published !== undefined) {
      return this.blogPosts.filter(post => post.isPublished === published);
    }
    return this.blogPosts;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.find(post => post.slug === slug);
  }

  async createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: this.getNextId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      featuredImage: post.featuredImage ?? null,
      authorId: post.authorId ?? null,
      isPublished: post.isPublished ?? false,
      readingTime: post.readingTime ?? 0
    };
    this.blogPosts.push(newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | null> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.blogPosts[index] = { ...this.blogPosts[index], ...post };
    return this.blogPosts[index];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const initialLength = this.blogPosts.length;
    this.blogPosts = this.blogPosts.filter(p => p.id !== id);
    return this.blogPosts.length < initialLength;
  }

  async getAllTestimonials(approved?: boolean): Promise<Testimonial[]> {
    if (approved !== undefined) {
      return this.testimonials.filter(testimonial => testimonial.isApproved === approved);
    }
    return this.testimonials;
  }

  async getTestimonialsByCourse(courseId: number): Promise<Testimonial[]> {
    return this.testimonials.filter(testimonial => testimonial.courseId === courseId);
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: this.getNextId(),
      createdAt: new Date(),
      courseId: testimonial.courseId ?? null,
      jobTitle: testimonial.jobTitle ?? null,
      company: testimonial.company ?? null,
      image: testimonial.image ?? null,
      isApproved: testimonial.isApproved ?? false
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | null> {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.testimonials[index] = { ...this.testimonials[index], ...testimonial };
    return this.testimonials[index];
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const initialLength = this.testimonials.length;
    this.testimonials = this.testimonials.filter(t => t.id !== id);
    return this.testimonials.length < initialLength;
  }

  async getAllFAQs(active?: boolean): Promise<FAQ[]> {
    if (active !== undefined) {
      return this.faqs.filter(faq => faq.isActive === active);
    }
    return this.faqs;
  }

  async createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const newFAQ: FAQ = {
      ...faq,
      id: this.getNextId(),
      isActive: faq.isActive ?? true,
      order: faq.order ?? 0
    };
    this.faqs.push(newFAQ);
    return newFAQ;
  }

  async updateFAQ(id: number, faq: Partial<FAQ>): Promise<FAQ | null> {
    const index = this.faqs.findIndex(f => f.id === id);
    if (index === -1) return null;
    this.faqs[index] = { ...this.faqs[index], ...faq };
    return this.faqs[index];
  }

  async deleteFAQ(id: number): Promise<boolean> {
    const initialLength = this.faqs.length;
    this.faqs = this.faqs.filter(f => f.id !== id);
    return this.faqs.length < initialLength;
  }

  private seedData() {
    const usersData: Omit<User, 'id' | 'createdAt'>[] = [
      { email: 'admin@cyberedus.com', password: 'password', role: 'admin' },
      { email: 'user@example.com', password: 'password', role: 'user' }
    ];
    usersData.forEach(user => this.createUser(user));

    const coursesData: Omit<Course, 'id' | 'createdAt'>[] = [
      {
        title: 'Cybersecurity Fundamentals',
        slug: 'cybersecurity-fundamentals',
        description: 'Learn the basics of cybersecurity.',
        duration: '4 weeks',
        prerequisites: 'None',
        mode: 'Online',
        level: 'Beginner',
        price: 499,
        features: ['Certificate', 'Labs'],
        syllabusUrl: 'https://example.com/syllabus/cybersecurity.pdf',
        overview: 'Comprehensive introduction to cybersecurity concepts.',
        mainImage: 'https://example.com/images/cybersecurity.jpg',
        logo: 'https://example.com/logos/cybersecurity.png',
        icon: 'security',
        category: 'Cybersecurity',
        batchDates: ['2024-07-01', '2024-08-01'],
        isActive: true,
        batches: null,
        curriculum: null,
        fees: null,
        careerOpportunities: '',
        toolsAndTechnologies: '',
        whatYouWillLearn: ''
      },
      {
        title: 'Advanced Ethical Hacking',
        slug: 'advanced-ethical-hacking',
        description: 'Master advanced ethical hacking techniques.',
        duration: '8 weeks',
        prerequisites: 'Cybersecurity Fundamentals',
        mode: 'Hybrid',
        level: 'Advanced',
        price: 999,
        features: ['Certificate', 'Labs', 'Industry Project'],
        syllabusUrl: 'https://example.com/syllabus/ethical-hacking.pdf',
        overview: 'Deep dive into penetration testing and exploit development.',
        mainImage: 'https://example.com/images/ethical-hacking.jpg',
        logo: 'https://example.com/logos/ethical-hacking.png',
        icon: 'hacking',
        category: 'Cybersecurity',
        batchDates: ['2024-09-01'],
        isActive: true,
        batches: null,
        curriculum: null,
        fees: null,
        careerOpportunities: '',
        toolsAndTechnologies: '',
        whatYouWillLearn: ''
      }
    ];
    coursesData.forEach(course => this.createCourse(course));

    const quizzesData: Omit<Quiz, 'id' | 'createdAt'>[] = [
      {
        title: 'Cybersecurity Basics Quiz',
        courseId: 1,
        questions: [
          { question: 'What is phishing?', options: ['A fishing technique', 'A type of cyber attack', 'A programming language'], correct: 1 },
          { question: 'What is a firewall?', options: ['A wall of fire', 'A network security system', 'A type of virus'], correct: 1 }
        ]
      }
    ];
    quizzesData.forEach(quiz => this.createQuiz(quiz));

    const blogPostsData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'The Importance of Cybersecurity in 2024',
        slug: 'importance-of-cybersecurity-2024',
        category: 'Cybersecurity',
        content: '<p>Cybersecurity is crucial in today\\\'s digital age...</p>',
        excerpt: 'A brief overview of why cybersecurity is more important than ever.',
        featuredImage: 'https://example.com/blog/cybersecurity_importance.jpg',
        authorId: 1,
        isPublished: true,
        readingTime: 5
      },
      {
        title: 'Understanding Phishing Attacks',
        slug: 'understanding-phishing-attacks',
        category: 'Cybersecurity',
        content: '<p>Phishing attacks are a common threat...</p>',
        excerpt: 'Detailed explanation of how phishing attacks work and how to prevent them.',
        featuredImage: 'https://example.com/blog/phishing_attacks.jpg',
        authorId: 1,
        isPublished: true,
        readingTime: 7
      }
    ];
    blogPostsData.forEach(post => this.createBlogPost(post));

    const testimonialsData: Omit<Testimonial, 'id' | 'createdAt'>[] = [
      {
        name: 'Jane Doe',
        courseName: 'Cybersecurity Fundamentals',
        courseId: 1,
        rating: 5,
        review: 'Excellent course, highly recommend!',
        jobTitle: 'Software Engineer',
        company: 'TechCorp',
        image: 'https://example.com/testimonials/jane_doe.jpg',
        isApproved: true
      },
      {
        name: 'John Smith',
        courseName: 'Advanced Ethical Hacking',
        courseId: 2,
        rating: 4,
        review: 'Challenging but very rewarding.',
        jobTitle: 'Security Analyst',
        company: 'SecureIT',
        image: 'https://example.com/testimonials/john_smith.jpg',
        isApproved: true
      }
    ];
    testimonialsData.forEach(testimonial => this.createTestimonial(testimonial));

    const faqsData: Omit<FAQ, 'id'>[] = [
      {
        category: 'General',
        question: 'What is Cyberedus?',
        answer: 'Cyberedus is an online platform for cybersecurity education.',
        isActive: true,
        order: 1
      },
      {
        category: 'Courses',
        question: 'Do you offer certifications?',
        answer: 'Yes, all our courses come with a completion certificate.',
        isActive: true,
        order: 2
      }
    ];
    faqsData.forEach(faq => this.createFAQ(faq));

    // Add some sample courses
    this.courses.push({
      id: 1,
      title: "Web Development Bootcamp",
      slug: "web-development-bootcamp",
      description: "Learn full-stack web development",
      duration: "12 weeks",
      prerequisites: "Basic computer knowledge",
      level: "Beginner",
      price: 999,
      features: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      syllabusUrl: null,
      overview: null,
      mainImage: null,
      logo: null,
      icon: "code",
      category: "Web Development",
      batchDates: ["2024-03-01", "2024-04-01"],
      isActive: true,
      mode: "online",
      createdAt: new Date()
    });
  }
}

export const storage = new DatabaseStorage();