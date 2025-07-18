"use client"

import { useState } from "react"
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { NutritionChart } from "@/components/nutrition-chart"
import { HealthRisks } from "@/components/health-risks"
import { Benefits } from "@/components/benefits"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface ProductAnalysisProps {
  product: any
  onBack: () => void
  images: { front?: string; back?: string }
}

export function ProductAnalysis({ product, onBack, images }: ProductAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getHealthScore = () => {
    let score = 70
    if (product.nutrition?.sodium > 600) score -= 15
    if (product.nutrition?.sugar > 15) score -= 10
    if (product.nutrition?.saturatedFat > 5) score -= 10
    if (product.nutrition?.transFat > 0) score -= 20
    if (product.nutrition?.fiber > 3) score += 10
    if (product.nutrition?.protein > 10) score += 10
    return Math.max(0, Math.min(100, score))
  }

  const healthScore = getHealthScore()

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "Excellent", variant: "default" as const }
    if (score >= 60) return { text: "Good", variant: "secondary" as const }
    return { text: "Poor", variant: "destructive" as const }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Scanner</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center">
                <div className="relative">
                  {/* Food symbol (apple/fruit shape) */}
                  <div className="w-6 h-6 bg-white rounded-full relative">
                    <div className="absolute inset-0.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full"></div>
                    <div className="absolute top-0 right-1 w-1.5 h-2 bg-green-700 rounded-full transform rotate-45"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Product Analysis
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Data Warning */}
        {product.isDemo && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Demo Analysis</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This is sample data shown due to high API demand. Your actual product analysis will be more
                    accurate.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  {images.front && (
                    <div>
                      <h3 className="font-semibold mb-3 text-emerald-100">Front Label</h3>
                      <img
                        src={images.front || "/placeholder.svg"}
                        alt="Product front"
                        className="w-full rounded-xl border-2 border-white/20 shadow-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-3">{product.name || "Unknown Product"}</h1>
                    <p className="text-emerald-100 text-xl">
                      {product.brand || "Unknown Brand"} • {product.category || "Food Product"}
                    </p>
                  </div>

                  {/* Health Score */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-white mb-2">{healthScore}</div>
                        <p className="text-emerald-100">Health Score</p>
                      </div>
                      <div className="flex-1">
                        <Progress value={healthScore} className="h-4 bg-white/20" />
                        <div className="flex justify-between text-xs text-emerald-100 mt-2">
                          <span>Poor</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                      <Badge {...getScoreBadge(healthScore)} className="text-lg px-4 py-2">
                        {getScoreBadge(healthScore).text}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-3xl font-bold text-white">{product.nutrition?.calories || "N/A"}</div>
                      <div className="text-emerald-100">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-3xl font-bold text-white">{product.nutrition?.protein || "N/A"}g</div>
                      <div className="text-emerald-100">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-3xl font-bold text-white">{product.nutrition?.carbs || "N/A"}g</div>
                      <div className="text-emerald-100">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                      <div className="text-3xl font-bold text-white">{product.nutrition?.fat || "N/A"}g</div>
                      <div className="text-emerald-100">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid w-full grid-cols-4 bg-transparent">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/20"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="nutrition"
                    className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/20"
                  >
                    Nutrition
                  </TabsTrigger>
                  <TabsTrigger
                    value="health"
                    className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/20"
                  >
                    Health Impact
                  </TabsTrigger>
                  <TabsTrigger
                    value="ingredients"
                    className="data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/20"
                  >
                    Ingredients
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Benefits benefits={product.benefits || []} />
                  <HealthRisks risks={product.risks || []} />
                </div>
              </TabsContent>

              <TabsContent value="nutrition" className="p-8">
                <NutritionChart nutrition={product.nutrition || {}} />
              </TabsContent>

              <TabsContent value="health" className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Health Concerns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {product.healthConcerns?.map((concern: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                          >
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-800 dark:text-red-200">{concern}</p>
                          </div>
                        )) || <p className="text-gray-600 dark:text-gray-400">No major health concerns identified.</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Positive Aspects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {product.positiveAspects?.map((aspect: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-green-800 dark:text-green-200">{aspect}</p>
                          </div>
                        )) || (
                          <p className="text-gray-600 dark:text-gray-400">Analyzing positive nutritional aspects...</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="p-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Ingredients Analysis</CardTitle>
                    <CardDescription className="text-lg">
                      Detailed breakdown of ingredients and their health implications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {product.ingredients?.map((ingredient: any, index: number) => (
                        <div
                          key={index}
                          className="border-l-4 border-emerald-200 dark:border-emerald-800 pl-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-r-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-lg">{ingredient.name}</h4>
                            <Badge
                              variant={
                                ingredient.safety === "safe"
                                  ? "default"
                                  : ingredient.safety === "caution"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-sm px-3 py-1"
                            >
                              {ingredient.safety}
                            </Badge>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{ingredient.description}</p>
                        </div>
                      )) || (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                          Ingredient analysis in progress...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
