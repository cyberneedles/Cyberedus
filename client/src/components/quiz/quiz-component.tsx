import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/forms/lead-form";
import { Quiz } from "@shared/schema";

interface QuizComponentProps {
  courseId?: number;
}

export default function QuizComponent({ courseId }: QuizComponentProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<"lead" | "quiz" | "results">("lead");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [leadData, setLeadData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default quiz questions for general assessment
  const defaultQuestions = [
    {
      question: "What best describes your current background?",
      options: ["Student or Recent Graduate", "Working Professional", "Career Switcher", "Entrepreneur/Business Owner"]
    },
    {
      question: "What's your primary goal?",
      options: ["Learn cybersecurity fundamentals", "Advance my current career", "Switch to tech industry", "Start my own business"]
    },
    {
      question: "How much time can you dedicate weekly?",
      options: ["5-10 hours", "10-20 hours", "20-30 hours", "30+ hours"]
    },
    {
      question: "What's your preferred learning style?",
      options: ["Hands-on practice", "Theory with examples", "Mixed approach", "Self-paced learning"]
    },
    {
      question: "Which area interests you most?",
      options: ["Ethical Hacking", "Software Development", "Both equally", "Not sure yet"]
    }
  ];

  const { data: quiz } = useQuery<Quiz>({
    queryKey: [`/api/courses/${courseId}/quiz`],
    enabled: !!courseId,
  });

  const questions = quiz?.questions || defaultQuestions;
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  const handleLeadSubmit = (data: any) => {
    setLeadData(data);
    setCurrentStep("quiz");
    trackEvent("quiz_started", "engagement", "assessment");
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === undefined) {
      toast({
        title: "Please select an answer",
        description: "Choose one option before proceeding to the next question.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = async () => {
    setIsSubmitting(true);
    
    try {
      const score = answers.length; // Simple scoring for demonstration
      const quizResults = {
        score,
        totalQuestions: questions.length,
        answers,
      };

      // Submit quiz results as part of lead data
      await apiRequest("POST", "/api/leads", {
        ...leadData,
        source: "quiz",
        quizResults,
      });

      trackEvent("quiz_completed", "engagement", "assessment");
      setCurrentStep("results");
    } catch (error) {
      console.error("Failed to submit quiz results:", error);
      toast({
        title: "Error",
        description: "Failed to submit quiz results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecommendedCourse = () => {
    // Simple recommendation logic based on answers
    const lastAnswer = answers[answers.length - 1];
    
    if (courseId) {
      return "Continue with this course - it's perfect for your goals!";
    }

    switch (lastAnswer) {
      case 0: // Ethical Hacking
        return "Certified Ethical Hacker (CEH)";
      case 1: // Software Development
        return "Full Stack Java Development";
      case 2: // Both equally
        return "Advanced Cybersecurity Mastery";
      default:
        return "Python Programming";
    }
  };

  const getCourseReason = () => {
    return "Based on your responses, this course will provide you with the perfect foundation and hands-on experience to achieve your career goals.";
  };

  if (currentStep === "lead") {
    return (
      <div className="animate-on-scroll">
        <LeadForm
          source="quiz"
          title="Get Your Personalized Results"
          description="Complete this short form to access your customized course recommendations"
          buttonText="Start Assessment"
          onSubmit={handleLeadSubmit}
        />
      </div>
    );
  }

  if (currentStep === "results") {
    return (
      <div className="animate-on-scroll">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <i className="fas fa-check-circle text-6xl text-accent mb-4"></i>
              <h3 className="text-2xl font-bold text-foreground mb-4">Assessment Complete!</h3>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-primary mb-2">Recommended Course:</h4>
              <p className="text-xl font-bold text-foreground mb-2">{getRecommendedCourse()}</p>
              <p className="text-muted-foreground">{getCourseReason()}</p>
            </div>
            
            <div className="space-y-4">
              <Button className="btn-primary w-full">
                <i className="fas fa-graduation-cap mr-2"></i>
                Enroll Now
              </Button>
              <Button variant="outline" className="w-full">
                <i className="fas fa-phone mr-2"></i>
                Talk to Counselor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-on-scroll">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">Knowledge Assessment</h2>
        <p className="text-xl text-muted-foreground">
          Answer a few questions to get personalized course recommendations
        </p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </div>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {questions[currentQuestion]?.question}
            </h3>
            
            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {questions[currentQuestion]?.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary transition-colors duration-200 cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Submitting...
                </>
              ) : currentQuestion === questions.length - 1 ? (
                <>
                  Finish <i className="fas fa-check ml-2"></i>
                </>
              ) : (
                <>
                  Next <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
