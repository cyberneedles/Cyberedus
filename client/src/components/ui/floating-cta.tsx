import { useState, useEffect } from 'react';
import { Download, MessageCircle, Play, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCTAProps {
  variant?: 'download' | 'quiz' | 'counselor' | 'course';
  text?: string;
  onClick?: () => void;
}

export default function FloatingCTA({ 
  variant = 'download', 
  text,
  onClick 
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIcon = () => {
    switch (variant) {
      case 'download':
        return <Download className="w-4 h-4" />;
      case 'quiz':
        return <Play className="w-4 h-4" />;
      case 'counselor':
        return <MessageCircle className="w-4 h-4" />;
      case 'course':
        return <ArrowRight className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getText = () => {
    if (text) return text;
    
    switch (variant) {
      case 'download':
        return 'Download Syllabus';
      case 'quiz':
        return 'Start Skill Test';
      case 'counselor':
        return 'Talk to Counsellor';
      case 'course':
        return 'Explore Courses';
      default:
        return 'Get Started';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fab-container"
        >
          <button
            onClick={onClick}
            className="fab-premium flex items-center gap-2 group"
          >
            {getIcon()}
            <span className="hidden sm:inline">{getText()}</span>
            <motion.div
              className="w-1 h-1 bg-current rounded-full opacity-60"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}