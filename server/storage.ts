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
  createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>>;
  getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[]>;
  
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
      syllabusUrl: course.syllabusUrl ?? null,
      overview: course.overview ?? null,
      mainImage: course.mainImage ?? null,
      logo: course.logo ?? null,
      price: course.price ?? null,
      features: course.features ?? null,
      batchDates: course.batchDates || [],
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

  async createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>> {
    this.leads.push(lead);
    return lead;
  }

  async getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[]> {
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
    // Seed initial data for development/testing
    if (this.users.length === 0) {
      this.users.push({
        id: this.getNextId(),
        email: 'admin@example.com',
        password: 'hashed_password', // In a real app, this would be hashed
        role: 'admin',
        createdAt: new Date(),
      });
      this.users.push({
        id: this.getNextId(),
        email: 'user@example.com',
        password: 'hashed_password',
        role: 'user',
        createdAt: new Date(),
      });
    }

    if (this.courses.length === 0) {
      this.courses.push({
        id: this.getNextId(),
        mode: 'online',
        createdAt: new Date(),
        title: 'Introduction to Cybersecurity',
        slug: 'intro-cybersecurity',
        description: 'Learn the basics of cybersecurity.',
        duration: '4 weeks',
        prerequisites: null,
        level: 'Beginner',
        price: 499,
        features: ['Live classes', 'Certificate'],
        syllabusUrl: '',
        overview: '',
        mainImage: '',
        logo: '',
        icon: 'shield',
        category: 'Cybersecurity',
        batchDates: ['2024-09-01', '2024-10-01'],
        isActive: true,
      });
    }

    if (this.quizzes.length === 0) {
      this.quizzes.push({
        id: this.getNextId(),
        createdAt: new Date(),
        title: 'Cybersecurity Basics Quiz',
        courseId: 1,
        questions: [
          {
            question: 'What is phishing?',
            options: ['A type of malware', 'A social engineering attack', 'A network protocol', 'A security tool'],
            correct: 1,
          },
        ],
      });
    }

    if (this.blogPosts.length === 0) {
      this.blogPosts.push({
        id: this.getNextId(),
        createdAt: new Date(),
        title: 'The Importance of Data Encryption',
        slug: 'data-encryption',
        category: 'Security',
        content: 'Detailed content about data encryption...',
        excerpt: 'A brief overview of data encryption.',
        featuredImage: null,
        authorId: 1,
        isPublished: true,
        readingTime: 5,
        updatedAt: new Date(),
      });
    }

    if (this.testimonials.length === 0) {
      this.testimonials.push({
        id: this.getNextId(),
        name: 'John Doe',
        createdAt: new Date(),
        courseId: 1,
        courseName: 'Introduction to Cybersecurity',
        rating: 5,
        review: 'Great course, highly recommend!',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        image: null,
        isApproved: true,
      });
    }

    if (this.faqs.length === 0) {
      this.faqs.push({
        id: this.getNextId(),
        category: 'General',
        isActive: true,
        question: 'How do I enroll in a course?',
        answer: 'You can enroll by visiting the course page and clicking the \"Enroll Now\" button.',
        order: 1,
      });
    }
  }
}

export class MemStorage implements IStorage {
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
      syllabusUrl: course.syllabusUrl ?? null,
      overview: course.overview ?? null,
      mainImage: course.mainImage ?? null,
      logo: course.logo ?? null,
      price: course.price ?? null,
      features: course.features ?? null,
      batchDates: course.batchDates || [],
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

  async createLead(lead: Omit<User, 'id' | 'createdAt' | 'password' | 'role'>): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>> {
    this.leads.push(lead);
    return lead;
  }

  async getAllLeads(): Promise<Omit<User, 'id' | 'createdAt' | 'password' | 'role'>[]> {
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
    // Seed initial data for development/testing
    if (this.users.length === 0) {
      this.users.push({
        id: this.getNextId(),
        email: 'admin@example.com',
        password: 'hashed_password', // In a real app, this would be hashed
        role: 'admin',
        createdAt: new Date(),
      });
      this.users.push({
        id: this.getNextId(),
        email: 'user@example.com',
        password: 'hashed_password',
        role: 'user',
        createdAt: new Date(),
      });
    }

    if (this.courses.length === 0) {
      this.courses.push({
        id: this.getNextId(),
        mode: 'online',
        createdAt: new Date(),
        title: 'Introduction to Cybersecurity',
        slug: 'intro-cybersecurity',
        description: 'Learn the basics of cybersecurity.',
        duration: '4 weeks',
        prerequisites: null,
        level: 'Beginner',
        price: 499,
        features: ['Live classes', 'Certificate'],
        syllabusUrl: '',
        overview: '',
        mainImage: '',
        logo: '',
        icon: 'shield',
        category: 'Cybersecurity',
        batchDates: ['2024-09-01', '2024-10-01'],
        isActive: true,
      });
    }

    if (this.quizzes.length === 0) {
      this.quizzes.push({
        id: this.getNextId(),
        createdAt: new Date(),
        title: 'Cybersecurity Basics Quiz',
        courseId: 1,
        questions: [
          {
            question: 'What is phishing?',
            options: ['A type of malware', 'A social engineering attack', 'A network protocol', 'A security tool'],
            correct: 1,
          },
        ],
      });
    }

    if (this.blogPosts.length === 0) {
      this.blogPosts.push({
        id: this.getNextId(),
        createdAt: new Date(),
        title: 'The Importance of Data Encryption',
        slug: 'data-encryption',
        category: 'Security',
        content: 'Detailed content about data encryption...',
        excerpt: 'A brief overview of data encryption.',
        featuredImage: null,
        authorId: 1,
        isPublished: true,
        readingTime: 5,
        updatedAt: new Date(),
      });
    }

    if (this.testimonials.length === 0) {
      this.testimonials.push({
        id: this.getNextId(),
        name: 'John Doe',
        createdAt: new Date(),
        courseId: 1,
        courseName: 'Introduction to Cybersecurity',
        rating: 5,
        review: 'Great course, highly recommend!',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        image: null,
        isApproved: true,
      });
    }

    if (this.faqs.length === 0) {
      this.faqs.push({
        id: this.getNextId(),
        category: 'General',
        isActive: true,
        question: 'How do I enroll in a course?',
        answer: 'You can enroll by visiting the course page and clicking the \"Enroll Now\" button.',
        order: 1,
      });
    }
  }
}