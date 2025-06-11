import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useEffect } from "react";
import { initGA } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { BackgroundContainer } from "@/components/BackgroundContainer";

// Pages
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import About from "@/pages/about";
import Testimonials from "@/pages/testimonials";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import CourseEditor from "@/pages/course-editor";
import MascotDemo from "@/pages/mascot-demo";
import NotFound from "@/pages/not-found";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/course/:slug" element={<CourseDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cyberedus-agent" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/courses/new" element={<CourseEditor />} />
      <Route path="/mascot-demo" element={<MascotDemo />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <BackgroundContainer>
            <Router />
            </BackgroundContainer>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
