import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-primary"></i>
              </div>
              <h3 className="text-2xl font-bold">CyberEdu</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Transforming careers through hands-on cybersecurity and software development education with 80% practical approach.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Courses</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/courses/certified-ethical-hacker-ceh">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Certified Ethical Hacker (CEH)
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/advanced-cybersecurity-mastery">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Advanced Cybersecurity
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/bug-bounty-program">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Bug Bounty Program
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/full-stack-java-development">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Full Stack Java
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/python-programming">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Python Programming
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses/interview-preparation-bootcamp">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Interview Preparation
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about#team">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Our Team
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Careers
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Blog
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/testimonials">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Success Stories
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Student Support
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    Downloads
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact#faq">
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                    FAQs
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">
            &copy; {currentYear} CyberEdu. All rights reserved.
          </p>
          <p className="text-muted-foreground mt-4 md:mt-0 flex items-center">
            Made with <i className="fas fa-heart text-red-500 mx-1"></i> in Pune, India
          </p>
        </div>
      </div>
    </footer>
  );
}
