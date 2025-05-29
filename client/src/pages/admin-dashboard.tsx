import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatedLoading, LoadingButton } from "@/components/ui/animated-loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageSquare, 
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  DollarSign,
  Target,
  Award
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Course, Lead, Testimonial, BlogPost, FAQ, InsertCourse } from "@shared/schema";

// Enhanced course form schema with all sections
const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  prerequisites: z.string().optional(),
  mode: z.enum(["online", "offline", "hybrid"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0, "Price must be positive").optional(),
  category: z.string().min(1, "Category is required"),
  icon: z.string().min(1, "Icon is required"),
  features: z.array(z.string()).default([]),
  syllabusUrl: z.string().url().optional().or(z.literal("")),
  batchDates: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  
  // Enhanced course page sections
  overview: z.string().optional(),
  mainImage: z.string().optional(),
  logo: z.string().optional(),
  
  // Curriculum structure
  curriculum: z.array(z.object({
    sectionTitle: z.string(),
    items: z.array(z.string()),
  })).default([]),
  
  // Batches information
  batches: z.array(z.object({
    startDate: z.string(),
    time: z.string(),
    mode: z.string(),
    instructor: z.string(),
  })).default([]),
  
  // Fee structures
  fees: z.array(z.object({
    label: z.string(),
    amount: z.number(),
    notes: z.string(),
  })).default([]),
  
  // Additional course details
  careerOpportunities: z.array(z.string()).default([]),
  toolsAndTechnologies: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

// Testimonial form schema
const testimonialFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  courseName: z.string().min(1, "Course name is required"),
  review: z.string().min(1, "Review is required"),
  rating: z.number().min(1).max(5),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  image: z.string().optional(),
  isApproved: z.boolean().default(false),
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

// Blog post form schema
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  category: z.string().min(1, "Category is required"),
  featuredImage: z.string().optional(),
  isPublished: z.boolean().default(false),
  readingTime: z.number().default(5),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Course management state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Testimonial management state
  const [isCreateTestimonialOpen, setIsCreateTestimonialOpen] = useState(false);
  const [isEditTestimonialOpen, setIsEditTestimonialOpen] = useState(false);
  const [isDeleteTestimonialOpen, setIsDeleteTestimonialOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  
  // Blog management state
  const [isCreateBlogOpen, setIsCreateBlogOpen] = useState(false);
  const [isEditBlogOpen, setIsEditBlogOpen] = useState(false);
  const [isDeleteBlogOpen, setIsDeleteBlogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);

  // Course forms
  const createForm = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      duration: "",
      prerequisites: "",
      mode: "online",
      level: "beginner",
      price: 0,
      category: "",
      icon: "",
      features: [],
      syllabusUrl: "",
      batchDates: [],
      isActive: true,
    },
  });

  const editForm = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
  });

  // Testimonial form
  const testimonialForm = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      courseName: "",
      review: "",
      rating: 5,
      jobTitle: "",
      company: "",
      image: "",
      isApproved: false,
    },
  });

  // Edit testimonial form
  const editTestimonialForm = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
  });

  // Blog form
  const blogForm = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "",
      featuredImage: "",
      isPublished: false,
      readingTime: 5,
    },
  });

  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(data),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned invalid response format");
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create course");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Success",
        description: "Course created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CourseFormData }) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update course");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      toast({
        title: "Success",
        description: "Course updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
      toast({
        title: "Success",
        description: "Course deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  // Testimonial mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create testimonial");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsCreateTestimonialOpen(false);
      testimonialForm.reset();
      toast({
        title: "Success",
        description: "Testimonial created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create testimonial",
        variant: "destructive",
      });
    },
  });

  // Blog post mutations
  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsCreateBlogOpen(false);
      blogForm.reset();
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TestimonialFormData }) => {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update testimonial");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsEditTestimonialOpen(false);
      setSelectedTestimonial(null);
      toast({
        title: "Success",
        description: "Testimonial updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update testimonial",
        variant: "destructive",
      });
    },
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      setIsDeleteTestimonialOpen(false);
      setTestimonialToDelete(null);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonial",
        variant: "destructive",
      });
    },
  });

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BlogFormData }) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update blog post");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsEditBlogOpen(false);
      setSelectedBlog(null);
      toast({
        title: "Success",
        description: "Blog post updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete blog post");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDeleteBlogOpen(false);
      setBlogToDelete(null);
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  // Course management functions
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    editForm.reset({
      title: course.title,
      slug: course.slug,
      description: course.description,
      duration: course.duration,
      prerequisites: course.prerequisites || "",
      mode: course.mode as "online" | "offline" | "hybrid",
      level: course.level as "beginner" | "intermediate" | "advanced",
      price: course.price || 0,
      category: course.category,
      icon: course.icon,
      features: Array.isArray(course.features) ? course.features : [],
      syllabusUrl: course.syllabusUrl || "",
      batchDates: Array.isArray(course.batchDates) ? course.batchDates : [],
      isActive: course.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const onCreateSubmit = (data: CourseFormData) => {
    createCourseMutation.mutate(data);
  };

  const onEditSubmit = (data: CourseFormData) => {
    if (selectedCourse) {
      updateCourseMutation.mutate({ id: selectedCourse.id, data });
    }
  };

  // Testimonial submit handler
  const onTestimonialSubmit = (data: TestimonialFormData) => {
    createTestimonialMutation.mutate(data);
  };

  // Blog submit handler
  const onBlogSubmit = (data: BlogFormData) => {
    createBlogMutation.mutate(data);
  };

  // Blog management handlers  
  const handleEditBlog = (post: BlogPost) => {
    setSelectedBlog(post);
    editForm.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      featuredImage: post.featuredImage || "",
      isPublished: post.isPublished,
      readingTime: post.readingTime,
      authorId: post.authorId || 1,
    });
    setIsEditBlogOpen(true);
  };

  const handleDeleteBlog = (post: BlogPost) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      deleteBlogMutation.mutate(post.id);
    }
  };

  const handleViewBlog = (post: BlogPost) => {
    // Toggle content visibility instead of redirecting
    const element = document.getElementById(`blog-content-${post.id}`);
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  };

  // Testimonial management handlers
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    editTestimonialForm.reset({
      name: testimonial.name,
      courseName: testimonial.courseName,
      review: testimonial.review,
      rating: testimonial.rating,
      jobTitle: testimonial.jobTitle || "",
      company: testimonial.company || "",
      image: testimonial.image || "",
      isApproved: testimonial.isApproved,
    });
    setIsEditTestimonialOpen(true);
  };

  const handleDeleteTestimonial = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteTestimonialOpen(true);
  };

  const onEditTestimonialSubmit = (data: TestimonialFormData) => {
    if (selectedTestimonial) {
      updateTestimonialMutation.mutate({ id: selectedTestimonial.id, data });
    }
  };



  const onEditBlogSubmit = (data: BlogFormData) => {
    if (selectedBlog) {
      updateBlogMutation.mutate({ id: selectedBlog.id, data });
    }
  };

  // Check authentication from localStorage (immediate, no API calls needed)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch all data (hooks must be called FIRST before any conditional logic)
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: isAuthenticated,
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
    enabled: isAuthenticated,
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ['/api/testimonials'],
    enabled: isAuthenticated,
  });

  const { data: blogPosts = [], isLoading: blogPostsLoading } = useQuery({
    queryKey: ['/api/blog'],
    enabled: isAuthenticated,
  });

  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ['/api/faqs'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    const authenticated = localStorage.getItem('admin_authenticated') === 'true';
    
    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      setLocation('/cyberedus-agent');
    }
    setAuthChecked(true);
  }, [setLocation]);

  // Show loading while checking auth
  if (!authChecked) {
    return <AnimatedLoading isLoading={true} />;
  }

  // Loading states
  if (coursesLoading || leadsLoading || testimonialsLoading || blogPostsLoading || faqsLoading) {
    return <AnimatedLoading isLoading={true} />;
  }

  // Calculate stats
  const stats = {
    totalCourses: Array.isArray(courses) ? courses.length : 0,
    totalLeads: Array.isArray(leads) ? leads.length : 0,
    approvedTestimonials: Array.isArray(testimonials) ? testimonials.filter((t: any) => t.isApproved).length : 0,
    publishedBlogs: Array.isArray(blogPosts) ? blogPosts.filter((b: any) => b.isPublished).length : 0,
    conversionRate: Array.isArray(leads) && Array.isArray(testimonials) && leads.length > 0 ? Math.round((testimonials.length / leads.length) * 100) : 0,
  };

  const recentLeads = leads.slice(-5).reverse();
  const recentTestimonials = testimonials.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your CyberEdu platform
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Quick Actions
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Leads</p>
                  <p className="text-3xl font-bold">{stats.totalLeads}</p>
                </div>
                <Target className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Testimonials</p>
                  <p className="text-3xl font-bold">{stats.approvedTestimonials}</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Blog Posts</p>
                  <p className="text-3xl font-bold">{stats.publishedBlogs}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Conversion</p>
                  <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Leads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Recent Leads
                  </CardTitle>
                  <CardDescription>Latest customer inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLeads.map((lead: Lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{lead.email}</p>
                          <p className="text-xs text-gray-500">{lead.course_interest || 'General inquiry'}</p>
                        </div>
                        <Badge variant="outline">{lead.source}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Recent Testimonials
                  </CardTitle>
                  <CardDescription>Latest student feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTestimonials.map((testimonial: Testimonial) => (
                      <div key={testimonial.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
                          <Badge variant={testimonial.approved ? "default" : "secondary"}>
                            {testimonial.approved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {testimonial.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{testimonial.company}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>Manage your educational content</CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                        <DialogDescription>
                          Create a comprehensive course with overview, curriculum, batches, and fees
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
                          {/* Basic Information Section */}
                          <div className="border rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                            <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={createForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Course Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter course title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createForm.control}
                              name="slug"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Slug</FormLabel>
                                  <FormControl>
                                    <Input placeholder="course-slug" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={createForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Course description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={createForm.control}
                              name="level"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Level</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="beginner">Beginner</SelectItem>
                                      <SelectItem value="intermediate">Intermediate</SelectItem>
                                      <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createForm.control}
                              name="duration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., 8 weeks" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="0" 
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={createForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Cybersecurity" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createForm.control}
                              name="icon"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Icon</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., shield" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end gap-3 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsCreateDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <LoadingButton 
                              isLoading={createCourseMutation.isPending}
                              variant="security"
                              className="min-w-[140px]"
                            >
                              Create Course
                            </LoadingButton>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course: Course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{course.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge>{course.level}</Badge>
                          <span className="text-sm text-gray-500">{course.duration}</span>
                          <span className="text-sm font-medium text-green-600">${course.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCourse(course as Course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCourse(course as Course)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
                <CardDescription>Track and manage customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead: Lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{lead.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{lead.phone}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge>{lead.source}</Badge>
                          <span className="text-sm text-gray-500">{lead.course_interest}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(lead.created_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Testimonial Management</CardTitle>
                    <CardDescription>Review and approve student testimonials</CardDescription>
                  </div>
                  <Button onClick={() => setIsCreateTestimonialOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial: Testimonial) => (
                    <div key={testimonial.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role} at {testimonial.company}</p>
                        </div>
                        <Badge variant={testimonial.approved ? "default" : "secondary"}>
                          {testimonial.approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{testimonial.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditTestimonial(testimonial)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteTestimonial(testimonial)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blog Management</CardTitle>
                    <CardDescription>Manage your blog content</CardDescription>
                  </div>
                  <Button onClick={() => setIsCreateBlogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post: BlogPost) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{post.excerpt}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant={post.isPublished ? "default" : "secondary"}>
                              {post.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <span className="text-sm text-gray-500">{post.category}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewBlog(post)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditBlog(post)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteBlog(post)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div id={`blog-content-${post.id}`} style={{ display: 'none' }} className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Full Content:</h4>
                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {post.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>FAQ Management</CardTitle>
                    <CardDescription>Manage frequently asked questions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq: FAQ) => (
                    <div key={faq.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                        <Badge variant={faq.active ? "default" : "secondary"}>
                          {faq.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{faq.answer}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Category: {faq.category}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Testimonial Dialog */}
      <Dialog open={isCreateTestimonialOpen} onOpenChange={setIsCreateTestimonialOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
            <DialogDescription>
              Create a new testimonial for your courses.
            </DialogDescription>
          </DialogHeader>
          <Form {...testimonialForm}>
            <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="space-y-4">
              <FormField
                control={testimonialForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={testimonialForm.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Course they took" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={testimonialForm.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Their testimonial..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={testimonialForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="5" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={testimonialForm.control}
                  name="isApproved"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Approved</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={testimonialForm.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={testimonialForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateTestimonialOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTestimonialMutation.isPending}>
                  {createTestimonialMutation.isPending ? "Creating..." : "Create Testimonial"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Blog Post Dialog */}
      <Dialog open={isCreateBlogOpen} onOpenChange={setIsCreateBlogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write and publish a new blog post.
            </DialogDescription>
          </DialogHeader>
          <Form {...blogForm}>
            <form onSubmit={blogForm.handleSubmit(onBlogSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={blogForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="blog-post-url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={blogForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your blog post content here..." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={blogForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="cybersecurity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogForm.control}
                  name="readingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reading Time (min)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={blogForm.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Published</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={blogForm.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateBlogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createBlogMutation.isPending}>
                  {createBlogMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}