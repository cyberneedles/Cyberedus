import { useState } from "react";
import { CyberMascot, CyberErrorBoundary, CyberSuccess, CyberLoading } from "@/components/ui/cyber-mascot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MascotDemo() {
  const [currentState, setCurrentState] = useState<'idle' | 'error' | 'success' | 'warning' | 'loading' | 'scanning'>('idle');
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);

  const states = [
    { key: 'idle', label: 'Idle', description: 'Peaceful state with gentle breathing animation' },
    { key: 'error', label: 'Error', description: 'Shaking animation with worried expression and floating bugs' },
    { key: 'success', label: 'Success', description: 'Happy bounce with smile and floating particles' },
    { key: 'warning', label: 'Warning', description: 'Gentle bounce to get attention' },
    { key: 'loading', label: 'Loading', description: 'Spinning animation with loading dots' },
    { key: 'scanning', label: 'Scanning', description: 'Scanning line effect with rotation' }
  ] as const;

  if (showErrorBoundary) {
    return (
      <CyberErrorBoundary
        error={new Error("This is a demo error to show the mascot in action!")}
        reset={() => setShowErrorBoundary(false)}
        title="Demo Error State"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            CyberSecurity Mascot Demo
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Experience playful error state animations and interactive cybersecurity companion
          </p>
        </motion.div>

        {/* Main Demo Area */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mascot Display */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle>Interactive Mascot</CardTitle>
              <CardDescription>
                Current State: <span className="font-semibold text-blue-600 dark:text-blue-400">{currentState}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-8 w-full flex justify-center">
                <CyberMascot 
                  state={currentState}
                  message={`I'm in ${currentState} mode!`}
                />
              </div>

              {/* State Description */}
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {states.find(s => s.key === currentState)?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>State Controls</CardTitle>
              <CardDescription>
                Click any state to see the mascot's animation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {states.map((state) => (
                  <Button
                    key={state.key}
                    onClick={() => setCurrentState(state.key as any)}
                    variant={currentState === state.key ? "default" : "outline"}
                    className={`w-full transition-all duration-200 ${
                      currentState === state.key 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {state.label}
                  </Button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  onClick={() => setShowErrorBoundary(true)}
                  variant="destructive"
                  className="w-full"
                >
                  Show Error Boundary Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Loading Demo */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Loading State</CardTitle>
            </CardHeader>
            <CardContent>
              <CyberLoading message="Processing security scan..." />
            </CardContent>
          </Card>

          {/* Success Demo */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Success State</CardTitle>
            </CardHeader>
            <CardContent>
              <CyberSuccess 
                message="Security check passed!"
                action={() => alert("Action triggered!")}
                actionLabel="Continue"
              />
            </CardContent>
          </Card>

          {/* Error Demo */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Error State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CyberMascot 
                state="error" 
                message="Threat detected!" 
              />
              <div className="text-center">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => alert("Error handled!")}
                >
                  Handle Error
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features List */}
        <motion.div
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Mascot Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800 dark:text-slate-200">Animations</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Automatic eye blinking</li>
                <li>• State-specific movements</li>
                <li>• Floating particle effects</li>
                <li>• Scanning line animations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-800 dark:text-slate-200">States</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Error with worried expression</li>
                <li>• Success with happy bounce</li>
                <li>• Loading with spin effect</li>
                <li>• Scanning with tech overlay</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
          >
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}