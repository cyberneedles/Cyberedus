import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { trackEvent } from "@/lib/analytics";
import { BackgroundContainer } from "@/components/BackgroundContainer";

export default function About() {
  const observerRef = useRef<IntersectionObserver>();

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

  const handleContactClick = () => {
    trackEvent("contact_click", "about", "contact_button");
  };

  return (
    <BackgroundContainer>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              About CyberEdu
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming careers through hands-on cybersecurity and software development education since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Impact */}
      <section className="py-20 bg-transparent">
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
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center">
                    <i className="fas fa-bullseye text-primary mr-3"></i>
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Making cybersecurity and software education inclusive & impactful with our revolutionary 80% practical, 
                    hands-on approach that ensures every learner becomes industry-ready with real project experience and 
                    direct internship opportunities, even in recessionary markets.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center">
                    <i className="fas fa-eye text-primary mr-3"></i>
                    Our Vision
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To become India's leading skill provider in cybersecurity and fullstack development by 2030, 
                    transforming careers and strengthening digital security across industries while maintaining 
                    our core values of trust, innovation, and social impact.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center">
                    <i className="fas fa-chart-line text-primary mr-3"></i>
                    Our Impact
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-primary/10 rounded-xl">
                      <div className="text-3xl font-bold text-primary mb-2">1200+</div>
                      <div className="text-sm text-muted-foreground font-medium">Students Trained</div>
                    </div>
                    <div className="text-center p-6 bg-accent/10 rounded-xl">
                      <div className="text-3xl font-bold text-accent mb-2">300+</div>
                      <div className="text-sm text-muted-foreground font-medium">Job Placements</div>
                    </div>
                    <div className="text-center p-6 bg-secondary/10 rounded-xl">
                      <div className="text-3xl font-bold text-secondary mb-2">40+</div>
                      <div className="text-sm text-muted-foreground font-medium">Industry Partners</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            <Card className="hover-lift animate-on-scroll">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-handshake text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Trust</h3>
                <p className="text-muted-foreground">
                  We build lasting relationships based on transparency, honesty, and keeping our promises to students and partners.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift animate-on-scroll">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-lightbulb text-3xl text-accent"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve our teaching methods and curriculum to stay ahead of industry trends and technology.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift animate-on-scroll">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-tools text-3xl text-secondary"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Practicality</h3>
                <p className="text-muted-foreground">
                  Our 80% hands-on approach ensures students gain real-world experience and industry-ready skills.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift animate-on-scroll">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-leaf text-3xl text-purple-600"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Sustainability</h3>
                <p className="text-muted-foreground">
                  We create long-term value for students, partners, and the community through sustainable practices.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift animate-on-scroll">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-industry text-3xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Industry Exposure</h3>
                <p className="text-muted-foreground">
                  We provide direct connections to industry professionals and real-world project experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift animate-on-scroll">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-heart text-3xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Social Impact</h3>
                <p className="text-muted-foreground">
                  We believe in making quality education accessible and contributing positively to society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Expert Faculty</h2>
            <p className="text-xl text-muted-foreground">Industry veterans with years of practical experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300" 
                alt="Dr. Rajesh Kumar - Senior Cybersecurity Instructor" 
                className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">Dr. Rajesh Kumar</h3>
              <p className="text-primary font-semibold mb-2">Lead Cybersecurity Instructor</p>
              <p className="text-sm text-muted-foreground mb-4">15+ years in InfoSec, CISSP certified</p>
              <div className="text-sm text-muted-foreground">
                Former security consultant at IBM and TCS, specializes in penetration testing and incident response.
              </div>
            </div>
            
            <div className="text-center animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b789?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Priya Sharma - Full Stack Development Expert" 
                className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">Priya Sharma</h3>
              <p className="text-primary font-semibold mb-2">Full Stack Development Expert</p>
              <p className="text-sm text-muted-foreground mb-4">10+ years at top tech companies</p>
              <div className="text-sm text-muted-foreground">
                Senior developer at Google and Microsoft, expert in React, Node.js, and cloud technologies.
              </div>
            </div>
            
            <div className="text-center animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300" 
                alt="Amit Patel - Penetration Testing Specialist" 
                className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">Amit Patel</h3>
              <p className="text-primary font-semibold mb-2">Penetration Testing Specialist</p>
              <p className="text-sm text-muted-foreground mb-4">Bug bounty hunter, CEH certified</p>
              <div className="text-sm text-muted-foreground">
                Ethical hacker with over 50 successful bounty findings, expert in web application security.
              </div>
            </div>
            
            <div className="text-center animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Dr. Kavitha Rao - Head of Research and Curriculum" 
                className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-foreground mb-2">Dr. Kavitha Rao</h3>
              <p className="text-primary font-semibold mb-2">Head of Research and Curriculum</p>
              <p className="text-sm text-muted-foreground mb-4">PhD in AI Security, published author</p>
              <div className="text-sm text-muted-foreground">
                Leads curriculum development, ensuring cutting-edge content and research integration.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose CyberEdu?</h2>
            <p className="text-xl text-muted-foreground">What makes us different from other institutes</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8 animate-on-scroll">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-hands-helping text-primary text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">80% Practical Approach</h3>
                  <p className="text-muted-foreground">
                    Unlike traditional institutes, 80% of our curriculum is hands-on practice with real projects and industry tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-briefcase text-accent text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Real Industry Projects</h3>
                  <p className="text-muted-foreground">
                    Work on actual client projects and build a portfolio that impresses employers from day one.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-user-tie text-secondary text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Industry Mentorship</h3>
                  <p className="text-muted-foreground">
                    Learn directly from industry professionals currently working in top companies.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <i className="fas fa-handshake text-purple-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Placement Support</h3>
                  <p className="text-muted-foreground">
                    Comprehensive placement assistance including resume building, interview prep, and direct company connections.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="Professional education and career development" 
                className="rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of India's fastest-growing cybersecurity and development education community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-primary text-lg"
              onClick={handleContactClick}
            >
              <i className="fas fa-phone mr-2"></i>Talk to Our Team
            </Button>
            <Button variant="outline" className="btn-secondary text-lg">
              <i className="fas fa-calendar mr-2"></i>Schedule Campus Visit
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </BackgroundContainer>
  );
}
