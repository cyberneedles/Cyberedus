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

  const featuredCourses = courses.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Master <span className="text-primary">Cybersecurity</span> & 
                <span className="text-secondary"> Full Stack Development</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transform your career with our 80% hands-on approach. Real projects, industry mentorship, and guaranteed placement support in Pune's premier IT education institute.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="btn-primary"
                  onClick={() => handleCTAClick("get_demo")}
                >
                  <i className="fas fa-play mr-2"></i>Get Free Demo
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-secondary"
                  onClick={() => handleCTAClick("connect_counsellor")}
                >
                  <i className="fas fa-phone mr-2"></i>Connect with Counsellor
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1200+</div>
                  <div className="text-sm text-muted-foreground">Students Trained</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">300+</div>
                  <div className="text-sm text-muted-foreground">Job Offers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">40+</div>
                  <div className="text-sm text-muted-foreground">Industry Partners</div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="Students learning cybersecurity in modern classroom" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Premium Courses</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Industry-designed curriculum with 80% hands-on training, real projects, and direct placement support
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="course-card animate-on-scroll">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <i className={`${course.icon} text-2xl text-primary`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{course.title}</h3>
                  <p className="text-muted-foreground mb-6">{course.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <i className="fas fa-clock mr-2 text-primary"></i>
                      Duration: {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <i className="fas fa-user mr-2 text-primary"></i>
                      {course.level === "beginner" ? "Beginner Friendly" : 
                       course.level === "intermediate" ? "Intermediate Level" : "Advanced Level"}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <i className="fas fa-laptop mr-2 text-primary"></i>
                      {course.mode === "both" ? "Online & Offline" : 
                       course.mode === "online" ? "Online" : "Offline"}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-border">
                    <Link href={`/courses/${course.slug}`}>
                      <Button className="btn-primary">View Details</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-secondary"
                      onClick={() => handleCTAClick("syllabus_download")}
                    >
                      <i className="fas fa-download mr-1"></i>Syllabus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-on-scroll">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Career?</h3>
            <p className="text-muted-foreground mb-8">Join thousands of successful graduates who landed their dream jobs</p>
            <Link href="/courses">
              <Button className="btn-primary text-lg">
                <i className="fas fa-rocket mr-2"></i>View All Courses
              </Button>
            </Link>
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
