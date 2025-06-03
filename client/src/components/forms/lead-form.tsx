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

interface LeadFormProps {
  source?: string;
  courseInterest?: string;
  buttonText?: string;
  title?: string;
  description?: string;
  onSubmit?: () => void;
  onSuccess?: () => void;
}

export default function LeadForm({ 
  source = "website", 
  courseInterest, 
  buttonText = "Submit", 
  title = "Get in Touch",
  description,
  onSubmit,
  onSuccess 
}: LeadFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseInterest: courseInterest || "",
    experience: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/leads", {
        ...formData,
        source,
      });

      trackEvent("lead_generated", "form", source);

      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll contact you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        courseInterest: courseInterest || "",
        experience: "",
        message: "",
      });

      onSubmit?.();
      onSuccess?.();
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseInterest">Course Interest</Label>
              <Select 
                value={formData.courseInterest} 
                onValueChange={(value) => handleSelectChange("courseInterest", value)}
              >
                <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Current Experience Level</Label>
            <Select 
              value={formData.experience} 
              onValueChange={(value) => handleSelectChange("experience", value)}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your goals and how we can help you"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="form-input"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full btn-primary text-lg py-6"
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
      </CardContent>
    </Card>
  );
}
