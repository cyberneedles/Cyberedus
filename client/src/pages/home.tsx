import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LeadForm from "@/components/forms/lead-form";
import QuizComponent from "@/components/quiz/quiz-component";
import { trackEvent } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { Course, Testimonial } from "@shared/schema";
import { useEffect, useRef, useState } from "react";
import { useMouseParallax, useParallax } from "@/hooks/use-parallax";
import { ScrollReveal, StaggerReveal } from "@/hooks/use-scroll-reveal";

export default function Home() {
  const observerRef = useRef<IntersectionObserver>();
  const { mousePosition } = useMouseParallax();
  const parallaxData = useParallax();
  
  // Dynamic background mood generator with performance optimization
  const [backgroundMood, setBackgroundMood] = useState('calm');
  const [userInteractionCount, setUserInteractionCount] = useState(0);
  const [performanceMode, setPerformanceMode] = useState('high');
  const lastInteractionTime = useRef(Date.now());
  const frameRate = useRef(60);

  // Intelligent scroll animation system
  useEffect(() => {
    let scrollDirection = 'down';
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;
    
    // Track scroll behavior
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      scrollSpeed = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intelligent animation observer
    const elements = document.querySelectorAll('.intelligent-animate, .scroll-animate');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const delay = parseInt(element.dataset.delay || '0');
            const animation = element.dataset.animation || 'fade-up';
            
            // Intelligent animation selection based on element position and scroll behavior
            let intelligentAnimation = animation;
            const rect = element.getBoundingClientRect();
            const isLeft = rect.left < window.innerWidth / 3;
            const isRight = rect.right > (window.innerWidth * 2) / 3;
            
            // Apply intelligent animation logic
            if (element.classList.contains('intelligent-animate')) {
              if (isLeft && scrollDirection === 'down') {
                intelligentAnimation = 'slide-left';
              } else if (isRight && scrollDirection === 'down') {
                intelligentAnimation = 'slide-right';
              } else if (scrollSpeed > 5) {
                intelligentAnimation = 'glow-in';
              } else {
                intelligentAnimation = 'fade-up';
              }
            }
            
            setTimeout(() => {
              element.classList.remove('scroll-hidden');
              element.classList.add('scroll-visible', `animate-${intelligentAnimation}`);
              
              // Add intelligent completion callback
              const handleAnimationEnd = () => {
                element.style.transform = 'none';
                element.style.opacity = '1';
                element.removeEventListener('animationend', handleAnimationEnd);
              };
              element.addEventListener('animationend', handleAnimationEnd);
            }, delay);
            
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    elements.forEach((element) => {
      element.classList.add('scroll-hidden');
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamic mood generator based on user interaction
  useEffect(() => {
    const handleUserInteraction = (e: Event) => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteractionTime.current;
      
      setUserInteractionCount(prev => prev + 1);
      lastInteractionTime.current = now;

      // Determine mood based on interaction patterns
      if (timeSinceLastInteraction < 1000) {
        // Rapid interactions - energetic mood
        setBackgroundMood('energetic');
      } else if (e.type === 'click' || e.type === 'touchstart') {
        // Deliberate clicks - focused mood
        setBackgroundMood('focused');
      } else if (e.type === 'mousemove') {
        // Mouse movement - interactive mood
        setBackgroundMood('interactive');
      }

      // Reset to calm after 5 seconds of no interaction
      setTimeout(() => {
        const currentTime = Date.now();
        if (currentTime - lastInteractionTime.current >= 4800) {
          setBackgroundMood('calm');
        }
      }, 5000);
    };

    // Add interaction listeners
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Performance monitoring and optimization
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const performanceMonitor = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        frameRate.current = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Adaptive performance optimization
        if (frameRate.current < 30) {
          setPerformanceMode('low');
        } else if (frameRate.current < 45) {
          setPerformanceMode('medium');
        } else {
          setPerformanceMode('high');
        }
      }
      
      requestAnimationFrame(performanceMonitor);
    };
    
    // Device capability detection
    const detectDeviceCapability = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEnd = navigator.hardwareConcurrency <= 2;
      const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (isMobile || isLowEnd || hasReducedMotion) {
        setPerformanceMode('low');
      }
    };
    
    detectDeviceCapability();
    requestAnimationFrame(performanceMonitor);
    
    return () => {
      // Cleanup handled by requestAnimationFrame
    };
  }, []);
  
  // Enhanced parallax tracking for different layers
  const [parallaxLayers, setParallaxLayers] = useState({
    background: { x: 0, y: 0 },
    midground: { x: 0, y: 0 },
    foreground: { x: 0, y: 0 },
    floating: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const normalizedX = (clientX - centerX) / centerX;
      const normalizedY = (clientY - centerY) / centerY;
      
      setParallaxLayers({
        background: { x: normalizedX * 15, y: normalizedY * 15 },
        midground: { x: normalizedX * 30, y: normalizedY * 30 },
        foreground: { x: normalizedX * 45, y: normalizedY * 45 },
        floating: { x: normalizedX * 60, y: normalizedY * 60 }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials", { approved: true }],
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
  }, []);

  const handleCTAClick = (ctaType: string) => {
    trackEvent("cta_click", "engagement", ctaType);
  };

  // Get scroll position
  const scrollY = parallaxData.offset;
  
  // Clean icon mapping function
  const getCleanIcon = (course: any) => {
    if (course.title.includes('Ethical Hacker') || course.title.includes('Cybersecurity')) return '🔒';
    if (course.title.includes('Bug Bounty')) return '🔍';
    if (course.title.includes('Java')) return '☕';
    if (course.title.includes('Python')) return '🐍';
    if (course.title.includes('Interview') || course.title.includes('Career')) return '🎯';
    if (course.category === 'cybersecurity') return '🛡️';
    if (course.category === 'development') return '💻';
    if (course.category === 'career') return '📈';
    return '📚';
  };
  
  const featuredCourses = courses.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <div className={`relative overflow-hidden mood-${backgroundMood} performance-${performanceMode}`} style={{ minHeight: '100vh' }}>
      {/* Ultimate Responsive Background with Dynamic Mood - Performance Optimized */}
      <div className="ultimate-homepage-bg">
        <div className="mesh-gradient"></div>
        {performanceMode !== 'low' && (
          <>
            <div className="gradient-orb gradient-orb-1"></div>
            <div className="gradient-orb gradient-orb-2"></div>
            <div className="gradient-orb gradient-orb-3"></div>
          </>
        )}
        {performanceMode === 'high' && (
          <>
            <div className="gradient-orb gradient-orb-4"></div>
            <div className="gradient-orb gradient-orb-5"></div>
            <div className="gradient-orb gradient-orb-6"></div>
            <div className="gradient-orb gradient-orb-7"></div>
            <div className="gradient-orb gradient-orb-8"></div>
          </>
        )}
        {performanceMode === 'medium' && (
          <>
            <div className="gradient-orb gradient-orb-4"></div>
            <div className="gradient-orb gradient-orb-5"></div>
          </>
        )}
      </div>
      
      <Header />
      
      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50/50 via-white to-slate-100/30 dark:from-slate-900/30 dark:via-slate-800/20 dark:to-slate-900/40">
        {/* Clean Natural Bubbles Background */}
        <div className="bubble-lg" style={{ top: '8%', left: '5%', animationDelay: '0s' }}></div>
        <div className="bubble-md" style={{ top: '20%', right: '12%', animationDelay: '3s' }}></div>
        <div className="bubble-sm" style={{ top: '35%', left: '8%', animationDelay: '6s' }}></div>
        <div className="bubble-lg" style={{ top: '55%', right: '20%', animationDelay: '2s' }}></div>
        <div className="bubble-md" style={{ bottom: '25%', left: '15%', animationDelay: '8s' }}></div>
        <div className="bubble-sm" style={{ bottom: '40%', right: '8%', animationDelay: '4s' }}></div>
        <div className="bubble-md" style={{ top: '75%', left: '25%', animationDelay: '10s' }}></div>
        <div className="bubble-lg" style={{ bottom: '15%', right: '30%', animationDelay: '5s' }}></div>
        <div className="bubble-sm" style={{ top: '65%', right: '35%', animationDelay: '7s' }}></div>
        <div className="bubble-md" style={{ top: '45%', left: '35%', animationDelay: '12s' }}></div>
        

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-foreground">
                <span className="block mb-4">Master</span>
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-300 dark:to-cyan-300 bg-clip-text text-transparent font-extrabold">Cybersecurity</span>
              </h1>
              <p className="text-2xl text-muted-foreground mb-10 leading-relaxed">
                Professional cybersecurity and development training with 
                <span className="text-foreground font-medium">hands-on experience</span> and 
                <span className="text-foreground font-medium">industry certification</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Button 
                  className="btn-primary text-lg px-10 py-4"
                  onClick={() => handleCTAClick("get_demo")}
                >
                  Start Learning
                </Button>
                <Button 
                  className="bg-white hover:bg-black text-black hover:text-white border border-slate-300 hover:border-black text-lg px-10 py-4 transition-all duration-300"
                  onClick={() => handleCTAClick("connect_counsellor")}
                >
                  Schedule Consultation
                </Button>
              </div>
              
              {/* Compact Rectangle Stats with Intelligent Animation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <div className="text-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 intelligent-animate animate-gentle-bounce" data-animation="balloon-float" data-delay="800" style={{animationDelay: '0.2s'}}>
                  <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-b from-slate-600 to-slate-300 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
                    1200+
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Students<br/>Trained</div>
                </div>
                <div className="text-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 intelligent-animate animate-gentle-bounce" data-animation="glow-in" data-delay="950" style={{animationDelay: '0.4s'}}>
                  <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-b from-slate-600 to-slate-300 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
                    95%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Placement Rate</div>
                </div>
                <div className="text-center p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 intelligent-animate animate-gentle-bounce" data-animation="scale-in" data-delay="1100" style={{animationDelay: '0.6s'}}>
                  <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-b from-slate-600 to-slate-300 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
                    40+
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Industry<br/>Partners</div>
                </div>
              </div>
            </div>
            
            <div 
              className="mt-16 lg:mt-0 relative transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${parallaxLayers.midground.x * 0.5}px, ${parallaxLayers.midground.y * 0.5}px, 0) rotateY(${parallaxLayers.midground.x * 0.02}deg)`
              }}
            >
              <div className="relative border border-border rounded-lg p-8 card-professional">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                  alt="Cybersecurity expert working with advanced security systems" 
                  className="rounded-lg w-full h-auto transition-transform duration-500"
                  style={{
                    transform: `scale(${1 + Math.abs(parallaxLayers.foreground.x) * 0.001})`
                  }}
                />
                {/* InfoSec Terminal Overlay with Parallax */}
                <div 
                  className="absolute top-12 left-12 bg-black/80 rounded p-2 text-success font-mono text-xs opacity-80 transition-transform duration-300"
                  style={{
                    transform: `translate3d(${parallaxLayers.floating.x * 0.3}px, ${parallaxLayers.floating.y * 0.3}px, 0)`
                  }}
                >
                  <div>root@infosec:~$ nmap -sS target</div>
                  <div className="text-red-400">[!] Vulnerabilities found</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </section>

      {/* Enhanced Course Carousel with Fade Effects */}
      <section className="py-20 relative overflow-hidden">
        {/* Sliding Curve Background */}
        <div className="sliding-curve"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 intelligent-animate" data-animation="fade-up" data-delay="200">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Our Popular Courses
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Discover industry-leading courses designed to accelerate your career
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-xl">
            {/* Fade overlays for sides */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
            
            {/* Continuous Scroll Container */}
            <div 
              className="flex gap-6 py-8"
              style={{ 
                width: 'calc(200% + 48px)',
                animation: 'scroll-left 45s linear infinite'
              }}
            >
              {/* First set of courses */}
            {courses.map((course, index) => (
              <Card 
                key={`first-${course.id}`}
                className="border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 min-w-[350px] max-w-[350px] flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header with Icon and Level */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 text-center">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-3xl">{getCleanIcon(course)}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">
                      {course.title}
                    </h3>
                    
                    <div className={`text-xs font-semibold mb-3 px-4 py-2 rounded-full inline-block shadow-sm ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      course.level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Enhanced Progress Bar */}
                    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 shadow-inner">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                          course.level === 'beginner' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          course.level === 'intermediate' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          'bg-gradient-to-r from-purple-400 to-purple-600'
                        }`}
                        style={{ width: `${75 + (index * 3)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                    
                    {/* Enhanced Course Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {course.features.slice(0, 2).map((feature, idx) => (
                          <div 
                            key={idx}
                            className="text-xs bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg inline-block mx-1 shadow-sm border border-slate-200/50 dark:border-slate-600/50"
                          >
                            ✓ {feature}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Duration with Icon */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">🕐</span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {courses.map((course, index) => (
              <Card 
                key={`second-${course.id}`}
                className="border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 min-w-[350px] max-w-[350px] flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header with Icon and Level */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 text-center">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-3xl">{getCleanIcon(course)}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100">
                      {course.title}
                    </h3>
                    
                    <div className={`text-xs font-semibold mb-3 px-4 py-2 rounded-full inline-block shadow-sm ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      course.level === 'intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Enhanced Progress Bar */}
                    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 shadow-inner">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                          course.level === 'beginner' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          course.level === 'intermediate' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          'bg-gradient-to-r from-purple-400 to-purple-600'
                        }`}
                        style={{ width: `${75 + (index * 3)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                    
                    {/* Enhanced Course Features */}
                    {course.features && course.features.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {course.features.slice(0, 2).map((feature, idx) => (
                          <div 
                            key={idx}
                            className="text-xs bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg inline-block mx-1 shadow-sm border border-slate-200/50 dark:border-slate-600/50"
                          >
                            ✓ {feature}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Duration with Icon */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">🕐</span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>

          {/* Explore Courses Button */}
          <div className="text-center mt-12 intelligent-animate" data-animation="glow-in" data-delay="600">
            <Button 
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleCTAClick('explore_courses')}
            >
              Explore All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Test Your Knowledge with Parallax */}
      <section className="py-20 bg-muted/50 relative overflow-hidden">
        {/* Floating Parallax Elements */}
        <div 
          className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.background.x * 0.8}px, ${parallaxLayers.background.y * 0.8}px, 0)`
          }}
        ></div>
        <div 
          className="absolute top-32 right-20 w-16 h-16 bg-accent/10 rounded-full transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.midground.x * -0.6}px, ${parallaxLayers.midground.y * 0.6}px, 0)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-32 w-12 h-12 bg-success/10 rounded-full transition-transform duration-400 ease-out"
          style={{
            transform: `translate3d(${parallaxLayers.floating.x * 0.4}px, ${parallaxLayers.floating.y * -0.4}px, 0)`
          }}
        ></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 
            className="text-4xl font-bold text-foreground mb-4 transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${parallaxLayers.midground.x * 0.1}px, ${parallaxLayers.midground.y * 0.1}px, 0)`
            }}
          >
            Test Your Knowledge
          </h2>
          <p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-transform duration-400 ease-out"
            style={{
              transform: `translate3d(${parallaxLayers.foreground.x * 0.05}px, ${parallaxLayers.foreground.y * 0.05}px, 0)`
            }}
          >
            Take our quick assessment to see which course is perfect for you
          </p>
          <div
            className="transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallaxLayers.background.x * 0.2}px, ${parallaxLayers.background.y * 0.2}px, 0) scale(${1 + Math.abs(parallaxLayers.midground.y) * 0.0003})`
            }}
          >
            <QuizComponent />
          </div>
        </div>
      </section>

      {/* Why Choose Master in InfoSec - Professional Version */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Minimalist Neutral Bubbles */}
        <div className="bubble-lg" style={{ top: '12%', left: '8%', animationDelay: '0s' }}></div>
        <div className="bubble-md" style={{ top: '30%', right: '20%', animationDelay: '3s' }}></div>
        <div className="bubble-sm" style={{ bottom: '25%', left: '25%', animationDelay: '6s' }}></div>
        <div className="bubble-md" style={{ bottom: '40%', right: '10%', animationDelay: '2s' }}></div>
        <div className="bubble-sm" style={{ top: '50%', left: '15%', animationDelay: '4s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20 intelligent-animate" data-animation="fade-up" data-delay="200">
            <div className="inline-block p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 animate-bounce">
              <svg className="w-8 h-8 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 
              className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 transition-all duration-500 ease-out"
              style={{
                transform: `translate3d(${parallaxLayers.foreground.x * 0.02}px, ${parallaxLayers.foreground.y * 0.02}px, 0)`
              }}
            >
              Why Choose Master in InfoSec?
            </h2>
            <p 
              className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed transition-all duration-600 ease-out"
              style={{
                transform: `translate3d(${parallaxLayers.midground.x * 0.01}px, ${parallaxLayers.midground.y * 0.01}px, 0)`
              }}
            >
              What makes us different from other institutes
            </p>
          </div>

          {/* Professional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - Practical Approach */}
            <div 
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 intelligent-animate"
              data-animation="slide-left"
              data-delay="400"
              style={{
                transform: `translate3d(${parallaxLayers.floating.x * 0.05}px, ${parallaxLayers.floating.y * 0.05}px, 0)`,
                animationDelay: '0.1s'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                  80% Practical Approach
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center text-sm">
                  Unlike traditional institutes, 80% of our curriculum is hands-on practice with real projects and industry tools.
                </p>
              </div>
            </div>

            {/* Feature 2 - Industry Projects */}
            <div 
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 scroll-animate"
              data-animation="slide-up"
              data-delay="550"
              style={{
                transform: `translate3d(${parallaxLayers.background.x * 0.04}px, ${parallaxLayers.background.y * 0.04}px, 0)`,
                animationDelay: '0.2s'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                  Real Industry Projects
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center text-sm">
                  Work on actual client projects and build a portfolio that impresses employers from day one.
                </p>
              </div>
            </div>

            {/* Feature 3 - Mentorship */}
            <div 
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 scroll-animate"
              data-animation="slide-up"
              data-delay="700"
              style={{
                transform: `translate3d(${parallaxLayers.midground.x * 0.03}px, ${parallaxLayers.midground.y * 0.03}px, 0)`,
                animationDelay: '0.3s'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                  Industry Mentorship
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center text-sm">
                  Learn directly from industry professionals currently working in top companies.
                </p>
              </div>
            </div>

            {/* Feature 4 - Placement Support */}
            <div 
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 scroll-animate"
              data-animation="slide-up"
              data-delay="850"
              style={{
                transform: `translate3d(${parallaxLayers.foreground.x * 0.02}px, ${parallaxLayers.foreground.y * 0.02}px, 0)`,
                animationDelay: '0.4s'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                  Placement Support
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center text-sm">
                  Comprehensive placement assistance including resume building, interview prep, and direct company connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have transformed their careers with our hands-on approach
            </p>
            <LeadForm 
              source="homepage_cta"
              buttonText="Get Started Today"
              title="Get Your Free Career Consultation"
            />
          </div>
        </div>
      </section>

      {/* Enhanced WhatsApp Float Button with Parallax */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallaxLayers.floating.x * 0.3}px, ${parallaxLayers.floating.y * 0.3}px, 0) scale(${1 + Math.abs(parallaxLayers.floating.x) * 0.0008})`
        }}
        onClick={() => trackEvent("whatsapp_click", "contact", "float_button")}
      >
        <span className="text-2xl">💬</span>
      </a>

      {/* Premium Floating Parallax Decorative Elements */}
      <div 
        className="fixed top-20 right-10 w-6 h-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-sm pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{
          transform: `translate3d(${parallaxLayers.background.x * 1.2}px, ${parallaxLayers.background.y * 1.2}px, 0)`
        }}
      ></div>
      <div 
        className="fixed bottom-40 left-20 w-8 h-8 bg-gradient-to-r from-success/15 to-info/15 rounded-full blur-sm pointer-events-none transition-transform duration-500 ease-out z-0"
        style={{
          transform: `translate3d(${parallaxLayers.midground.x * -0.8}px, ${parallaxLayers.midground.y * 0.8}px, 0)`
        }}
      ></div>
      <div 
        className="fixed top-1/2 right-32 w-4 h-4 bg-gradient-to-r from-warning/20 to-electric/20 rounded-full blur-sm pointer-events-none transition-transform duration-600 ease-out z-0"
        style={{
          transform: `translate3d(${parallaxLayers.foreground.x * 0.9}px, ${parallaxLayers.foreground.y * -0.7}px, 0)`
        }}
      ></div>

      <Footer />
    </div>
  );
}
