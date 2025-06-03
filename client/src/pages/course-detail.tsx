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
                    {course.overview || course.description}
                  </p>
                  
                  <h4 className="text-xl font-semibold text-foreground mb-4">Prerequisites</h4>
                  <p className="text-muted-foreground mb-6">
                    {course.prerequisites || "No specific prerequisites required - suitable for beginners"}
                  </p>
                  
                  <h4 className="text-xl font-semibold text-foreground mb-4">Career Opportunities</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    {course.careerOpportunities && course.careerOpportunities.length > 0 ? (
                      course.careerOpportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-center">
                          <i className="fas fa-check text-accent mr-2"></i>
                          {opportunity}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Enhanced Career Prospects</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Industry Recognition</li>
                        <li className="flex items-center"><i className="fas fa-check text-accent mr-2"></i>Professional Growth</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">What We Offer</h3>
                  
                  <div className="space-y-4">
                    {course.features && course.features.length > 0 ? (
                      course.features.map((feature, index) => (
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
                      ))
                    ) : (
                      <>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                <i className="fas fa-book text-primary"></i>
                              </div>
                              <span className="font-medium text-foreground">Comprehensive Study Materials</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                <i className="fas fa-laptop text-primary"></i>
                              </div>
                              <span className="font-medium text-foreground">24/7 Lab Access</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                <i className="fas fa-users text-primary"></i>
                              </div>
                              <span className="font-medium text-foreground">Placement Support</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                <i className="fas fa-certificate text-primary"></i>
                              </div>
                              <span className="font-medium text-foreground">Industry Certification</span>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
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
                        {course.toolsAndTechnologies || "You'll work with industry-standard tools and the latest technologies used by professionals worldwide. All software and lab environments are provided as part of the course."}
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
                  {course.curriculum && course.curriculum.length > 0 ? (
                    course.curriculum.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`}>
                        <AccordionTrigger>{section.sectionTitle}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-muted-foreground">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex}>• {item}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Curriculum details will be updated soon.</p>
                    </div>
                  )}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="batches" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Upcoming Batches</h3>
                  {course.batches && course.batches.length > 0 ? (
                    <div className="space-y-4">
                      {course.batches.map((batch, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                                  <i className="fas fa-calendar text-primary"></i>
                                </div>
                                <div>
                                  <div className="font-semibold text-foreground">Batch {index + 1}</div>
                                  <div className="text-sm text-muted-foreground">Starts {batch.startDate}</div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="capitalize">
                                {batch.mode}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <i className="fas fa-clock mr-2"></i>
                                {batch.time}
                              </div>
                              <div className="flex items-center">
                                <i className="fas fa-user mr-2"></i>
                                Instructor: {batch.instructor}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Batch schedules will be announced soon.</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Schedule Details</h3>
                  <div className="space-y-6">
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
                          {course.mode === "hybrid" ? "Online & Offline Available" : course.mode}
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
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="fees" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Fee Structure</h3>
                  {course.fees && course.fees.length > 0 ? (
                    <div className="space-y-4">
                      {course.fees.map((fee, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-foreground">{fee.label}</div>
                              <div className="text-2xl font-bold text-primary">₹{fee.amount.toLocaleString()}</div>
                            </div>
                            <p className="text-sm text-muted-foreground">{fee.notes}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-foreground">Course Fee</div>
                          <div className="text-2xl font-bold text-primary">₹{course.price?.toLocaleString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-foreground">Payment Options</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <i className="fas fa-credit-card mr-2"></i>
                        Full payment (5% discount)
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        Installments available
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-graduation-cap mr-2"></i>
                        Student discounts available
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">What's Included</h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-book text-blue-600"></i>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Study Materials</div>
                        <div className="text-sm text-muted-foreground">Comprehensive course materials and resources</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-flask text-green-600"></i>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Lab Access</div>
                        <div className="text-sm text-muted-foreground">24/7 access to practice labs and environments</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-users text-purple-600"></i>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Placement Support</div>
                        <div className="text-sm text-muted-foreground">Resume building and interview preparation</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-certificate text-orange-600"></i>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Industry Certification</div>
                        <div className="text-sm text-muted-foreground">Recognized certificate upon completion</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have advanced their careers with our comprehensive training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary text-lg px-8 py-3" onClick={handleEnrollClick}>
              Enroll Now
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-3"
              onClick={handleSyllabusDownload}
            >
              Download Syllabus
            </Button>
          </div>
        </div>
      </section>

      {/* Lead Form Modal */}
      {showSyllabusForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Download Syllabus</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSyllabusForm(false)}
              >
                ×
              </Button>
            </div>
            <LeadForm 
              courseSlug={slug || ""}
              onSuccess={() => setShowSyllabusForm(false)}
            />
          </div>
        </div>
      )}

      {/* Quiz Component */}
      {quiz && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Test Your Knowledge
              </h2>
              <p className="text-xl text-muted-foreground">
                Take our quiz to assess your current understanding and see how this course can help you grow.
              </p>
            </div>
            <QuizComponent quiz={quiz} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
                        
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
