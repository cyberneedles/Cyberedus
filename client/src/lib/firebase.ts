import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { signInWithEmailAndPassword as firebaseAuthSignInWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdKNvIUrvDGuidfn-Jfmh2HVBE3KYOQDI",
  authDomain: "cyberedu-a094a.firebaseapp.com",
  projectId: "cyberedu-a094a",
  storageBucket: "cyberedu-a094a.appspot.com",
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
  const docRef = await addDoc(collection(db, 'courses'), {
    ...courseData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export const getCourses = async () => {
  const snapshot = await getDocs(collection(db, 'courses'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Course[];
};

export const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'testimonials'), {
    ...testimonialData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getTestimonials = async () => {
  const snapshot = await getDocs(collection(db, 'testimonials'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Testimonial[];
};

export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'blog'), {
    ...postData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
};

export const getBlogPosts = async () => {
  const snapshot = await getDocs(collection(db, 'blog'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
};

export const createFAQ = async (faqData: Omit<FAQ, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'faqs'), {
    ...faqData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getFAQs = async () => {
  const snapshot = await getDocs(collection(db, 'faqs'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FAQ[];
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'leads'), {
    ...leadData,
    createdAt: new Date(),
    status: 'new'
  });
  return docRef.id;
};

export const getLeads = async () => {
  const snapshot = await getDocs(collection(db, 'leads'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Lead[];
};

// Authentication functions
export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseAuthSignInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Firebase auth error:', error);
    throw error;
  }
};

export const signOut = async () => {
  return auth.signOut();
};

export const getCurrentUser = () => {
  return auth.currentUser;
}; 