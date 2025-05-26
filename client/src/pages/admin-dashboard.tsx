import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
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
import type { Course, Lead, Testimonial, BlogPost, FAQ } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Check authentication
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['/api/admin/session'],
    retry: false
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      setLocation('/cyberedus-agent');
    }
  }, [session, sessionLoading, setLocation]);

  // Fetch all data (hooks must be called before any conditional returns)
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: !!session?.authenticated,
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
    enabled: !!session?.authenticated,
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ['/api/testimonials'],
    enabled: !!session?.authenticated,
  });

  // Show loading while checking authentication
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!session?.authenticated) {
    return null;
  }

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ['/api/blog'],
  });

  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ['/api/faqs'],
  });

  // Calculate stats
  const stats = {
    totalCourses: courses.length,
    totalLeads: leads.length,
    approvedTestimonials: testimonials.filter((t: Testimonial) => t.approved).length,
    publishedBlogs: blogPosts.filter((b: BlogPost) => b.published).length,
    conversionRate: leads.length > 0 ? Math.round((testimonials.length / leads.length) * 100) : 0,
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
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
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
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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
                  <Button>
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

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blog Management</CardTitle>
                    <CardDescription>Manage your blog content</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post: BlogPost) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{post.excerpt}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-sm text-gray-500">{post.category}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.created_at || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
    </div>
  );
}