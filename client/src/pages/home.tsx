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

      {/* Mouse-Controlled Scrolling Specialization Cards */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-full">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out px-8"
            style={{ 
              transform: `translateX(${mousePosition.x * -0.8}px)`,
              width: 'fit-content'
            }}
          >
            {[
              {
                icon: "🛡️",
                specialty: "Certified Ethical Hacker (CEH)",
                level: "beginner",
                importance: "EC Council certified program covering cyber threats, penetration testing, and security tools. Perfect for beginners.",
                highlights: ["EC Council Certification", "Hands-on Labs"],
                gradient: "from-blue-500 via-purple-500 to-indigo-600",
                bgPattern: "🔒🔍🛡️"
              },
              {
                icon: "🧠",
                specialty: "Advanced Cybersecurity Mastery",
                level: "intermediate", 
                importance: "Deep dive into SIEM, threat hunting, cloud security, and red teaming for cybersecurity professionals.",
                highlights: ["SIEM Training", "Threat Hunting"],
                gradient: "from-emerald-500 via-teal-500 to-cyan-600",
                bgPattern: "⚡🎯🔥"
              },
              {
                icon: "🐛",
                specialty: "Bug Bounty Program",
                level: "intermediate",
                importance: "Learn ethical bug hunting with real-world vulnerability simulation on HackerOne & Bugcrowd platforms.",
                highlights: ["HackerOne Platform", "Bugcrowd Training"],
                gradient: "from-orange-500 via-red-500 to-pink-600",
                bgPattern: "🎯💰🏆"
              },
              {
                icon: "☁️",
                specialty: "Cloud Security Architect",
                level: "advanced",
                importance: "Master AWS, Azure, and GCP security. Design secure cloud infrastructures and implement zero-trust architecture.",
                highlights: ["Multi-Cloud Expertise", "Zero-Trust Design"],
                gradient: "from-violet-500 via-purple-500 to-indigo-600",
                bgPattern: "☁️🔐🏗️"
              },
              {
                icon: "🔴",
                specialty: "Red Team Operations",
                level: "advanced",
                importance: "Elite penetration testing, social engineering, and advanced persistent threat simulation for enterprise security.",
                highlights: ["APT Simulation", "Social Engineering"],
                gradient: "from-red-500 via-rose-500 to-pink-600",
                bgPattern: "⚔️🎭🔥"
              },
              {
                icon: "🔍",
                specialty: "Digital Forensics Expert",
                level: "intermediate",
                importance: "Investigate cyber crimes, recover digital evidence, and master forensic tools for incident response teams.",
                highlights: ["Evidence Recovery", "Incident Response"],
                gradient: "from-slate-500 via-gray-600 to-zinc-700",
                bgPattern: "🔬📱💾"
              }
            ].map((specialty, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer glass-morphism hover-lift border-primary/20 transition-all duration-700 min-w-[350px] max-w-[350px] relative overflow-hidden"
                style={{ 
                  transform: `translateY(${Math.sin((mousePosition.x + index * 100) * 0.01) * 20}px) 
                              rotateY(${mousePosition.x * 0.02}deg) 
                              scale(${1 + Math.sin((mousePosition.x + index * 50) * 0.005) * 0.05})`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5 text-6xl overflow-hidden pointer-events-none">
                  <div 
                    className="absolute transform transition-transform duration-1000 group-hover:scale-110"
                    style={{ 
                      transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) rotate(${mousePosition.x * 0.1}deg)`
                    }}
                  >
                    {specialty.bgPattern}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${specialty.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <CardContent className="p-6 text-center relative z-10">
                  <div 
                    className="text-5xl mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
                    style={{ 
                      filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
                      transform: `rotateX(${mousePosition.y * 0.02}deg)`
                    }}
                  >
                    {specialty.icon}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                    {specialty.specialty}
                  </h3>
                  
                  <div className={`text-sm font-medium mb-4 px-3 py-1 rounded-full inline-block transition-all duration-300 ${
                    specialty.level === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    specialty.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {specialty.level}
                  </div>
                  
                  {/* Animated Progress Bars */}
                  <div className="relative h-3 bg-secondary rounded-full overflow-hidden mb-4 group">
                    <div 
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r ${specialty.gradient} rounded-full transition-all duration-1000 ease-out`}
                      style={{ 
                        width: `${75 + (index * 4)}%`,
                        transform: `translateX(${mousePosition.x * 0.01}px)`
                      }}
                    >
                      <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse group-hover:animate-none group-hover:bg-white/50"></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {specialty.importance}
                  </p>
                  
                  {/* Key Highlights */}
                  <div className="space-y-2 mb-4">
                    {specialty.highlights.map((highlight, idx) => (
                      <div 
                        key={idx} 
                        className="text-xs bg-primary/10 text-primary px-3 py-2 rounded-full inline-block mx-1 transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        ⚡ {highlight}
                      </div>
                    ))}
                  </div>
                  
                  {/* Interactive Glow Effect */}
                  <div 
                    className={`absolute -inset-1 bg-gradient-to-r ${specialty.gradient} rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
                  ></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Enhanced Mouse Movement Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">Move your mouse to explore specializations</p>
          <div className="w-8 h-8 mx-auto mt-2 opacity-50 animate-bounce">
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
