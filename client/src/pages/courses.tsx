import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Course } from "@shared/schema";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/forms/lead-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BackgroundContainer } from "@/components/BackgroundContainer";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | undefined>(undefined);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | undefined>(undefined);
  const [syllabusDownloadUrl, setSyllabusDownloadUrl] = useState<string | undefined>(undefined);

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleSyllabusDownload = (courseTitle: string, courseSlug: string, syllabusUrl: string) => {
    trackEvent("syllabus_download", "course", courseTitle);
    setSelectedCourseTitle(courseTitle);
    setSelectedCourseSlug(courseSlug);
    setSyllabusDownloadUrl(syllabusUrl);
    setIsLeadFormOpen(true);
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
              Our Comprehensive Courses
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose from our industry-designed curriculum with 80% hands-on training, real projects, and direct placement support
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-2xl font-bold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="course-card">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <i className={`${course.icon} text-2xl text-primary`}></i>
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
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4">{course.title}</h3>
                    <p className="text-muted-foreground mb-6">{course.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <i className="fas fa-clock mr-2 text-primary"></i>
                        Duration: {course.duration}
                      </div>
                      {course.prerequisites && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <i className="fas fa-user mr-2 text-primary"></i>
                          Prerequisites: {course.prerequisites}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <i className="fas fa-laptop mr-2 text-primary"></i>
                        Mode: {course.mode === "both" ? "Online & Offline" : 
                               course.mode === "online" ? "Online" : "Offline"}
                      </div>
                      {course.price && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <i className="fas fa-rupee-sign mr-2 text-primary"></i>
                          Fee: ₹{course.price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Key Features:</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {course.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upcoming Batches */}
                    {course.batchDates && course.batchDates.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Upcoming Batches:</h4>
                        <div className="space-y-1">
                          {course.batchDates.slice(0, 2).map((date, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              <i className="fas fa-calendar mr-2 text-primary"></i>
                              {new Date(date).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tools & Technologies */}
                    {course.toolsAndTechnologies && course.toolsAndTechnologies.trim() !== '' && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Tools & Technologies:</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">{course.toolsAndTechnologies}</p>
                      </div>
                    )}

                    {/* What You'll Learn */}
                    {course.whatYouWillLearn && course.whatYouWillLearn.trim() !== '' && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3">What You'll Learn:</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">{course.whatYouWillLearn}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-border">
                      <Link to={`/course/${course.slug}`}>
                        <Button className="btn-primary">View Details</Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-secondary"
                        onClick={() => handleSyllabusDownload(course.title, course.slug, course.syllabusUrl || "")}
                      >
                        <i className="fas fa-download mr-1"></i>Syllabus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get personalized course recommendations from our education counselors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="btn-primary">
                <i className="fas fa-phone mr-2"></i>Talk to Counselor
              </Button>
            </Link>
            <Button variant="outline" className="btn-secondary">
              <i className="fas fa-calendar mr-2"></i>Schedule Free Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Syllabus</DialogTitle>
            <DialogDescription>
              Fill in your details to download the syllabus for {selectedCourseTitle || "this course"}.
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            source="Courses Page - Syllabus"
            courseInterest={selectedCourseTitle}
            buttonText="Download Syllabus"
            onSuccess={() => setIsLeadFormOpen(false)}
            courseSlug={selectedCourseSlug}
            syllabusDownloadUrl={syllabusDownloadUrl}
          />
        </DialogContent>
      </Dialog>
    </BackgroundContainer>
  );
}
