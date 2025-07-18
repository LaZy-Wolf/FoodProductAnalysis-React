"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Scan, Target, GitCompare, Calendar, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { FloatingChatbot } from "@/components/floating-chatbot"
import { ProductAnalysis } from "@/components/product-analysis"
import { analyzeProductImage } from "@/lib/gemini"
import { saveScannedProduct } from "@/lib/storage"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [capturedImages, setCapturedImages] = useState<{ front?: string; back?: string }>({})
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const backFileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target?.result as string
      setCapturedImages((prev) => ({ ...prev, [type]: imageData }))

      // If we have both images, analyze them
      const updatedImages = { ...capturedImages, [type]: imageData }
      if (updatedImages.front && updatedImages.back) {
        await analyzeImages(updatedImages.front, updatedImages.back)
      }
    }
    reader.readAsDataURL(file)
  }

  const analyzeImages = async (frontImage: string, backImage: string) => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 500)

      const result = await analyzeProductImage(frontImage, backImage)

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      // Small delay to show 100% completion
      setTimeout(() => {
        setAnalysisResult(result)
        // Save to local storage
        saveScannedProduct(result)

        // Show success message if it's demo data
        if (result.isDemo) {
          console.log("Using demo data due to API limitations")
        }
      }, 500)
    } catch (error) {
      console.error("Analysis failed:", error)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setCapturedImages({})
    setIsAnalyzing(false)
    setAnalysisProgress(0)
  }

  if (analysisResult) {
    return (
      <>
        <ProductAnalysis product={analysisResult} onBack={resetAnalysis} images={capturedImages} />
        <FloatingChatbot context={`Current product: ${analysisResult.name}`} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="relative">
                  {/* Food symbol (apple/fruit shape) */}
                  <div className="w-8 h-8 bg-white rounded-full relative">
                    <div className="absolute inset-1 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full"></div>
                    <div className="absolute top-0 right-2 w-2 h-3 bg-green-700 rounded-full transform rotate-45"></div>
                  </div>
                  {/* Analysis rays */}
                  <div className="absolute -top-1 -left-1 w-10 h-10 border-2 border-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-1 left-1 w-6 h-6 border border-white/20 rounded-full animate-ping"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Food Product Analysis
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">AI-Powered Nutrition Insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/compare">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <GitCompare className="h-4 w-4" />
                  <span>Compare</span>
                </Button>
              </Link>
              <Link href="/diet-planner">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Diet Planner</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Analyze Your Food Products with{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Upload food labels, get instant nutritional insights, health risk assessments, and personalized
              recommendations powered by advanced AI technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                🔬 AI-Powered Analysis
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                ⚡ Instant Results
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                🏥 Health Insights
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                📊 Nutrition Charts
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main Scanning Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-white">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Scan Your Food Product</h3>
                <p className="text-emerald-100 text-lg">
                  Upload both front and back images for comprehensive AI analysis
                </p>
              </div>
            </div>
            <CardContent className="p-8">
              {/* Image Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-center text-gray-700 dark:text-gray-300">Front Label</h4>
                  <div className="min-h-[200px] max-h-[400px] border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-300 overflow-hidden">
                    {capturedImages.front ? (
                      <div className="relative w-full h-full flex items-center justify-center p-4">
                        <img
                          src={capturedImages.front || "/placeholder.svg"}
                          alt="Front label"
                          className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-emerald-500">✓ Uploaded</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-lg font-medium">Front Label Image</p>
                        <p className="text-sm">Product name & branding</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-center text-gray-700 dark:text-gray-300">
                    Back Label (Nutrition Facts)
                  </h4>
                  <div className="min-h-[200px] max-h-[400px] border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300 overflow-hidden">
                    {capturedImages.back ? (
                      <div className="relative w-full h-full flex items-center justify-center p-4">
                        <img
                          src={capturedImages.back || "/placeholder.svg"}
                          alt="Back label"
                          className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-500">✓ Uploaded</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                          <Target className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-lg font-medium">Nutrition Facts</p>
                        <p className="text-sm">Ingredients & nutrition info</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Buttons */}
              {!isAnalyzing && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 text-center">Front Label</h5>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      size="lg"
                    >
                      <Upload className="h-6 w-6 mr-3" />
                      Upload Front Image
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 text-center">Back Label</h5>
                    <Button
                      onClick={() => backFileInputRef.current?.click()}
                      className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      size="lg"
                    >
                      <Upload className="h-6 w-6 mr-3" />
                      Upload Back Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Analysis Status */}
              {isAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="relative mb-8">
                    {/* Outer rotating ring */}
                    <div className="animate-spin rounded-full h-24 w-24 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 mx-auto"></div>

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse rounded-full h-16 w-16 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                        <Search className="h-8 w-8 text-white animate-bounce" />
                      </div>
                    </div>

                    {/* Analysis rays */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-ping rounded-full h-32 w-32 border-2 border-emerald-300 dark:border-emerald-700"></div>
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analyzing Your Product</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Our AI is processing the nutrition information...
                  </p>

                  {/* Progress bar */}
                  <div className="max-w-md mx-auto mb-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {Math.round(analysisProgress)}% Complete
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Zap className="h-4 w-4 animate-pulse" />
                    <span>Processing images with AI...</span>
                  </div>
                </motion.div>
              )}

              {/* Progress Indicator */}
              {!isAnalyzing && (
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        capturedImages.front ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                      } transition-colors`}
                    ></div>
                    <span
                      className={`font-medium ${capturedImages.front ? "text-emerald-600" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      Front Image
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        capturedImages.back ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                      } transition-colors`}
                    ></div>
                    <span
                      className={`font-medium ${capturedImages.back ? "text-blue-600" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      Back Image
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        capturedImages.front && capturedImages.back ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                      } transition-colors`}
                    ></div>
                    <span
                      className={`font-medium ${
                        capturedImages.front && capturedImages.back
                          ? "text-purple-600"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Ready to Analyze
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <Card className="text-center border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Scan className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Smart Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                AI-powered nutrition analysis with comprehensive health insights and risk assessment
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Health Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Monitor dietary goals, track restrictions, and get personalized health recommendations
              </p>
            </CardContent>
          </Card>
          <Card className="text-center border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardContent className="pt-8 pb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <GitCompare className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Product Compare</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Compare multiple products side-by-side to make better food choices
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "front")}
          className="hidden"
        />
        <input
          ref={backFileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "back")}
          className="hidden"
        />
      </div>

      <FloatingChatbot context="Welcome to Food Product Analysis! I'm here to help you with nutrition questions." />
    </div>
  )
}
