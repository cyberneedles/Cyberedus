import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface AdvancedQuizProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, answers: number[]) => void;
  timeLimit?: number; // in seconds
  passingScore?: number; // percentage
}

export default function AdvancedQuiz({ 
  title, 
  questions, 
  onComplete, 
  timeLimit = 300, 
  passingScore = 70 
}: AdvancedQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleFinishQuiz();
    }
  }, [timeLeft, isTimerActive, showResults]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishQuiz = () => {
    setIsTimerActive(false);
    setShowResults(true);
    
    const score = calculateScore();
    if (onComplete) {
      onComplete(score, selectedAnswers);
    }
  };

  const calculateScore = () => {
    const correct = selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index]?.correct ? acc + 1 : acc;
    }, 0);
    return Math.round((correct / questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeLeft(timeLimit);
    setIsTimerActive(true);
  };

  const score = calculateScore();
  const isPassing = score >= passingScore;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="p-8 text-center border border-border rounded-xl card-professional interactive-card bg-gradient-to-br from-card to-secondary/10">
          <div className="mb-6">
            {isPassing ? (
              <Trophy className="h-16 w-16 text-warning mx-auto mb-4 float-sophisticated" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            )}
            
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Quiz Complete!
            </h2>
            
            <div className="text-6xl font-bold mb-4">
              <span className={cn(
                "bg-gradient-to-r bg-clip-text text-transparent counter-animation",
                isPassing 
                  ? "from-success to-accent" 
                  : "from-warning to-destructive"
              )}>
                {score}%
              </span>
            </div>
            
            <Badge 
              variant={isPassing ? "default" : "destructive"} 
              className={cn(
                "text-lg px-4 py-2",
                isPassing && "bg-success hover:bg-success/80 pulse-glow"
              )}
            >
              {isPassing ? "Passed!" : "Needs Improvement"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-4 bg-secondary/30 rounded-lg dopamine-hover">
              <div className="text-2xl font-bold text-foreground">{selectedAnswers.filter((answer, index) => answer === questions[index]?.correct).length}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg dopamine-hover">
              <div className="text-2xl font-bold text-foreground">{questions.length - selectedAnswers.filter((answer, index) => answer === questions[index]?.correct).length}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg dopamine-hover">
              <div className="text-2xl font-bold text-foreground">{formatTime(timeLimit - timeLeft)}</div>
              <div className="text-sm text-muted-foreground">Time Taken</div>
            </div>
          </div>
          
          <Button 
            onClick={resetQuiz} 
            variant="outline" 
            className="btn-glow dopamine-hover"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
        </Card>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Review Your Answers</h3>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <Card key={index} className={cn(
                "p-6 border rounded-xl card-professional",
                isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
              )}>
                <div className="flex items-start space-x-4">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-3">
                      Question {index + 1}: {question.question}
                    </h4>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={cn(
                            "p-3 rounded-lg border",
                            optionIndex === question.correct && "border-success bg-success/10 text-success",
                            optionIndex === userAnswer && optionIndex !== question.correct && "border-destructive bg-destructive/10 text-destructive",
                            optionIndex !== question.correct && optionIndex !== userAnswer && "border-border bg-secondary/20"
                          )}
                        >
                          {option}
                          {optionIndex === question.correct && (
                            <Badge variant="secondary" className="ml-2 text-success">Correct</Badge>
                          )}
                          {optionIndex === userAnswer && optionIndex !== question.correct && (
                            <Badge variant="destructive" className="ml-2">Your Answer</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {question.explanation && (
                      <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                        <p className="text-sm text-foreground">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card className="p-6 border border-border rounded-xl card-professional bg-gradient-to-br from-card to-secondary/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className={cn(
                "font-mono text-lg",
                timeLeft < 60 && "text-warning",
                timeLeft < 30 && "text-destructive animate-pulse"
              )}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge variant="outline" className="dopamine-hover">
              {currentQuestion + 1} / {questions.length}
            </Badge>
          </div>
        </div>
        
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">
          Progress: {Math.round(progress)}% complete
        </p>
      </Card>

      {/* Question Card */}
      <Card className="p-8 border border-border rounded-xl card-professional interactive-card stagger-animation">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          {currentQ?.question}
        </h3>
        
        <div className="space-y-3 mb-8">
          {currentQ?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={cn(
                "w-full p-4 text-left rounded-lg border transition-all duration-300 dopamine-hover",
                selectedAnswers[currentQuestion] === index
                  ? "border-accent bg-accent/10 text-accent shadow-md"
                  : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                  selectedAnswers[currentQuestion] === index
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border"
                )}>
                  {selectedAnswers[currentQuestion] === index && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePreviousQuestion}
            variant="outline"
            disabled={currentQuestion === 0}
            className="dopamine-hover"
          >
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full",
                  index === currentQuestion && "bg-accent pulse-glow",
                  index < currentQuestion && "bg-success",
                  index > currentQuestion && "bg-secondary",
                  selectedAnswers[index] !== undefined && index !== currentQuestion && "bg-info"
                )}
              />
            ))}
          </div>
          
          <Button
            onClick={currentQuestion === questions.length - 1 ? handleFinishQuiz : handleNextQuestion}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="btn-glow dopamine-hover group"
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </div>
  );
}