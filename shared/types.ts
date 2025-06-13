export interface Course {
  id: number;
  mode: string;
  createdAt: Date;
  title: string;
  slug: string;
  description: string;
  duration: string;
  prerequisites: string | null;
  level: string;
  price: number | null;
  features: string[] | null;
  syllabusUrl: string | null;
  overview: string | null;
  mainImage: string | null;
  logo: string | null;
  icon: string;
  category: string;
  batchDates: string[];
  isActive: boolean;
  batches?: any;
  curriculum?: any;
  fees?: any;
  careerOpportunities?: string[];
  toolsAndTechnologies?: string;
  whatYouWillLearn?: string;
}

export interface Quiz {
  id: number;
  createdAt: Date;
  title: string;
  courseId: number | null;
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

export interface BlogPost {
  id: number;
  createdAt: Date;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  authorId: number | null;
  isPublished: boolean;
  readingTime: number;
  updatedAt: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  createdAt: Date;
  courseId: number | null;
  courseName: string;
  rating: number;
  review: string;
  jobTitle: string | null;
  company: string | null;
  image: string | null;
  isApproved: boolean;
}

export interface FAQ {
  id: number;
  category: string;
  isActive: boolean;
  question: string;
  answer: string;
  order: number;
}

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
} 