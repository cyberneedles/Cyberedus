import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { signInWithEmailAndPassword as firebaseAuthSignInWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdKNvIUrvDGuidfn-Jfmh2HVBE3KYOQDI",
  authDomain: "cyberedu-a094a.firebaseapp.com",
  projectId: "cyberedu-a094a",
  storageBucket: "cyberedu-a094a.firebasestorage.app",
  messagingSenderId: "273080704756",
  appId: "1:273080704756:web:d0965576ac6f9c48fc08a1",
  measurementId: "G-0L1L830GMY"
};

// Debug: Log the config (without sensitive values)
console.log('Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  hasMeasurementId: !!firebaseConfig.measurementId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Export types for our data
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  courseId: string;
  content: string;
  rating: number;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  courseId?: string;
  message?: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'converted' | 'lost';
}

// Helper functions for Firebase operations
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await db.collection('courses').add({
    ...courseData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export const getCourses = async () => {
  const snapshot = await db.collection('courses').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Course[];
};

export const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt'>) => {
  const docRef = await db.collection('testimonials').add({
    ...testimonialData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getTestimonials = async () => {
  const snapshot = await db.collection('testimonials').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Testimonial[];
};

export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await db.collection('blog').add({
    ...postData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export const getBlogPosts = async () => {
  const snapshot = await db.collection('blog').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
};

export const createFAQ = async (faqData: Omit<FAQ, 'id' | 'createdAt'>) => {
  const docRef = await db.collection('faqs').add({
    ...faqData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getFAQs = async () => {
  const snapshot = await db.collection('faqs').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FAQ[];
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
  const docRef = await db.collection('leads').add({
    ...leadData,
    createdAt: new Date(),
    status: 'new'
  });
  return docRef.id;
};

export const getLeads = async () => {
  const snapshot = await db.collection('leads').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Lead[];
};

// Authentication functions
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  return firebaseAuthSignInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
  return auth.signOut();
};

export const getCurrentUser = () => {
  return auth.currentUser;
}; 