import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";

interface LeadFormProps {
  source?: string;
  courseInterest?: string;
  buttonText?: string;
  title?: string;
  description?: string;
  onSubmit?: () => void;
  onSuccess?: () => void;
  courseSlug?: string;
  syllabusDownloadUrl?: string;
}

export default function LeadForm({ 
  source = "website", 
  courseInterest, 
  buttonText = "Submit", 
  title = "Get in Touch",
  description,
  onSubmit,
  onSuccess,
  courseSlug,
  syllabusDownloadUrl,
}: LeadFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentLocation: "",
    courseInterest: courseInterest || "",
    experience: "",
    message: "",
  });

  // Fetch all courses to map course titles to slugs
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalSource = source;
    let currentCourseSlug = courseSlug;

    // If a course interest is selected and no slug is provided, find the slug
    if (formData.courseInterest && !currentCourseSlug) {
      const foundCourse = courses.find(c => c.title === formData.courseInterest);
      if (foundCourse) {
        currentCourseSlug = foundCourse.slug;
      }
    }

    // Append slug if it's a course-related source and a slug is available
    if (currentCourseSlug) {
      if (finalSource.includes("Courses Page") || finalSource.includes("Course Detail") || finalSource.includes("Homepage")) {
        if (!finalSource.endsWith(currentCourseSlug)) {
          finalSource = `${finalSource} - ${currentCourseSlug}`;
        }
      }
    }

    try {
      await apiRequest("POST", "/api/leads", {
        ...formData,
        source: finalSource,
      });

      trackEvent("lead_generated", "form", finalSource);

      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll contact you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        currentLocation: "",
        courseInterest: courseInterest || "",
        experience: "",
        message: "",
      });

      onSubmit?.();
      onSuccess?.();

      // Trigger syllabus download if applicable
      if (syllabusDownloadUrl && finalSource.includes("Download Syllabus")) {
        window.open(syllabusDownloadUrl, '_blank');
      }

    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full max-w-full mx-auto">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h2>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              className="form-input text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
            
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              className="form-input text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              className="form-input text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
            
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="currentLocation" className="text-sm sm:text-base">Current Location *</Label>
            <Input
              id="currentLocation"
              name="currentLocation"
              placeholder="Your city, country"
              value={formData.currentLocation}
              onChange={handleInputChange}
              required
              className="form-input text-sm sm:text-base h-10 sm:h-11"
            />
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="courseInterest" className="text-sm sm:text-base">Course Interest</Label>
              <Select 
                value={formData.courseInterest} 
                onValueChange={(value) => handleSelectChange("courseInterest", value)}
              >
            <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certified Ethical Hacker (CEH)">Certified Ethical Hacker (CEH)</SelectItem>
                  <SelectItem value="Advanced Cybersecurity">Advanced Cybersecurity</SelectItem>
                  <SelectItem value="Bug Bounty Program">Bug Bounty Program</SelectItem>
                  <SelectItem value="Full Stack Java">Full Stack Java</SelectItem>
                  <SelectItem value="Python Programming">Python Programming</SelectItem>
                  <SelectItem value="Interview Preparation">Interview Preparation</SelectItem>
                  <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
          </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="experience" className="text-sm sm:text-base">Current Experience Level</Label>
            <Select 
              value={formData.experience} 
              onValueChange={(value) => handleSelectChange("experience", value)}
            >
            <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Some Experience">Some Experience</SelectItem>
                <SelectItem value="Experienced">Experienced</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="message" className="text-sm sm:text-base">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your goals and how we can help you"
              value={formData.message}
              onChange={handleInputChange}
            rows={3}
            className="form-input text-sm sm:text-base resize-none"
            />
          </div>

          <Button 
            type="submit" 
          className="w-full btn-primary text-base sm:text-lg py-2 sm:py-3 h-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner w-4 h-4 mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                {buttonText}
              </>
            )}
          </Button>
        </form>
    </div>
  );
}
