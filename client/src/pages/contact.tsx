import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/forms/contact-form";
import { useQuery } from "@tanstack/react-query";
import { FAQ } from "@shared/schema";
import { BackgroundContainer } from "@/components/BackgroundContainer";

export default function Contact() {
  const observerRef = useRef<IntersectionObserver>();

  const { data: faqs = [] } = useQuery<FAQ[]>({
    queryKey: ["/api/faqs", { active: true }],
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

  return (
    <BackgroundContainer>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to start your journey? We're here to help you every step of the way
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-on-scroll">
              <ContactForm />
            </div>
            
            {/* Contact Info & Map */}
            <div className="space-y-8 animate-on-scroll">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-info-circle text-primary mr-3"></i>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Address</h4>
                      <p className="text-muted-foreground">
                        CyberEdu Institute<br />
                        Pune, Maharashtra 411001<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-phone text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                      <p className="text-muted-foreground">+91 87654 32109</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-envelope text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">info@cyberedus.com</p>
                      <p className="text-muted-foreground">admissions@cyberedus.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <i className="fas fa-clock text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Office Hours</h4>
                      <p className="text-muted-foreground">Mon - Sat: 9:00 AM - 7:00 PM</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Google Maps Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-map text-primary mr-3"></i>
                    Visit Our Campus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-map text-4xl text-muted-foreground mb-2"></i>
                      <p className="text-muted-foreground font-medium">Interactive Google Maps</p>
                      <p className="text-sm text-muted-foreground">Pune, Maharashtra</p>
                      <Button variant="outline" className="mt-4">
                        <i className="fas fa-external-link-alt mr-2"></i>
                        Open in Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-share-alt text-primary mr-3"></i>
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200"
                    >
                      <i className="fab fa-facebook-f text-blue-600"></i>
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200"
                    >
                      <i className="fab fa-twitter text-blue-500"></i>
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200"
                    >
                      <i className="fab fa-linkedin-in text-blue-700"></i>
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors duration-200"
                    >
                      <i className="fab fa-instagram text-pink-600"></i>
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                    >
                      <i className="fab fa-youtube text-red-600"></i>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Get answers to common questions about our courses and programs</p>
          </div>
          
          <div className="animate-on-scroll">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-card rounded-lg border border-border">
                  <AccordionItem value={faq.id.toString()} className="border-none">
                    <AccordionTrigger className="faq-toggle text-left px-6 py-4 hover:no-underline">
                      <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="faq-content px-6 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Additional Contact Options */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-foreground mb-4">Other Ways to Connect</h2>
            <p className="text-xl text-muted-foreground">Choose the option that works best for you</p>
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            <Card className="hover-lift animate-on-scroll text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fab fa-whatsapp text-3xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">WhatsApp</h3>
                <p className="text-muted-foreground mb-6">
                  Quick questions? Chat with us on WhatsApp for instant responses.
                </p>
                <Button className="btn-primary w-full">
                  <i className="fab fa-whatsapp mr-2"></i>
                  Chat Now
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover-lift animate-on-scroll text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-video text-3xl text-blue-600"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Video Call</h3>
                <p className="text-muted-foreground mb-6">
                  Schedule a personalized video consultation with our experts.
                </p>
                <Button className="btn-secondary w-full">
                  <i className="fas fa-video mr-2"></i>
                  Book a Call
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover-lift animate-on-scroll text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-users text-3xl text-purple-600"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Visit Us</h3>
                <p className="text-muted-foreground mb-6">
                  Come say hello! Our team is ready to welcome you at our campus.
                </p>
                <Button className="btn-outline w-full">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </a>

      <Footer />
    </BackgroundContainer>
  );
}
