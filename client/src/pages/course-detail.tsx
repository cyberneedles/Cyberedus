import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LeadForm from "@/components/forms/lead-form";
import QuizComponent from "@/components/quiz/quiz-component";
import type { Course, Quiz } from "@shared/schema";
import { FormLabel } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [showSyllabusForm, setShowSyllabusForm] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadFormSource, setLeadFormSource] = useState('');

  const handleEnrollClick = useCallback(() => {
    setLeadFormSource("Course Detail - Enroll Now");
    setIsLeadFormOpen(true);
  }, []);

  const handleSyllabusDownload = useCallback(() => {
    setLeadFormSource("Course Detail - Download Syllabus");
    setIsLeadFormOpen(true);
  }, []);

  const { data: course, isLoading, error } = useQuery<Course | null>({
    queryKey: ["course", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await fetch(`/api/courses/${slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedCourse: Course = await response.json();
      console.log('Fetched raw course data:', fetchedCourse);

      // Ensure all potentially null fields have proper defaults
      const parsedCourse: Course = {
        ...fetchedCourse,
        curriculum: Array.isArray(fetchedCourse.curriculum) ? fetchedCourse.curriculum : [],
        batches: Array.isArray(fetchedCourse.batches) ? fetchedCourse.batches : [],
        fees: Array.isArray(fetchedCourse.fees) ? fetchedCourse.fees : [],
        careerOpportunities: Array.isArray(fetchedCourse.careerOpportunities) ? fetchedCourse.careerOpportunities : [],
        mainImage: fetchedCourse.mainImage || "",
        logo: fetchedCourse.logo || "",
        toolsAndTechnologies: fetchedCourse.toolsAndTechnologies || "",
        whatYouWillLearn: fetchedCourse.whatYouWillLearn || "",
        syllabusUrl: fetchedCourse.syllabusUrl || "",
        overview: fetchedCourse.overview || "",
        features: fetchedCourse.features || [],
        prerequisites: fetchedCourse.prerequisites || null,
        price: fetchedCourse.price || null,
        isActive: fetchedCourse.isActive ?? true,
      };
      console.log('Processed course data in CourseDetail:', parsedCourse);
      return parsedCourse;
    },
    enabled: !!slug,
  });

  const { data: quiz } = useQuery<Quiz | null>({
    queryKey: [`/api/courses/${course?.id}/quiz`],
    enabled: !!course?.id,
  });

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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground">{`${error instanceof Error ? error.message : "Failed to load course. Please try again later."}`}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#1a1a1a] dark:text-[#e0e0e0]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        {/* Visual Enhancement Blobs */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="capitalize text-base px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md">
                  {course?.level}
                </Badge>
                <Badge variant="outline" className="capitalize text-base px-3 py-1 border-primary text-primary rounded-full hover:bg-primary/10 dark:border-primary-foreground dark:text-primary-foreground">
                  {course?.category}
                </Badge>
              </div>
              
              {/* Course Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight lg:leading-tight dark:text-white">
                {course?.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed dark:text-[#b0b0b0]">
                {course?.description}
              </p>
              
              {/* Course Info */}
              <div className="flex flex-wrap gap-y-4 gap-x-6 mb-8">
                <div className="flex items-center text-muted-foreground dark:text-[#b0b0b0]">
                  <i className="fas fa-clock text-primary mr-2 text-xl"></i>
                  <span className="text-base">
                    {course?.duration ? (isNaN(Number(course.duration)) ? course.duration : `${course.duration} weeks`) : 'Duration TBD'}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground dark:text-[#b0b0b0]">
                  <i className="fas fa-signal text-primary mr-2 text-xl"></i>
                  <span className="text-base capitalize">{course?.level}</span>
                </div>
                <div className="flex items-center text-muted-foreground dark:text-[#b0b0b0]">
                  <i className="fas fa-certificate text-primary mr-2 text-xl"></i>
                  <span className="text-base">Certificate Included</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="btn-primary text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" 
                  onClick={handleEnrollClick}
                >
                  Enroll Now
                </Button>
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all w-full sm:w-auto dark:border-primary-foreground dark:text-primary-foreground dark:hover:bg-primary-foreground/10"
                  onClick={handleSyllabusDownload}
                >
                  Download Syllabus
                </Button>
              </div>
              
              {/* Fee Card */}
              {course?.price !== null && course?.price !== undefined && (
                <div className="mt-8 p-6 bg-card rounded-2xl border border-border/50 shadow-lg dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-lg dark:text-[#b0b0b0]">Course Fee</span>
                    <span className="text-3xl font-extrabold text-primary dark:text-primary-foreground">₹{course.price.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Course Image */}
            <div className="relative flex justify-center lg:justify-end">
              {course?.mainImage && (
                <div className="w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src={course.mainImage} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Details Tabs */}
      <section className="py-16 md:py-24 bg-secondary-background dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-12 bg-card rounded-2xl shadow-lg dark:bg-[#2a2a2a]">
              <TabsTrigger value="overview" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-xl dark:data-[state=active]:bg-primary-foreground dark:data-[state=active]:text-primary transition-all">Overview</TabsTrigger>
              <TabsTrigger value="curriculum" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-xl dark:data-[state=active]:bg-primary-foreground dark:data-[state=active]:text-primary transition-all">Curriculum</TabsTrigger>
              <TabsTrigger value="batches" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-xl dark:data-[state=active]:bg-primary-foreground dark:data-[state=active]:text-primary transition-all">Batches</TabsTrigger>
              <TabsTrigger value="fees" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-xl dark:data-[state=active]:bg-primary-foreground dark:data-[state=active]:text-primary transition-all">Fees</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-10 p-8 bg-card rounded-2xl shadow-lg dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* First Column: Course Overview */}
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-6 dark:text-white">Course Overview</h3>
                  {(course?.overview && course.overview.trim() !== '') ? (
                    <ul className="text-muted-foreground leading-relaxed dark:text-[#b0b0b0] list-disc pl-5 space-y-2">
                      {course.overview.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                        <li key={idx}>{line.trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed dark:text-[#b0b0b0]">{course?.description}</p>
                  )}
                </div>
                
                {/* Second Column: Career Opportunities, Tools & Technologies, What You'll Learn */}
                <div className="space-y-10">
                  {/* Career Opportunities */}
                  {course?.careerOpportunities && course.careerOpportunities.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4 dark:text-white">Career Opportunities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4"> {/* Adjusted grid for smaller column */}
                        {course.careerOpportunities.map((opportunity, index) => (
                          <div key={index} className="bg-card dark:bg-[#2a2a2a] border border-border/50 dark:border-[#3a3a3a] rounded-xl shadow-sm p-4 flex items-center justify-center text-center hover:shadow-md hover:scale-[1.02] transition-all duration-300"> {/* Adjusted padding and shadow */}
                            <p className="text-base font-semibold text-muted-foreground dark:text-[#b0b0b0]">{opportunity}</p> {/* Adjusted text size */}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 dark:text-white">Tools & Technologies</h3>
                    {(course?.toolsAndTechnologies && course.toolsAndTechnologies.trim() !== '') ? (
                      <div className="flex flex-wrap gap-3">
                        {course.toolsAndTechnologies.split('\n').filter(line => line.trim() !== '').map((tool, idx) => (
                          <Badge key={idx} variant="outline" className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-md hover:from-green-500 hover:to-teal-600 transition-all duration-300">
                            <i className="fas fa-tools mr-2"></i> {tool.trim()}
                          </Badge>
                        ))}
                    </div>
                  ) : (
                      <p className="text-muted-foreground dark:text-[#b0b0b0]">No tools and technologies information available.</p>
                  )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 dark:text-white">What You'll Learn</h3>
                    {(course?.whatYouWillLearn && course.whatYouWillLearn.trim() !== '') ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.whatYouWillLearn.split('\n').filter(line => line.trim() !== '').map((learn, idx) => (
                          <div key={idx} className="flex items-center p-4 rounded-xl bg-card border border-border/50 shadow-sm dark:bg-[#2a2a2a] dark:border-[#3a3a3a] hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                            <div className="flex-shrink-0 mr-4 text-primary group-hover:text-primary-foreground transition-colors duration-300">
                              <i className="fas fa-check-circle text-xl"></i> {/* Generic checkmark icon */}
                            </div>
                            <p className="text-muted-foreground dark:text-[#b0b0b0] group-hover:text-foreground transition-colors duration-300">
                              {learn.trim()}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                      <p className="text-muted-foreground dark:text-[#b0b0b0]">No learning outcomes defined.</p>
                  )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-10 p-8 bg-card rounded-2xl shadow-lg dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-6 dark:text-white">Course Curriculum</h3>
                <Accordion type="single" collapsible className="w-full">
                  {course?.curriculum && course.curriculum.length > 0 ? (
                    course.curriculum.map((section: { sectionTitle: string; items: string[] }, index: number) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 dark:border-[#3a3a3a]">
                        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline dark:text-white py-4">
                          {section.sectionTitle}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground dark:text-[#b0b0b0]">
                            {section.items.map((item, itemIdx) => (
                              <li key={itemIdx}>{item}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <p className="text-muted-foreground dark:text-[#b0b0b0]">No curriculum available for this course.</p>
                  )}
                </Accordion>
              </div>
            </TabsContent>
            
            {/* Batches Tab */}
            <TabsContent value="batches" className="mt-10 p-8 bg-card rounded-2xl shadow-lg dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-6 dark:text-white">Upcoming Batches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course?.batches && course.batches.length > 0 ? (
                    course.batches.map((batch, index) => (
                      <Card key={index} className="bg-secondary/20 dark:bg-[#3a3a3a] border border-border/50 dark:border-[#4a4a4a] rounded-xl shadow-md p-6">
                        <CardContent className="p-0">
                          <div className="flex items-center text-muted-foreground mb-3">
                            <i className="fas fa-calendar-alt mr-3 text-primary"></i>
                            <span className="font-semibold text-foreground dark:text-white">Start Date:</span>
                            <span className="ml-2 text-muted-foreground dark:text-[#b0b0b0]">{batch.startDate}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground mb-3">
                            <i className="fas fa-clock mr-3 text-primary"></i>
                            <span className="font-semibold text-foreground dark:text-white">Time:</span>
                            <span className="ml-2 text-muted-foreground dark:text-[#b0b0b0]">{batch.time}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground mb-3">
                            <i className="fas fa-laptop-code mr-3 text-primary"></i>
                            <span className="font-semibold text-foreground dark:text-white">Mode:</span>
                            <span className="ml-2 capitalize text-muted-foreground dark:text-[#b0b0b0]">{batch.mode}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <i className="fas fa-chalkboard-teacher mr-3 text-primary"></i>
                            <span className="font-semibold text-foreground dark:text-white">Instructor:</span>
                            <span className="ml-2 text-muted-foreground dark:text-[#b0b0b0]">{batch.instructor}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground dark:text-[#b0b0b0]">No upcoming batches scheduled.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Fees Tab */}
            <TabsContent value="fees" className="mt-10 p-8 bg-card rounded-2xl shadow-lg dark:bg-[#2a2a2a] dark:border-[#3a3a3a]">
                <div>
                <h3 className="text-3xl font-bold text-foreground mb-6 dark:text-white">Fee Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course?.fees && course.fees.length > 0 ? (
                    course.fees.map((fee, index) => (
                      <Card key={index} className="bg-secondary/20 dark:bg-[#3a3a3a] border border-border/50 dark:border-[#4a4a4a] rounded-xl shadow-md p-6">
                        <CardContent className="p-0">
                          <h4 className="text-xl font-bold text-foreground mb-2 dark:text-white">{fee.label}</h4>
                          <p className="text-3xl font-extrabold text-primary mb-4 dark:text-primary-foreground">₹{fee.amount.toLocaleString()}</p>
                          {fee.notes && <p className="text-muted-foreground text-sm dark:text-[#b0b0b0]">{fee.notes}</p>}
                          </CardContent>
                        </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground dark:text-[#b0b0b0]">No fee information available.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Quiz Section (Remains outside TabsContent for now) */}
      {quiz && (
        <section className="py-16 md:py-24 bg-secondary-background dark:bg-[#121212]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-foreground mb-10 text-center dark:text-white">Test Your Knowledge</h2>
            <Card className="bg-card dark:bg-[#2a2a2a] border border-border/50 dark:border-[#3a3a3a] rounded-2xl shadow-lg p-6 md:p-8">
              <CardContent>
                <QuizComponent courseId={course?.id} />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {leadFormSource.includes("Enroll Now") ? "Enroll in " : "Download Syllabus for "}
              {course?.title || "this course"}
            </DialogTitle>
            <DialogDescription>
              Fill in your details to proceed.
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            source={leadFormSource}
            courseInterest={course?.title}
            buttonText={leadFormSource.includes("Enroll Now") ? "Enroll Now" : "Download Syllabus"}
            onSuccess={() => setIsLeadFormOpen(false)}
            courseSlug={course?.slug}
            syllabusDownloadUrl={course?.syllabusUrl || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}