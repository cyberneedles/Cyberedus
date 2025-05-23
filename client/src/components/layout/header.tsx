import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/ui/theme-provider";
import { trackEvent } from "@/lib/analytics";

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDemoClick = () => {
    trackEvent("demo_click", "header", "get_demo");
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    trackEvent("theme_toggle", "ui", theme === "dark" ? "light" : "dark");
  };

  const isActivePath = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-background/95 backdrop-blur-sm shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shield-alt text-primary"></i>
                </div>
                <h1 className="text-2xl font-bold text-foreground">CyberEdu</h1>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={`nav-link ${isActivePath(item.href) ? "active" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleThemeToggle}
              className="w-9 h-9 p-0"
            >
              <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} text-foreground`}></i>
            </Button>
            
            {/* Demo CTA */}
            <Button 
              onClick={handleDemoClick}
              className="btn-primary hidden sm:inline-flex"
            >
              Get Demo
            </Button>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                    <i className="fas fa-bars text-foreground"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <div 
                          className={`block px-3 py-2 text-lg font-medium transition-colors duration-200 ${
                            isActivePath(item.href) 
                              ? "text-primary bg-primary/10 rounded-lg" 
                              : "text-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </div>
                      </Link>
                    ))}
                    
                    <div className="pt-4 border-t border-border">
                      <Button 
                        onClick={() => {
                          handleDemoClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full btn-primary"
                      >
                        Get Demo
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
