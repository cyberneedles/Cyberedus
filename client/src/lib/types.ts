// Common types used across the application

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  prerequisites?: string;
  mode: string;
  level: string;
  price?: number;
  features: string[];
  syllabusUrl?: string;
  batchDates: string[];
  icon: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  courseInterest?: string;
  source: string;
  experience?: string;
  message?: string;
  quizResults?: {
    score: number;
    totalQuestions: number;
    answers: number[];
  };
  createdAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  featuredImage?: string;
  authorId: number;
  isPublished: boolean;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  courseId?: number;
  courseName: string;
  rating: number;
  review: string;
  jobTitle?: string;
  company?: string;
  image?: string;
  isApproved: boolean;
  createdAt: Date;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Quiz {
  id: number;
  courseId?: number;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

// Form types
export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  courseInterest?: string;
  experience?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  courseInterest?: string;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Analytics types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Theme types
export type Theme = "light" | "dark" | "system";

// Navigation types
export interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

// Course filter types
export interface CourseFilters {
  search: string;
  category: string;
  level: string;
  mode: string;
}

// Blog filter types
export interface BlogFilters {
  search: string;
  category: string;
}

// Testimonial filter types
export interface TestimonialFilters {
  search: string;
  course: string;
}
