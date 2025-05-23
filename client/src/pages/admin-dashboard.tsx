import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BlogEditor from "@/components/blog/blog-editor";
import { Lead, BlogPost, Testimonial } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem("admin_user");
    if (!adminUser) {
      setLocation("/cyberedus-agent");
      return;
    }
    setUser(JSON.parse(adminUser));
  }, [setLocation]);

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    setLocation("/cyberedus-agent");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  const recentLeads = leads.slice(0, 10);
  const publishedPosts = blogPosts.filter(post => post.isPublished);
  const draftPosts = blogPosts.filter(post => !post.isPublished);
  const pendingTestimonials = testimonials.filter(t => !t.isApproved);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-shield-alt text-primary"></i>
              </div>
              <h1 className="text-xl font-bold text-foreground">CyberEdu Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-primary"></i>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published Posts</p>
                  <p className="text-2xl font-bold text-foreground">{publishedPosts.length}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-blog text-accent"></i>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Draft Posts</p>
                  <p className="text-2xl font-bold text-foreground">{draftPosts.length}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-edit text-secondary"></i>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold text-foreground">{pendingTestimonials.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-orange-600"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="blog">Blog Management</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-users mr-2"></i>
                  Recent Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No leads found
                    </div>
                  ) : (
                    recentLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-medium text-foreground">{lead.name}</h4>
                              <p className="text-sm text-muted-foreground">{lead.email}</p>
                            </div>
                            <div>
                              <Badge variant="outline">{lead.source}</Badge>
                            </div>
                            {lead.courseInterest && (
                              <div>
                                <Badge variant="secondary">{lead.courseInterest}</Badge>
                              </div>
                            )}
                          </div>
                          {lead.message && (
                            <p className="text-sm text-muted-foreground mt-2">{lead.message}</p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="blog" className="mt-6">
            <BlogEditor />
          </TabsContent>
          
          <TabsContent value="testimonials" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-star mr-2"></i>
                  Testimonials Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No testimonials found
                    </div>
                  ) : (
                    testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{testimonial.courseName}</p>
                            </div>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                              ))}
                            </div>
                          </div>
                          <Badge variant={testimonial.isApproved ? "default" : "destructive"}>
                            {testimonial.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{testimonial.review}</p>
                        {testimonial.company && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {testimonial.jobTitle} at {testimonial.company}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["contact_form", "quiz", "syllabus_download", "homepage_cta"].map((source) => {
                      const sourceLeads = leads.filter(lead => lead.source === source);
                      const percentage = leads.length > 0 ? (sourceLeads.length / leads.length) * 100 : 0;
                      
                      return (
                        <div key={source} className="flex items-center justify-between">
                          <span className="capitalize text-foreground">{source.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {sourceLeads.length} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <i className="fas fa-user text-primary mr-3"></i>
                      <span>{leads.length} total leads generated</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <i className="fas fa-blog text-accent mr-3"></i>
                      <span>{publishedPosts.length} blog posts published</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <i className="fas fa-star text-yellow-500 mr-3"></i>
                      <span>{testimonials.filter(t => t.isApproved).length} testimonials approved</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
