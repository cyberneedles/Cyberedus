import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LeadForm from "@/components/forms/lead-form";
import QuizComponent from "@/components/quiz/quiz-component";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { Course, Testimonial } from "@shared/schema";
import { useEffect, useRef } from "react";

export default function Home() {
  const observerRef = useRef<IntersectionObserver>();

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { approved: true }],
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const handleCTAClick = (ctaType: string) => {
    trackEvent("cta_click", "engagement", ctaType);
  };

  // Enhanced mouse and parallax effects
  const mousePosition = { x: 0, y: 0 };
  const scrollY = 0;
  
  const featuredCourses = courses.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Header />
      
      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        {/* Sophisticated Floating Code Elements */}
        <div className="absolute top-20 left-10 code-line opacity-40 float-sophisticated">
          <div className="text-xs font-mono text-info font-medium px-3 py-1 bg-info/10 rounded-lg border border-info/20 backdrop-blur-sm dopamine-hover">
            $ sudo nmap -sS target.com
          </div>
        </div>
        <div className="absolute top-40 right-20 code-line opacity-40 float-sophisticated" style={{animationDelay: '2s'}}>
          <div className="text-xs font-mono text-warning font-medium px-3 py-1 bg-warning/10 rounded-lg border border-warning/20 backdrop-blur-sm dopamine-hover">
            [+] Vulnerability detected
          </div>
        </div>
        <div className="absolute bottom-32 left-20 code-line opacity-40 float-sophisticated" style={{animationDelay: '4s'}}>
          <div className="text-xs font-mono text-success font-medium px-3 py-1 bg-success/10 rounded-lg border border-success/20 backdrop-blur-sm pulse-glow">
            Firewall: ACTIVE
          </div>
        </div>
        <div className="absolute top-60 right-10 code-line opacity-35 float-sophisticated" style={{animationDelay: '6s'}}>
          <div className="text-xs font-mono text-electric font-medium px-3 py-1 bg-electric/10 rounded-lg border border-electric/20 backdrop-blur-sm dopamine-hover">
            SSH tunnel established
          </div>
        </div>
        <div className="absolute bottom-60 right-32 code-line opacity-30 float-sophisticated" style={{animationDelay: '8s'}}>
          <div className="text-xs font-mono text-neon font-medium px-3 py-1 bg-neon/10 rounded-lg border border-neon/20 backdrop-blur-sm pulse-glow">
            🔐 Encrypted connection
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-foreground">
                <span className="block mb-4">Master</span>
                <span className="text-primary">Cybersecurity</span>
              </h1>
              <p className="text-2xl text-muted-foreground mb-10 leading-relaxed">
                Professional cybersecurity and development training with 
                <span className="text-foreground font-medium">hands-on experience</span> and 
                <span className="text-foreground font-medium">industry certification</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Button 
                  className="btn-primary text-lg px-10 py-4"
                  onClick={() => handleCTAClick("get_demo")}
                >
                  Start Learning
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-secondary text-lg px-10 py-4"
                  onClick={() => handleCTAClick("connect_counsellor")}
                >
                  Schedule Consultation
                </Button>
              </div>
              
              {/* Sophisticated Dopamine Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="text-center p-6 border border-border rounded-xl card-professional bg-gradient-to-br from-card to-secondary/20 backdrop-blur-sm">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 counter-animation bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
                    1200+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Students Trained</div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-4"></div>
                </div>
                <div className="text-center p-6 border border-border rounded-xl card-professional bg-gradient-to-br from-card to-info/10 backdrop-blur-sm">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 counter-animation bg-gradient-to-r from-info to-electric bg-clip-text text-transparent" style={{animationDelay: '0.2s'}}>
                    95%
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Placement Rate</div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-info/30 to-transparent mt-4"></div>
                </div>
                <div className="text-center p-6 border border-border rounded-xl card-professional bg-gradient-to-br from-card to-warning/10 backdrop-blur-sm">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 counter-animation bg-gradient-to-r from-warning to-glow bg-clip-text text-transparent" style={{animationDelay: '0.4s'}}>
                    40+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Industry Partners</div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-warning/30 to-transparent mt-4"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 lg:mt-0 relative">
              <div className="relative border border-border rounded-lg p-8 card-professional">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                  alt="Cybersecurity expert working with advanced security systems" 
                  className="rounded-lg w-full h-auto transition-transform duration-500"
                />
                {/* InfoSec Terminal Overlay */}
                <div className="absolute top-12 left-12 bg-black/80 rounded p-2 text-success font-mono text-xs opacity-80">
                  <div>root@infosec:~$ nmap -sS target</div>
                  <div className="text-red-400">[!] Vulnerabilities found</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Mouse-Controlled Scrolling Course Cards */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-full">
          <div 
            className="flex gap-8 transition-transform duration-300 ease-out px-8"
            style={{ 
              transform: `translateX(${mousePosition.x * -0.5}px)`,
              width: 'fit-content'
            }}
          >
            {featuredCourses.map((course, index) => (
              <Card 
                key={course.id} 
                className="group cursor-pointer glass-morphism hover-lift border-primary/20 transition-all duration-500 min-w-[320px] max-w-[320px]"
                style={{ 
                  transform: `translateY(${mousePosition.y * 0.1}px) scale(${1 + mousePosition.x * 0.0001})`
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {course.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{course.title}</h3>
                  <div className="text-sm text-muted-foreground mb-4">{course.level}</div>
                  
                  {/* Interactive Progress Bar */}
                  <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-3">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 ease-out group-hover:from-green-500 group-hover:to-blue-500"
                      style={{ width: `${85 + (index * 5)}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-4">{course.description}</p>
                  
                  {/* Course Features */}
                  {course.features && course.features.length > 0 && (
                    <div className="text-xs text-primary">
                      ⚡ {course.features.slice(0, 2).join(' • ')}
                    </div>
                  )}
                  
                  {/* Duration & Price */}
                  <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{course.duration}</span>
                    {course.price && (
                      <span className="text-lg font-bold text-primary">₹{course.price}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Mouse Movement Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-muted-foreground">Move your mouse to explore courses</p>
          <div className="w-8 h-8 mx-auto mt-2 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.69 2 6 4.69 6 8v8c0 3.31 2.69 6 6 6s6-2.69 6-6V8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4s-4-1.79-4-4V8c0-2.21 1.79-4 4-4zm0 3v3l-1.5-1.5L12 6z"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Test Your Knowledge */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Test Your Knowledge</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our quick assessment to see which course is perfect for you
          </p>
          <QuizComponent />
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="Modern office workspace with collaborative team" 
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
            
            <div className="animate-on-scroll">
              <h2 className="text-4xl font-bold text-foreground mb-6">About CyberEdu</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">Making cybersecurity and software education inclusive & impactful with our revolutionary 80% practical, hands-on approach that ensures every learner becomes industry-ready.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">To become India's leading skill provider in cybersecurity and fullstack development by 2030, transforming careers and strengthening digital security across industries.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Our Impact</h3>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">1200+</div>
                      <div className="text-sm text-muted-foreground">Students Trained</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <div className="text-2xl font-bold text-accent">300+</div>
                      <div className="text-sm text-muted-foreground">Job Placements</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">40+</div>
                      <div className="text-sm text-muted-foreground">Industry Partners</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/about">
                  <Button className="btn-primary">Learn More About Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Students Say</h2>
            <p className="text-xl text-muted-foreground">Real stories from our successful graduates</p>
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="testimonial-card animate-on-scroll">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-sm"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <div className="text-sm text-primary font-medium">
                    {testimonial.courseName} Graduate • {testimonial.company}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-on-scroll">
            <Link href="/testimonials">
              <Button className="btn-primary">View All Testimonials</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have transformed their careers with our hands-on approach
            </p>
            <LeadForm 
              source="homepage_cta"
              buttonText="Get Started Today"
              title="Get Your Free Career Consultation"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
        onClick={() => trackEvent("whatsapp_click", "contact", "float_button")}
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </a>

      <Footer />
    </div>
  );
}
