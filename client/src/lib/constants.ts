// Application constants

export const APP_CONFIG = {
  name: "CyberEdu",
  tagline: "Premier Cybersecurity & IT Education Institute",
  description: "Transform your career with hands-on cybersecurity and software development training. 80% practical approach with real projects and placement support.",
  url: "https://cyberedus.com",
  email: "info@cyberedus.com",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  address: {
    line1: "CyberEdu Institute",
    line2: "Pune, Maharashtra 411001",
    country: "India"
  },
  social: {
    facebook: "https://facebook.com/cyberedu",
    twitter: "https://twitter.com/cyberedu",
    linkedin: "https://linkedin.com/company/cyberedu",
    instagram: "https://instagram.com/cyberedu",
    youtube: "https://youtube.com/cyberedu"
  }
};

export const COURSE_CATEGORIES = [
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "development", label: "Development" },
  { value: "career", label: "Career" }
];

export const COURSE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
];

export const COURSE_MODES = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "both", label: "Online & Offline" }
];

export const BLOG_CATEGORIES = [
  { value: "cybersecurity", label: "Cybersecurity", color: "bg-blue-100 text-blue-600" },
  { value: "development", label: "Development", color: "bg-green-100 text-green-600" },
  { value: "career", label: "Career Tips", color: "bg-purple-100 text-purple-600" },
  { value: "industry", label: "Industry News", color: "bg-orange-100 text-orange-600" }
];

export const EXPERIENCE_LEVELS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Some Experience", label: "Some Experience" },
  { value: "Experienced", label: "Experienced" },
  { value: "Professional", label: "Professional" }
];

export const LEAD_SOURCES = {
  CONTACT_FORM: "contact_form",
  QUIZ: "quiz",
  SYLLABUS_DOWNLOAD: "syllabus_download",
  HOMEPAGE_CTA: "homepage_cta",
  COURSE_PAGE: "course_page",
  BLOG_NEWSLETTER: "blog_newsletter"
};

export const COURSE_ICONS = {
  cybersecurity: "fas fa-shield-alt",
  "ethical-hacking": "fas fa-user-secret",
  "penetration-testing": "fas fa-bug",
  development: "fas fa-code",
  java: "fab fa-java",
  python: "fab fa-python",
  career: "fas fa-briefcase",
  interview: "fas fa-handshake"
};

export const SOCIAL_ICONS = {
  facebook: "fab fa-facebook-f",
  twitter: "fab fa-twitter",
  linkedin: "fab fa-linkedin-in",
  instagram: "fab fa-instagram",
  youtube: "fab fa-youtube",
  whatsapp: "fab fa-whatsapp"
};

export const FAQ_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "courses", label: "Courses" },
  { value: "placement", label: "Placement" },
  { value: "pricing", label: "Pricing" },
  { value: "technical", label: "Technical" }
];

export const OFFICE_HOURS = {
  weekdays: "Mon - Sat: 9:00 AM - 7:00 PM",
  weekend: "Sunday: Closed"
};

export const STATS = {
  studentsTrained: "1200+",
  jobPlacements: "300+",
  industryPartners: "40+",
  successRate: "95%",
  averageRating: "4.8/5"
};

export const META_DEFAULTS = {
  title: "CyberEdu - Premier Cybersecurity & IT Education Institute",
  description: "Transform your career with hands-on cybersecurity and software development training. 80% practical approach with real projects and placement support in Pune, India.",
  keywords: "cybersecurity training, ethical hacking course, full stack development, python programming, bug bounty, IT education, Pune, Maharashtra, India",
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image"
};

export const SCHEMA_ORG = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": APP_CONFIG.name,
  "url": APP_CONFIG.url,
  "description": APP_CONFIG.description,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "addressCountry": "India"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": APP_CONFIG.phone,
    "contactType": "Customer Service"
  },
  "foundingDate": "2020",
  "numberOfEmployees": "25-50",
  "sameAs": Object.values(APP_CONFIG.social)
};

export const ANIMATION_DELAYS = {
  short: 150,
  medium: 300,
  long: 500
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};

export const DEFAULT_QUIZ_QUESTIONS = [
  {
    question: "What best describes your current background?",
    options: ["Student or Recent Graduate", "Working Professional", "Career Switcher", "Entrepreneur/Business Owner"]
  },
  {
    question: "What's your primary goal?",
    options: ["Learn cybersecurity fundamentals", "Advance my current career", "Switch to tech industry", "Start my own business"]
  },
  {
    question: "How much time can you dedicate weekly?",
    options: ["5-10 hours", "10-20 hours", "20-30 hours", "30+ hours"]
  },
  {
    question: "What's your preferred learning style?",
    options: ["Hands-on practice", "Theory with examples", "Mixed approach", "Self-paced learning"]
  },
  {
    question: "Which area interests you most?",
    options: ["Ethical Hacking", "Software Development", "Both equally", "Not sure yet"]
  }
];

export const COURSE_RECOMMENDATIONS = {
  "Ethical Hacking": "Certified Ethical Hacker (CEH)",
  "Software Development": "Full Stack Java Development",
  "Both equally": "Advanced Cybersecurity Mastery",
  "Not sure yet": "Python Programming"
};

export const TESTIMONIAL_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1494790108755-2616b612b789?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
];

export const BLOG_PLACEHOLDERS = {
  cybersecurity: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  development: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  career: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  industry: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
};
