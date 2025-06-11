import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Target, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sophisticated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      {/* Floating Security Elements */}
      <div className="absolute top-20 left-10 float-sophisticated">
        <div className="text-xs font-mono text-info font-medium px-3 py-1 bg-info/10 rounded-lg border border-info/20 backdrop-blur-sm dopamine-hover">
          $ sudo nmap -sS target.com
        </div>
      </div>
      <div className="absolute top-40 right-20 float-sophisticated" style={{animationDelay: '2s'}}>
        <div className="text-xs font-mono text-warning font-medium px-3 py-1 bg-warning/10 rounded-lg border border-warning/20 backdrop-blur-sm dopamine-hover">
          [+] Vulnerability detected
        </div>
      </div>
      <div className="absolute bottom-32 left-20 float-sophisticated" style={{animationDelay: '4s'}}>
        <div className="text-xs font-mono text-success font-medium px-3 py-1 bg-success/10 rounded-lg border border-success/20 backdrop-blur-sm pulse-glow">
          Firewall: ACTIVE
        </div>
      </div>
      <div className="absolute top-60 right-10 float-sophisticated" style={{animationDelay: '6s'}}>
        <div className="text-xs font-mono text-electric font-medium px-3 py-1 bg-electric/10 rounded-lg border border-electric/20 backdrop-blur-sm dopamine-hover">
          SSH tunnel established
        </div>
      </div>
      <div className="absolute bottom-60 right-32 float-sophisticated" style={{animationDelay: '8s'}}>
        <div className="text-xs font-mono text-neon font-medium px-3 py-1 bg-neon/10 rounded-lg border border-neon/20 backdrop-blur-sm pulse-glow">
          🔐 Encrypted connection
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="stagger-animation">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-info bg-size-200 bg-clip-text text-transparent" style={{
                backgroundSize: '200% 200%',
                animation: 'textShimmer 3s ease-in-out infinite'
              }}>
                Master In Cybersecurity
              </span>
              <br />
              <span className="text-muted-foreground dopamine-hover stagger-animation">Skills That Matter</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed stagger-animation">
              Join thousands of professionals who've accelerated their cybersecurity careers with our hands-on, industry-focused training programs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 stagger-animation">
              <Button size="lg" className="px-8 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground btn-glow dopamine-hover group">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 btn-glow dopamine-hover">
                Schedule Consultation
              </Button>
            </div>
            
            {/* Sophisticated Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="text-center p-6 border border-border rounded-xl card-professional interactive-card bg-gradient-to-br from-card to-secondary/20 backdrop-blur-sm stagger-animation">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 counter-animation bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
                  1200+
                </div>
                <div className="text-sm text-muted-foreground font-medium">Students Trained</div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mt-4"></div>
              </div>
              <div className="text-center p-6 border border-border rounded-xl card-professional interactive-card bg-gradient-to-br from-card to-info/10 backdrop-blur-sm stagger-animation">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 counter-animation bg-gradient-to-r from-info to-electric bg-clip-text text-transparent" style={{animationDelay: '0.2s'}}>
                  95%
                </div>
                <div className="text-sm text-muted-foreground font-medium">Placement Rate</div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-info/30 to-transparent mt-4"></div>
              </div>
              <div className="text-center p-6 border border-border rounded-xl card-professional interactive-card bg-gradient-to-br from-card to-warning/10 backdrop-blur-sm stagger-animation">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 counter-animation bg-gradient-to-r from-warning to-glow bg-clip-text text-transparent" style={{animationDelay: '0.4s'}}>
                  40+
                </div>
                <div className="text-sm text-muted-foreground font-medium">Industry Partners</div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-warning/30 to-transparent mt-4"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 lg:mt-0 relative stagger-animation">
            <div className="relative border border-border rounded-xl p-8 card-professional interactive-card bg-gradient-to-br from-card to-secondary/10 backdrop-blur-sm">
              <div className="absolute top-4 right-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full pulse-glow"></div>
                  <div className="w-3 h-3 bg-success rounded-full pulse-glow" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-3 h-3 bg-info rounded-full pulse-glow" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3 dopamine-hover">
                  <Shield className="h-6 w-6 text-accent" />
                  <span className="text-lg font-semibold text-foreground">Hands-on Penetration Testing</span>
                </div>
                <div className="flex items-center space-x-3 dopamine-hover">
                  <Target className="h-6 w-6 text-info" />
                  <span className="text-lg font-semibold text-foreground">Real-world Scenarios</span>
                </div>
                <div className="flex items-center space-x-3 dopamine-hover">
                  <Users className="h-6 w-6 text-warning" />
                  <span className="text-lg font-semibold text-foreground">Expert Mentorship</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="text-sm text-accent font-medium mb-2">Next Batch Starting</div>
                <div className="text-2xl font-bold text-foreground">March 15, 2024</div>
                <div className="text-sm text-muted-foreground mt-1">Limited seats available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}