import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Zap, Bug, Search, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface AnimatedLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  variant?: 'default' | 'course' | 'security' | 'analysis' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedLoading({ 
  isLoading, 
  loadingText = "Loading...", 
  variant = 'default',
  size = 'md'
}: AnimatedLoadingProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  // Cybersecurity loading phases
  const securityPhases = [
    { icon: Shield, text: "Initializing security protocols...", color: "text-blue-400" },
    { icon: Search, text: "Scanning for vulnerabilities...", color: "text-yellow-400" },
    { icon: Lock, text: "Encrypting data streams...", color: "text-green-400" },
    { icon: CheckCircle, text: "Security check complete!", color: "text-emerald-400" }
  ];

  const coursePhases = [
    { icon: Shield, text: "Preparing course materials...", color: "text-blue-400" },
    { icon: Zap, text: "Loading interactive content...", color: "text-purple-400" },
    { icon: CheckCircle, text: "Course ready!", color: "text-green-400" }
  ];

  const analysisPhases = [
    { icon: Search, text: "Analyzing threat patterns...", color: "text-red-400" },
    { icon: Bug, text: "Detecting anomalies...", color: "text-orange-400" },
    { icon: Shield, text: "Generating security report...", color: "text-blue-400" }
  ];

  const getPhases = () => {
    switch (variant) {
      case 'course': return coursePhases;
      case 'security': return securityPhases;
      case 'analysis': return analysisPhases;
      default: return securityPhases;
    }
  };

  const phases = getPhases();

  useEffect(() => {
    if (!isLoading) {
      setCurrentPhase(0);
      setScanProgress(0);
      return;
    }

    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => (prev + 1) % 101);
    }, 50);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, phases.length]);

  const sizeClasses = {
    sm: { container: "w-64 h-32", icon: "w-6 h-6", text: "text-sm" },
    md: { container: "w-80 h-40", icon: "w-8 h-8", text: "text-base" },
    lg: { container: "w-96 h-48", icon: "w-10 h-10", text: "text-lg" }
  };

  const currentSize = sizeClasses[size];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            className={`${currentSize.container} bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 
                       border border-blue-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden`}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="border border-blue-400/20"
                    animate={{
                      borderColor: [
                        "rgba(59, 130, 246, 0.1)",
                        "rgba(59, 130, 246, 0.3)",
                        "rgba(59, 130, 246, 0.1)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Mascot animation area */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Rotating security icons */}
              <div className="relative mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  {phases.map((phase, index) => {
                    const IconComponent = phase.icon;
                    const angle = (index * 360) / phases.length;
                    return (
                      <motion.div
                        key={index}
                        className={`absolute ${currentSize.icon} ${
                          index === currentPhase ? phase.color : "text-slate-600"
                        }`}
                        style={{
                          transform: `rotate(${angle}deg) translateY(-24px) rotate(-${angle}deg)`
                        }}
                        animate={{
                          scale: index === currentPhase ? [1, 1.2, 1] : 1,
                          opacity: index === currentPhase ? 1 : 0.3
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent className="w-full h-full" />
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Center mascot */}
                <motion.div
                  className={`${currentSize.icon} text-blue-400 mx-auto`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Shield className="w-full h-full" />
                </motion.div>
              </div>

              {/* Loading text with typewriter effect */}
              <div className={`${currentSize.text} text-center mb-4 h-12 flex items-center justify-center`}>
                <motion.span
                  key={currentPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={phases[currentPhase]?.color || "text-blue-400"}
                >
                  {phases[currentPhase]?.text || loadingText}
                </motion.span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full relative"
                  style={{ width: `${scanProgress}%` }}
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(59, 130, 246, 0.5)",
                      "0 0 20px rgba(59, 130, 246, 0.8)",
                      "0 0 10px rgba(59, 130, 246, 0.5)"
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>

              {/* Progress percentage */}
              <motion.div
                className="text-xs text-slate-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {scanProgress}% Complete
              </motion.div>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    animate={{
                      x: [0, Math.random() * 200 - 100],
                      y: [0, Math.random() * 200 - 100],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick loading button component
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'security' | 'success' | 'danger';
  className?: string;
  disabled?: boolean;
}

export function LoadingButton({ 
  isLoading, 
  children, 
  onClick, 
  variant = 'default',
  className = "",
  disabled = false
}: LoadingButtonProps) {
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    security: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative px-6 py-2 rounded-lg font-medium transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
                 ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-4 h-4" />
            </motion.div>
            <span>Processing...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading shimmer effect */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.button>
  );
}