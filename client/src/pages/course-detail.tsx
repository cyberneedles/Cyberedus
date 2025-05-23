import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LeadForm from "@/components/forms/lead-form";
import QuizComponent from "@/components/quiz/quiz-component";
import { Course, Quiz } from "@shared/schema";
import { trackEvent } from "@/lib/analytics";
import { useState } from "react";

export default function CourseDetail() {
  const { slug } = useParams();
  const [showSyllabusForm, setShowSyllabusForm] = useState(false);

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${slug}`],
  });

  const { data: quiz } = useQuery<Quiz>({
    queryKey: [`/api/courses/${course?.id}/quiz`],
    enabled: !!course?.id,
  });

  const handleEnrollClick = () => {
    trackEvent("enroll_click", "course", slug);
  };

  const handleSyllabusDownload = () => {
    trackEvent("syllabus_download", "course", slug);
    setShowSyllabusForm(true);
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

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <h1 className="text-4xl font-bold text-foreground mb-4">Course Not Found</h1>
              <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
              <Link href="/courses">
                <Button className="btn-primary">View All Courses</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <i className={`${course.icon} text-3xl text-primary`}></i>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {course.level}
                  </Badge>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  className="btn-primary text-lg"
                  onClick={handleEnrollClick}
                >
                  <i className="fas fa-graduation-cap mr-2"></i>Enroll Now
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-secondary"
                  onClick={handleSyllabusDownload}
                >
                  <i className="fas fa-download mr-2"></i>Download Syllabus
                </Button>
              </div>
              
              {/* Quick Course Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{course.duration}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary capitalize">{course.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary capitalize">
                    {course.mode === "both" ? "Hybrid" : course.mode}
                  </div>
                  <div className="text-sm text-muted-foreground">Mode</div>
                </div>
                {course.price && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">₹{course.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Fee</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt={`${course.title} training environment`}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Details Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="batches">Batches</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">What This Course Means to You</h3>
                  <p className="text-muted-foreground mb-6">
                    This course is designed to transform your career by providing you with industry-relevant skills 
                    and hands-on experience. Whether you're starting fresh or looking to advance your career, 
                    this program will give you the confidence and expertise needed to succeed in today's competitive market.
                  </p>
                  
                  <h4 className="text-xl font-semibold text-foreground mb-4">Prerequisites</h4>
                  <p className="text-muted-foreground mb-6">
                    {course.prerequisites || "No specific prerequisites required - suitable for beginners"}
                  </p>
                  
                  <h4 className="text-xl font-semibold text-foreground mb-4">Career Opportunities</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {course.category === "cybersecurity" ? (
                      <>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Cybersecurity Analyst</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Penetration Tester</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Security Consultant</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Incident Response Specialist</li>
                      </>
                    ) : course.category === "development" ? (
                      <>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Full Stack Developer</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Software Engineer</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Backend Developer</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>DevOps Engineer</li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Enhanced Interview Skills</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Professional Networking</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Career Advancement</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Industry Connections</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">What We Offer</h3>
                  
                  <div className="space-y-4">
                    {course.features?.map((feature, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                              <i className="fas fa-star text-primary"></i>
                            </div>
                            <span className="font-medium text-foreground">{feature}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <i className="fas fa-tools mr-2 text-primary"></i>
                        Tools & Technologies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        You'll work with industry-standard tools and the latest technologies used by professionals worldwide. 
                        All software and lab environments are provided as part of the course.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum" className="mt-8">
              <div className="max-w-4xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">Course Curriculum</h3>
                <Accordion type="single" collapsible className="w-full">
                  {course.category === "cybersecurity" ? (
                    <>
                      <AccordionItem value="module-1">
                        <AccordionTrigger>Module 1: Introduction to Cybersecurity</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Understanding cybersecurity fundamentals</li>
                            <li>• Types of cyber threats and attacks</li>
                            <li>• Security frameworks and compliance</li>
                            <li>• Hands-on lab: Setting up security environment</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="module-2">
                        <AccordionTrigger>Module 2: Network Security</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Network protocols and architecture</li>
                            <li>• Firewalls and intrusion detection systems</li>
                            <li>• VPNs and secure communications</li>
                            <li>• Hands-on lab: Network scanning and analysis</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="module-3">
                        <AccordionTrigger>Module 3: Penetration Testing</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Penetration testing methodology</li>
                            <li>• Reconnaissance and information gathering</li>
                            <li>• Vulnerability assessment and exploitation</li>
                            <li>• Hands-on lab: Real-world penetration testing</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  ) : course.category === "development" ? (
                    <>
                      <AccordionItem value="module-1">
                        <AccordionTrigger>Module 1: Frontend Development</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• HTML5, CSS3, and responsive design</li>
                            <li>• JavaScript fundamentals and ES6+</li>
                            <li>• Frontend frameworks (React/Angular)</li>
                            <li>• Hands-on project: Interactive web application</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="module-2">
                        <AccordionTrigger>Module 2: Backend Development</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Server-side programming concepts</li>
                            <li>• Database design and management</li>
                            <li>• API development and integration</li>
                            <li>• Hands-on project: RESTful API development</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="module-3">
                        <AccordionTrigger>Module 3: Full Stack Integration</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Connecting frontend and backend</li>
                            <li>• Authentication and authorization</li>
                            <li>• Testing and deployment strategies</li>
                            <li>• Capstone project: Complete web application</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  ) : (
                    <>
                      <AccordionItem value="module-1">
                        <AccordionTrigger>Week 1: Resume & Profile Building</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Professional resume writing</li>
                            <li>• LinkedIn profile optimization</li>
                            <li>• Portfolio development</li>
                            <li>• Personal branding strategies</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="module-2">
                        <AccordionTrigger>Week 2: Interview Mastery</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Technical interview preparation</li>
                            <li>• Behavioral interview techniques</li>
                            <li>• Mock interviews with feedback</li>
                            <li>• Salary negotiation strategies</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  )}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="batches" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Upcoming Batches</h3>
                  <div className="space-y-4">
                    {course.batchDates?.map((date, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-semibold text-foreground">
                                Batch {index + 1}
                              </div>
                              <div className="text-muted-foreground">
                                Starts: {new Date(date).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                              </div>
                              <div className="text-sm text-accent mt-1">
                                <i className="fas fa-users mr-1"></i>
                                Limited seats available
                              </div>
                            </div>
                            <Button className="btn-primary">
                              Reserve Seat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Schedule Details</h3>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <i className="fas fa-clock text-primary mr-3"></i>
                          <div>
                            <div className="font-medium text-foreground">Class Timings</div>
                            <div className="text-muted-foreground">Weekdays: 7:00 PM - 9:00 PM</div>
                            <div className="text-muted-foreground">Weekends: 10:00 AM - 2:00 PM</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <i className="fas fa-calendar text-primary mr-3"></i>
                          <div>
                            <div className="font-medium text-foreground">Duration</div>
                            <div className="text-muted-foreground">{course.duration}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <i className="fas fa-laptop text-primary mr-3"></i>
                          <div>
                            <div className="font-medium text-foreground">Mode</div>
                            <div className="text-muted-foreground capitalize">
                              {course.mode === "both" ? "Online & Offline Available" : course.mode}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <i className="fas fa-certificate text-primary mr-3"></i>
                          <div>
                            <div className="font-medium text-foreground">Certification</div>
                            <div className="text-muted-foreground">Industry-recognized certificate</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="fees" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Fee Structure</h3>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">Course Fee</span>
                          <span className="text-2xl font-bold text-primary">
                            ₹{course.price?.toLocaleString() || "Contact for pricing"}
                          </span>
                        </div>
                        
                        <div className="border-t border-border pt-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Registration Fee</span>
                              <span className="text-foreground">₹1,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Study Materials</span>
                              <span className="text-accent">Included</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lab Access</span>
                              <span className="text-accent">Included</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Certification</span>
                              <span className="text-accent">Included</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-foreground mb-4">Payment Options</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <i className="fas fa-credit-card text-primary mr-3"></i>
                          <span className="text-muted-foreground">Full payment (5% discount)</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-calendar-alt text-primary mr-3"></i>
                          <span className="text-muted-foreground">Installments available</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-graduation-cap text-primary mr-3"></i>
                          <span className="text-muted-foreground">Student discounts available</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">What's Included</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-book text-accent"></i>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Study Materials</div>
                            <div className="text-sm text-muted-foreground">Comprehensive course materials and resources</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-laptop-code text-primary"></i>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Lab Access</div>
                            <div className="text-sm text-muted-foreground">24/7 access to practice labs and environments</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-users text-secondary"></i>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Placement Support</div>
                            <div className="text-sm text-muted-foreground">Resume building and interview preparation</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-certificate text-purple-600"></i>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">Industry Certification</div>
                            <div className="text-sm text-muted-foreground">Recognized certificate upon completion</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Quiz Section */}
      {quiz && (
        <section className="py-20 bg-muted/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuizComponent courseId={course.id} />
          </div>
        </section>
      )}

      {/* Syllabus Download Form */}
      {showSyllabusForm && (
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <LeadForm 
              source="syllabus_download"
              courseInterest={course.title}
              buttonText="Download Syllabus"
              title="Download Course Syllabus"
              description="Get the complete course syllabus with detailed module breakdown"
              onSubmit={() => setShowSyllabusForm(false)}
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
