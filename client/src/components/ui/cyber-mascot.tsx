import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, Lock, Unlock, Zap, Bug, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface CyberMascotProps {
  state: 'idle' | 'error' | 'success' | 'warning' | 'loading' | 'scanning';
  message?: string;
  className?: string;
}

export function CyberMascot({ state, message, className = "" }: CyberMascotProps) {
  const [eyeBlink, setEyeBlink] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  // Automatic eye blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Scanning animation for loading state
  useEffect(() => {
    if (state === 'scanning' || state === 'loading') {
      const scanInterval = setInterval(() => {
        setScanLine(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(scanInterval);
    }
  }, [state]);

  const getIcon = () => {
    switch (state) {
      case 'error':
        return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case 'success':
        return <ShieldCheck className="w-8 h-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'loading':
      case 'scanning':
        return <Shield className="w-8 h-8 text-blue-500" />;
      default:
        return <Shield className="w-8 h-8 text-slate-600" />;
    }
  };

  const getMascotAnimation = () => {
    switch (state) {
      case 'error':
        return {
          rotate: [0, -10, 10, -5, 5, 0],
          scale: [1, 0.95, 1.05, 0.98, 1],
          transition: { duration: 0.8, repeat: Infinity, repeatDelay: 2 }
        };
      case 'success':
        return {
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.6, repeat: Infinity, repeatDelay: 3 }
        };
      case 'warning':
        return {
          y: [0, -5, 0],
          transition: { duration: 1, repeat: Infinity }
        };
      case 'loading':
      case 'scanning':
        return {
          rotate: [0, 360],
          transition: { duration: 2, repeat: Infinity, ease: "linear" }
        };
      default:
        return {
          y: [0, -2, 0],
          transition: { duration: 3, repeat: Infinity }
        };
    }
  };

  const getMessageColor = () => {
    switch (state) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'loading':
      case 'scanning':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Mascot Container */}
      <div className="relative">
        {/* Main Mascot Body */}
        <motion.div
          className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-full w-24 h-24 flex items-center justify-center shadow-lg border-2 border-slate-300 dark:border-slate-600"
          {...getMascotAnimation()}
        >
          {/* Scanning Line Effect */}
          {(state === 'scanning' || state === 'loading') && (
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  top: `${scanLine}%`,
                  filter: 'blur(1px)'
                }}
                animate={{
                  top: ['0%', '100%', '0%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          )}

          {/* Main Icon */}
          <motion.div
            animate={state === 'error' ? { 
              scale: [1, 1.1, 1],
              transition: { duration: 0.3, repeat: Infinity, repeatDelay: 1 }
            } : {}}
          >
            {getIcon()}
          </motion.div>

          {/* Eyes */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <motion.div
              className="w-1.5 h-1.5 bg-slate-700 dark:bg-slate-300 rounded-full"
              animate={eyeBlink ? { scaleY: 0.1 } : { scaleY: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-slate-700 dark:bg-slate-300 rounded-full"
              animate={eyeBlink ? { scaleY: 0.1 } : { scaleY: 1 }}
              transition={{ duration: 0.15 }}
            />
          </div>

          {/* Error State Features */}
          {state === 'error' && (
            <>
              {/* Sweat Drop */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  y: [0, 20],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
              {/* Worried Expression */}
              <motion.div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-2 border-t-2 border-red-500 rounded-t-full"
                animate={{
                  scaleX: [1, 0.8, 1]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            </>
          )}

          {/* Success State Features */}
          {state === 'success' && (
            <motion.div
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-green-500 rounded-b-full"
              animate={{
                scaleX: [1, 1.2, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          )}
        </motion.div>

        {/* Floating Elements */}
        <AnimatePresence>
          {state === 'error' && (
            <>
              <motion.div
                className="absolute -top-2 -left-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Bug className="w-4 h-4 text-red-500" />
              </motion.div>
              
              <motion.div
                className="absolute -top-3 -right-1"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, -10, -20]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Zap className="w-3 h-3 text-yellow-500" />
              </motion.div>
            </>
          )}

          {state === 'success' && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${20 + i * 20}%`
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -20]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    repeatDelay: 2
                  }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            className={`text-center text-sm font-medium ${getMessageColor()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              animate={state === 'error' ? {
                x: [0, -2, 2, -1, 1, 0]
              } : {}}
              transition={state === 'error' ? {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              } : {}}
            >
              {message}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Dots */}
      {(state === 'loading' || state === 'scanning') && (
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Error Boundary Component with Mascot
export function CyberErrorBoundary({ 
  error, 
  reset, 
  title = "Oops! Something went wrong",
  className = ""
}: {
  error?: Error;
  reset?: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${className}`}>
      <div className="max-w-md w-full text-center space-y-6">
        <CyberMascot 
          state="error" 
          message="Don't worry, I'm on it!" 
        />
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          
          {error && (
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {error.message || "An unexpected error occurred"}
            </p>
          )}
          
          <div className="space-y-3">
            {reset && (
              <motion.button
                onClick={reset}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
            )}
            
            <motion.button
              onClick={() => window.location.href = '/'}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go Home
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success State Component
export function CyberSuccess({ 
  message = "Success! Everything is secure",
  action,
  actionLabel = "Continue"
}: {
  message?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="text-center space-y-6">
      <CyberMascot state="success" message="Mission accomplished!" />
      
      <div className="space-y-4">
        <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
          {message}
        </p>
        
        {action && (
          <motion.button
            onClick={action}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {actionLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
}

// Loading State Component
export function CyberLoading({ 
  message = "Scanning for threats...",
  state = "scanning"
}: {
  message?: string;
  state?: 'loading' | 'scanning';
}) {
  return (
    <div className="text-center space-y-6">
      <CyberMascot state={state} message="Working on it..." />
      
      <div className="space-y-2">
        <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
          {message}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This won't take long
        </p>
      </div>
    </div>
  );
}