"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";
import theme from "@/lib/theme";
import Link from "next/link";
import { Calculator, ArrowRight, Sparkles, Ruler, Zap } from "lucide-react";

export default function Cal() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatorTools = [
    {
      href: "/cal/calc",
      title: "Simple Calculator",
      description: "For daily calculations and basic math operations.",
      icon: Calculator,
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-500",
      delay: 0.1
    },
    {
      href: "/cal/units",
      title: "Unit Converter",
      description: "Convert between different units of measurement.",
      icon: Ruler,
      color: "from-teal-500 to-teal-600",
      iconColor: "text-teal-500",
      delay: 0.2
    },
    {
      href: "/cal/advanc-cal",
      title: "Advanced Calculator",
      description: "For scientific and complex calculations with professional features.",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-500",
      delay: 0.3
    }
  ];

  return (
    <>
      <Header />
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15) 0%, transparent 80%)`
        }}
      />
      <div className={`min-h-screen pt-16 transition-colors duration-700 relative z-10 ${theme} bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm mb-6"
            >
              <Sparkles size={16} />
              <span>Advanced Calculation Tools</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Calculator Tools
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              A complete set of calculation tools for your various needs ✨
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {calculatorTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tool.delay }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative"
                >
                  <Link
                    href={tool.href}
                    className="block h-full"
                  >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 overflow-hidden transition-all duration-300 group-hover:shadow-3xl group-hover:bg-white/90 dark:group-hover:bg-gray-800/90 h-full flex flex-col">
                      <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 bg-gradient-to-br ${tool.color} rounded-xl shadow-lg`}>
                              <IconComponent className="text-white" size={24} />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                {tool.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Calculation Tool
                              </p>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.2, x: 3 }}
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors"
                          >
                            <ArrowRight size={16} />
                          </motion.div>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                          {tool.description}
                        </p>
                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="mt-auto"
                        >
                          <div className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-blue-500 group-hover:to-blue-600 text-gray-700 dark:text-gray-300 group-hover:text-white transition-all duration-300 text-center font-semibold text-sm">
                            Use Tool
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Why Use Our Calculation Tools?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="text-blue-500" size={20} />
                  </div>
                  <p>Modern and user-friendly design</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="text-green-500" size={20} />
                  </div>
                  <p>High speed and accuracy</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calculator className="text-purple-500" size={20} />
                  </div>
                  <p>Diverse capabilities</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
