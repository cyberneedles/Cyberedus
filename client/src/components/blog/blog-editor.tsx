import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost } from "@shared/schema";

export default function BlogEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    featuredImage: "",
    isPublished: false,
    readingTime: 5,
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const categories = ["cybersecurity", "development", "career", "industry"];

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        slug: editingPost.slug,
        content: editingPost.content,
        excerpt: editingPost.excerpt,
        category: editingPost.category,
        featuredImage: editingPost.featuredImage || "",
        isPublished: editingPost.isPublished,
        readingTime: editingPost.readingTime,
      });
    }
  }, [editingPost]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }

    // Estimate reading time based on content length
    if (name === "content") {
      const wordCount = value.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      setFormData(prev => ({
        ...prev,
        readingTime
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const adminUser = localStorage.getItem("admin_user");
      if (!adminUser) {
        throw new Error("Not authenticated");
      }

      const user = JSON.parse(adminUser);
      const postData = {
        ...formData,
        authorId: user.id,
      };

      if (editingPost) {
        await apiRequest("PUT", `/api/blog/${editingPost.id}`, postData);
        toast({
          title: "Post updated",
          description: "Blog post has been updated successfully.",
        });
      } else {
        await apiRequest("POST", "/api/blog", postData);
        toast({
          title: "Post created",
          description: "Blog post has been created successfully.",
        });
      }

      // Reset form
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        category: "",
        featuredImage: "",
        isPublished: false,
        readingTime: 5,
      });
      setEditingPost(null);

      // Refresh blog posts
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    } catch (error) {
      console.error("Failed to save blog post:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      await apiRequest("DELETE", `/api/blog/${postId}`);
      toast({
        title: "Post deleted",
        description: "Blog post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "",
      featuredImage: "",
      isPublished: false,
      readingTime: 5,
    });
  };

  return (
    <Tabs defaultValue="editor" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="editor">
          {editingPost ? "Edit Post" : "New Post"}
        </TabsTrigger>
        <TabsTrigger value="manage">Manage Posts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="editor" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <i className="fas fa-edit mr-2"></i>
                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
              </span>
              {editingPost && (
                <Button variant="outline" onClick={handleCancelEdit}>
                  <i className="fas fa-times mr-2"></i>
                  Cancel Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter blog post title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="auto-generated-from-title"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Write a brief description of the article..."
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="form-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your blog post content here..."
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  className="form-input"
                />
                <p className="text-sm text-muted-foreground">
                  Estimated reading time: {formData.readingTime} min
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isPublished">Publish Status</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    {editingPost ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className={`fas ${editingPost ? "fa-save" : "fa-plus"} mr-2`}></i>
                    {editingPost ? "Update Post" : "Create Post"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="manage" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-list mr-2"></i>
              All Blog Posts
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {blogPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No blog posts found. Create your first post!
                </div>
              ) : (
                blogPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium text-foreground">{post.title}</h4>
                        <Badge 
                          variant={post.isPublished ? "default" : "secondary"}
                        >
                          {post.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {post.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{post.readingTime} min read</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {post.updatedAt !== post.createdAt && (
                          <span>
                            Updated: {new Date(post.updatedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
