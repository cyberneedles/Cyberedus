import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CyberMascot, CyberLoading } from "@/components/ui/cyber-mascot";
import { signInWithEmailAndPassword } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Debug: Log email and password before attempting login
    console.log('Attempting login with:', { email: email, password: password });

    try {
      // First, authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(email, password);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Then, create a session on the backend by sending the ID token
      const response = await apiRequest("POST", "/api/auth/login", {
        idToken: idToken,
      });

      if (response.ok) {
        // Store authentication state
        localStorage.setItem('admin_authenticated', 'true');
        
      toast({
        title: "Login successful",
        description: "Welcome back, admin!",
      });
      navigate("/admin");
      } else {
        throw new Error("Backend authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Debug: Log specific error details
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cyberedu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <CyberLoading /> : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="fixed bottom-4 right-4">
        <CyberMascot state="idle" />
      </div>
    </div>
  );
}
