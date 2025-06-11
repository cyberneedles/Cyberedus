import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Testimonial, Course } from "@shared/schema";
import { BackgroundContainer } from "@/components/BackgroundContainer";
import { trackEvent } from "@/lib/analytics";

export default function Testimonials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const observerRef = useRef<IntersectionObserver>();

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { approved: true }],
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
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
  }, [testimonials]);

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === "all" || testimonial.courseName.toLowerCase().includes(courseFilter.toLowerCase());
    
    return matchesSearch && matchesCourse;
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`fas fa-star text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      ></i>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="spinner w-8 h-8"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <BackgroundContainer>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Student Success Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real testimonials from our graduates who have transformed their careers with CyberEdu
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
              </div>
            </div>
            <div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="ceh">CEH</SelectItem>
                  <SelectItem value="advanced">Advanced Cybersecurity</SelectItem>
                  <SelectItem value="java">Full Stack Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="bug bounty">Bug Bounty</SelectItem>
                  <SelectItem value="interview">Interview Preparation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-on-scroll">
              <div className="text-4xl font-bold text-primary mb-2">1200+</div>
              <div className="text-muted-foreground">Happy Students</div>
            </div>
            <div className="animate-on-scroll">
              <div className="text-4xl font-bold text-accent mb-2">4.8/5</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div className="animate-on-scroll">
              <div className="text-4xl font-bold text-secondary mb-2">300+</div>
              <div className="text-muted-foreground">Successful Placements</div>
            </div>
            <div className="animate-on-scroll">
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-2xl font-bold text-foreground mb-2">No testimonials found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="testimonial-card animate-on-scroll">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">{testimonial.name}</h3>
                        <div className="flex mb-2">
                          {renderStars(testimonial.rating)}
                        </div>
                        <div className="text-sm text-primary font-medium">
                          {testimonial.courseName} Graduate
                        </div>
                      </div>
                    </div>
                    
                    <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{testimonial.review}"
                    </blockquote>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          {testimonial.jobTitle && (
                            <div className="font-medium text-foreground">{testimonial.jobTitle}</div>
                          )}
                          {testimonial.company && (
                            <div className="text-muted-foreground">{testimonial.company}</div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(testimonial.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Course-wise Success Rate */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Success Across All Programs</h2>
            <p className="text-xl text-muted-foreground">Our students excel in every course we offer</p>
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {courses.map((course) => {
              const courseTestimonials = testimonials.filter(t => 
                t.courseName.toLowerCase().includes(course.title.toLowerCase().split(' ')[0])
              );
              const avgRating = courseTestimonials.length > 0 
                ? courseTestimonials.reduce((sum, t) => sum + t.rating, 0) / courseTestimonials.length 
                : 0;
              
              return (
                <Card key={course.id} className="hover-lift animate-on-scroll">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className={`${course.icon} text-3xl text-primary`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">{course.title}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-center mb-2">
                        {renderStars(Math.round(avgRating))}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}/5
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on {courseTestimonials.length} reviews
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of India's fastest-growing cybersecurity and development education community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-primary"
              onClick={() => trackEvent("cta_click", "testimonials_page", "Talk to our team")} >
              <i className="fas fa-phone mr-2"></i>Talk to Our Team
            </Button>
            <Button 
              variant="outline" 
              className="btn-secondary"
              onClick={() => trackEvent("cta_click", "testimonials_page", "Schedule demo")}
            >
              <i className="fas fa-calendar mr-2"></i>Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </BackgroundContainer>
  );
}
