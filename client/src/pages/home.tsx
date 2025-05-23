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
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                  alt="Professional cybersecurity training environment" 
                  className="rounded-lg w-full h-auto transition-transform duration-500"
                />
                {/* Subtle Terminal Overlay */}
                <div className="absolute top-12 left-12 bg-black/80 rounded p-2 text-success font-mono text-xs opacity-80">
                  <div>root@security:~$ whoami</div>
                  <div className="text-white">ethical_hacker</div>
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

      {/* Interactive Cybersecurity Skills Hub */}
      <section className="py-32 relative theme-transition section-cyber overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="gradient-cyber-text text-reveal">Interactive</span> Skills Lab
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed slide-in-left">
              Experience hands-on cybersecurity training with our <span className="text-primary font-semibold">live simulation environment</span>
            </p>
          </div>
          
          {/* Interactive Terminal Simulator */}
          <div className="relative max-w-4xl mx-auto mb-20">
            <div className="bg-black/90 rounded-xl border border-primary/20 overflow-hidden backdrop-blur-sm">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-primary font-mono">CyberEdus Terminal v2.0</div>
              </div>
              
              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-2 min-h-[300px]">
                <div className="text-primary">root@cyberedus:~$ whoami</div>
                <div className="text-white">ethical_hacker</div>
                <div className="text-primary">root@cyberedus:~$ nmap -sS 192.168.1.0/24</div>
                <div className="text-green-400">Starting Nmap scan...</div>
                <div className="text-green-400">Host is up (0.001s latency).</div>
                <div className="text-yellow-400">PORT     STATE SERVICE</div>
                <div className="text-yellow-400">22/tcp   open  ssh</div>
                <div className="text-yellow-400">80/tcp   open  http</div>
                <div className="text-yellow-400">443/tcp  open  https</div>
                <div className="text-red-400">[!] Vulnerability detected on port 80</div>
                <div className="text-primary">root@cyberedus:~$ <span className="animate-pulse">_</span></div>
              </div>
            </div>
          </div>

          {/* Interactive Skill Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: "🔐", title: "Penetration Testing", progress: 85, color: "from-red-500 to-pink-500" },
              { icon: "🛡️", title: "Network Security", progress: 92, color: "from-blue-500 to-cyan-500" },
              { icon: "🔍", title: "Digital Forensics", progress: 78, color: "from-green-500 to-emerald-500" },
              { icon: "⚡", title: "Incident Response", progress: 88, color: "from-purple-500 to-violet-500" }
            ].map((skill, index) => (
              <div key={index} className="group cursor-pointer">
                <Card className="glass-morphism hover-lift border-primary/20 transition-all duration-300 group-hover:border-primary/40">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-4 text-foreground">{skill.title}</h3>
                    
                    {/* Interactive Progress Bar */}
                    <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-3">
                      <div 
                        className={`absolute left-0 top-0 h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground">{skill.progress}% Mastery</div>
                    
                    <Button className="mt-4 btn-premium text-xs px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Start Training
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Live Simulation CTA */}
          <div className="text-center animate-on-scroll">
            <div className="relative inline-block">
              <Button className="btn-primary text-lg px-12 py-4 relative overflow-hidden group">
                <span className="relative z-10">Launch Live Lab Environment</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">🎯 Real-time simulations • No setup required • Instant access</p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
