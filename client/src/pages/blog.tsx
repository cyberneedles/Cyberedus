import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BlogPost } from "@shared/schema";
import { BackgroundContainer } from "@/components/BackgroundContainer";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const observerRef = useRef<IntersectionObserver>();

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog", { published: true }],
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [blogPosts]);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["cybersecurity", "development", "career", "industry"];
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="spinner w-8 h-8"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <BackgroundContainer>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              CyberEdu Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest trends in cybersecurity, development, and technology education
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
              </div>
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Article</h2>
            </div>
            
            <Card className="blog-card animate-on-scroll max-w-4xl mx-auto">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                  />
                </div>
                <CardContent className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="secondary" className="mr-3 capitalize">
                      {featuredPost.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {featuredPost.readingTime} min read
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors duration-200">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {new Date(featuredPost.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button variant="outline" size="sm">
                        Read More <i className="fas fa-arrow-right ml-2"></i>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-muted-foreground mb-4"></i>
              <h3 className="text-2xl font-bold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Latest Articles</h2>
                <p className="text-muted-foreground">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="blog-card animate-on-scroll">
                    <div>
                      <img 
                        src={post.featuredImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Badge 
                            variant={post.category === "cybersecurity" ? "default" : 
                                   post.category === "development" ? "secondary" : 
                                   post.category === "career" ? "outline" : "destructive"} 
                            className="mr-3 capitalize"
                          >
                            {post.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {post.readingTime} min read
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors duration-200">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-secondary">
                              Read More <i className="fas fa-arrow-right ml-1"></i>
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Explore by Category</h2>
            <p className="text-xl text-muted-foreground">Find articles that match your interests</p>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {categories.map((category) => {
              const categoryPosts = blogPosts.filter(post => post.category === category);
              const categoryIcons = {
                cybersecurity: "fas fa-shield-alt",
                development: "fas fa-code",
                career: "fas fa-briefcase",
                industry: "fas fa-industry"
              };
              
              return (
                <Card key={category} className="hover-lift animate-on-scroll cursor-pointer" onClick={() => setCategoryFilter(category)}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className={`${categoryIcons[category as keyof typeof categoryIcons]} text-3xl text-primary`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 capitalize">{category}</h3>
                    <p className="text-muted-foreground mb-4">
                      {categoryPosts.length} article{categoryPosts.length !== 1 ? 's' : ''}
                    </p>
                    <Button variant="outline" size="sm">
                      Explore {category}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-foreground mb-6">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get the latest articles and industry insights delivered straight to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="form-input flex-1"
            />
            <Button className="btn-primary">
              <i className="fas fa-envelope mr-2"></i>Subscribe
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No spam, unsubscribe at any time
          </p>
        </div>
      </section>

      <Footer />
    </BackgroundContainer>
  );
}
