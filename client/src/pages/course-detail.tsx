import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LeadForm from "@/components/forms/lead-form";
import QuizComponent from "@/components/quiz/quiz-component";
import type { Course } from "@shared/schema";

export default function CourseDetail() {
  const [, params] = useRoute("/course/:slug");
  const slug = params?.slug;
  const [showSyllabusForm, setShowSyllabusForm] = useState(false);

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${slug}`],
    enabled: !!slug,
  });

  const { data: quiz } = useQuery({
    queryKey: ["/api/quiz", course?.id],
    enabled: !!course?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course details...</p>
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground">The requested course could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEnrollClick = () => {
    setShowSyllabusForm(true);
  };

  const handleSyllabusDownload = () => {
    setShowSyllabusForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="capitalize">
                  {course.level}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {course.category}
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center">
                  <i className="fas fa-clock text-primary mr-2"></i>
                  <span className="text-muted-foreground">{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-signal text-primary mr-2"></i>
                  <span className="text-muted-foreground capitalize">{course.level}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-certificate text-primary mr-2"></i>
                  <span className="text-muted-foreground">Certificate Included</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
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
              
              {course.price && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Course Fee</span>
                    <span className="text-2xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              {course.mainImage && (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={course.mainImage} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <h3 className="text-2xl font-bold text-foreground mb-6">Course Overview</h3>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    {course.overview ? (
                      <div dangerouslySetInnerHTML={{ __html: course.overview }} />
                    ) : (
                      <p>{course.description}</p>
                    )}
                  </div>
                  
                  {course.careerOpportunities && course.careerOpportunities.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-xl font-semibold text-foreground mb-4">Career Opportunities</h4>
                      <ul className="space-y-2">
                        {course.careerOpportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <i className="fas fa-check text-primary mr-3"></i>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Tools & Technologies</h3>
                  {course.toolsAndTechnologies ? (
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <div dangerouslySetInnerHTML={{ __html: course.toolsAndTechnologies }} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      You'll learn industry-standard tools and technologies used by professionals in the field.
                    </p>
                  )}
                  
                  <div className="mt-8">
                    <h4 className="text-xl font-semibold text-foreground mb-4">What You'll Learn</h4>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                        <i className="fas fa-shield-alt text-primary mr-3"></i>
                        <span className="text-foreground">Advanced Security Concepts</span>
                      </div>
                      <div className="flex items-center p-3 bg-blue-500/5 rounded-lg">
                        <i className="fas fa-code text-blue-600 mr-3"></i>
                        <span className="text-foreground">Hands-on Practical Skills</span>
                      </div>
                      <div className="flex items-center p-3 bg-green-500/5 rounded-lg">
                        <i className="fas fa-certificate text-green-600 mr-3"></i>
                        <span className="text-foreground">Industry Certification</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum" className="mt-8">
              <div>
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
            <QuizComponent />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}