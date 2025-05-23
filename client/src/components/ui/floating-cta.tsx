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
          <motion.button
            onClick={onClick}
            className="btn-premium flex items-center gap-3 group shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {getIcon()}
            </motion.div>
            <span className="hidden sm:inline font-semibold">{getText()}</span>
            <motion.div
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}