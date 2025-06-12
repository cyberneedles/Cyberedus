import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertLeadSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Rocket, Target, Users, CheckCircle, ArrowRight } from "lucide-react";
import { z } from "zod";

const enhancedLeadSchema = insertLeadSchema.extend({
  courseInterest: z.string().optional(),
  experience: z.string().optional(),
  message: z.string().optional(),
});

type EnhancedLeadFormData = z.infer<typeof enhancedLeadSchema>;

interface EnhancedLeadCaptureProps {
  source: string;
  courseInterest?: string;
  onSuccess?: () => void;
  variant?: "compact" | "detailed" | "quiz-result";
  quizResults?: {
    score: number;
    totalQuestions: number;
    answers: number[];
  };
}

const experienceLevels = [
  "Complete Beginner",
  "Some Basic Knowledge",
  "Intermediate",
  "Advanced",
  "Expert/Professional"
];

export default function EnhancedLeadCapture({
  source,
  courseInterest,
  onSuccess,
  variant = "detailed",
  quizResults
}: EnhancedLeadCaptureProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EnhancedLeadFormData>({
    resolver: zodResolver(enhancedLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      courseInterest: courseInterest || "",
      experience: "",
      message: "",
      source,
    },
  });

  const leadMutation = useMutation({
    mutationFn: async (data: EnhancedLeadFormData) => {
      const leadData = {
        ...data,
        quizResults: quizResults || undefined
      };
      return apiRequest("/api/leads", {
        method: "POST",
        body: JSON.stringify(leadData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success! 🎉",
        description: "Thank you for your interest! Our team will contact you soon.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EnhancedLeadFormData) => {
    leadMutation.mutate(data);
  };

  if (variant === "compact") {
    return (
      <Card className="p-6 border border-border rounded-xl card-professional bg-gradient-to-br from-card to-accent/5 interactive-card">
        <div className="text-center mb-6">
          <Sparkles className="h-8 w-8 text-accent mx-auto mb-3 float-sophisticated" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Get Started Today!</h3>
          <p className="text-muted-foreground">Join 1200+ students advancing their cybersecurity careers</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} className="dopamine-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email Address" {...field} className="dopamine-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} className="dopamine-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full btn-glow dopamine-hover group"
              disabled={leadMutation.isPending}
            >
              {leadMutation.isPending ? "Submitting..." : "Get Free Consultation"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Form>
      </Card>
    );
  }

  if (variant === "quiz-result" && quizResults) {
    return (
      <Card className="p-8 border border-border rounded-xl card-professional interactive-card bg-gradient-to-br from-card to-accent/5">
        <div className="text-center mb-6">
          <Target className="h-12 w-12 text-accent mx-auto mb-4 float-sophisticated" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            Great Job! Score: {quizResults.score}%
          </h3>
          <p className="text-lg text-muted-foreground mb-4">
            Ready to take your cybersecurity skills to the next level?
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-secondary/30 rounded-lg dopamine-hover">
              <div className="text-xl font-bold text-accent counter-animation">{quizResults.score}%</div>
              <div className="text-xs text-muted-foreground">Your Score</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg dopamine-hover">
              <div className="text-xl font-bold text-info counter-animation">{Math.round((quizResults.score / 100) * quizResults.totalQuestions)}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg dopamine-hover">
              <div className="text-xl font-bold text-warning counter-animation">{quizResults.totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} className="dopamine-hover" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} className="dopamine-hover" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 XXXXX XXXXX" {...field} className="dopamine-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="dopamine-hover">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full btn-glow dopamine-hover group"
              disabled={leadMutation.isPending}
            >
              {leadMutation.isPending ? "Submitting..." : "Get Personalized Course Recommendations"}
              <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Form>
      </Card>
    );
  }

  // Detailed form
  return (
    <Card className="p-8 border border-border rounded-xl card-professional interactive-card bg-gradient-to-br from-card to-secondary/5">
      <div className="text-center mb-8">
        <Users className="h-12 w-12 text-accent mx-auto mb-4 float-sophisticated" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">Start Your Cybersecurity Journey</h3>
        <p className="text-muted-foreground">Join thousands of professionals advancing their careers</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} className="dopamine-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} className="dopamine-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 XXXXX XXXXX" {...field} className="dopamine-hover" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="dopamine-hover">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Interest (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ethical Hacking, Digital Forensics" {...field} className="dopamine-hover" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific questions or requirements?"
                    className="dopamine-hover"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
              <div className="text-sm text-foreground">
                <strong>What happens next?</strong>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Free 15-minute consultation call</li>
                  <li>• Personalized learning roadmap</li>
                  <li>• Course recommendations based on your goals</li>
                  <li>• Information about upcoming batches</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-glow dopamine-hover group"
            disabled={leadMutation.isPending}
          >
            {leadMutation.isPending ? "Submitting..." : "Get My Free Consultation"}
            <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </Form>
    </Card>
  );
}