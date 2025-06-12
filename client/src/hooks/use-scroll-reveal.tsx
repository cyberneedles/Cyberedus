import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref, isVisible };
}

// Component wrapper for scroll reveals
interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'slide-left' | 'slide-right' | 'scale' | 'default';
  delay?: number;
  className?: string;
  threshold?: number;
}

export function ScrollReveal({ 
  children, 
  animation = 'default', 
  delay = 0,
  className = '',
  threshold = 0.1 
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ 
    delay, 
    threshold,
    triggerOnce: true 
  });

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up':
        return 'reveal-fade-up';
      case 'slide-left':
        return 'reveal-slide-left';
      case 'slide-right':
        return 'reveal-slide-right';
      case 'scale':
        return 'reveal-scale';
      default:
        return 'reveal-on-scroll';
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${isVisible ? 'revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// Staggered reveal for multiple items
interface StaggerRevealProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggerReveal({ 
  children, 
  staggerDelay = 100,
  className = '' 
}: StaggerRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`reveal-stagger ${isVisible ? 'revealed' : ''}`}
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}