import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// SEO Meta tags
document.title = "CyberEdu - Premier Cybersecurity & IT Education Institute";

const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Transform your career with hands-on cybersecurity and software development training. 80% practical approach with real projects and placement support in Pune, India.";
document.head.appendChild(metaDescription);

const metaKeywords = document.createElement("meta");
metaKeywords.name = "keywords";
metaKeywords.content = "cybersecurity training, ethical hacking course, full stack development, python programming, bug bounty, IT education, Pune, Maharashtra, India";
document.head.appendChild(metaKeywords);

const metaViewport = document.createElement("meta");
metaViewport.name = "viewport";
metaViewport.content = "width=device-width, initial-scale=1.0";
document.head.appendChild(metaViewport);

// Open Graph meta tags
const ogTitle = document.createElement("meta");
ogTitle.setAttribute("property", "og:title");
ogTitle.content = "CyberEdu - Premier Cybersecurity & IT Education Institute";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.setAttribute("property", "og:description");
ogDescription.content = "Transform your career with hands-on cybersecurity and software development training. 80% practical approach with real projects and placement support.";
document.head.appendChild(ogDescription);

const ogType = document.createElement("meta");
ogType.setAttribute("property", "og:type");
ogType.content = "website";
document.head.appendChild(ogType);

// Schema.org structured data
const schemaScript = document.createElement("script");
schemaScript.type = "application/ld+json";
schemaScript.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "CyberEdu",
  "url": "https://cyberedus.com",
  "description": "Premier cybersecurity and IT education institute offering hands-on training with placement support",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "addressCountry": "India"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-98765-43210",
    "contactType": "Customer Service"
  },
  "sameAs": [
    "https://facebook.com/cyberedu",
    "https://twitter.com/cyberedu",
    "https://linkedin.com/company/cyberedu"
  ]
});
document.head.appendChild(schemaScript);

createRoot(document.getElementById("root")!).render(<App />);
