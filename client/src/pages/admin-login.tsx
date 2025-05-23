import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate email domain
      if (!formData.email.endsWith("@cyberedus.com")) {
        throw new Error("Access restricted to @cyberedus.com email addresses only");
      }

      const response = await apiRequest("POST", "/api/auth/login", formData);
      const data = await response.json();

      if (data.user) {
        // In a real app, you'd store the JWT token
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        setLocation("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-alt text-2xl text-primary"></i>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">CyberEdu Admin</CardTitle>
          <p className="text-muted-foreground">Access restricted to authorized personnel</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <i className="fas fa-exclamation-triangle h-4 w-4"></i>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your-name@cyberedus.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <p className="text-xs text-muted-foreground">
                Only @cyberedus.com email addresses are allowed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need access? Contact your system administrator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
