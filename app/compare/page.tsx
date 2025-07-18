"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, X, TrendingUp, TrendingDown, Minus, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { FloatingChatbot } from "@/components/floating-chatbot"
import { ThemeToggle } from "@/components/theme-toggle"
import { getScannedProducts } from "@/lib/storage"
import Link from "next/link"

export default function ComparePage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [healthFilters, setHealthFilters] = useState<string[]>([])

  const healthConditions = [
    { id: "diabetes", label: "Diabetes", filterCriteria: { maxSugar: 10, maxCarbs: 30 } },
    { id: "hypertension", label: "Hypertension", filterCriteria: { maxSodium: 400 } },
    { id: "heart_disease", label: "Heart Disease", filterCriteria: { maxSaturatedFat: 3, maxSodium: 400 } },
    { id: "kidney_disease", label: "Kidney Disease", filterCriteria: { maxSodium: 300, maxProtein: 15 } },
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, healthFilters])

  const loadProducts = async () => {
    const scannedProducts = await getScannedProducts()
    setProducts(scannedProducts)
  }

  const filterProducts = () => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Health condition filters
    if (healthFilters.length > 0) {
      filtered = filtered.filter((product) => {
        return healthFilters.every((filterId) => {
          const condition = healthConditions.find((c) => c.id === filterId)
          if (!condition) return true

          const nutrition = product.nutrition || {}
          const criteria = condition.filterCriteria

          if (criteria.maxSugar && nutrition.sugar > criteria.maxSugar) return false
          if (criteria.maxSodium && nutrition.sodium > criteria.maxSodium) return false
          if (criteria.maxCarbs && nutrition.carbs > criteria.maxCarbs) return false
          if (criteria.maxSaturatedFat && nutrition.saturatedFat > criteria.maxSaturatedFat) return false
          if (criteria.maxProtein && nutrition.protein > criteria.maxProtein) return false

          return true
        })
      })
    }

    setFilteredProducts(filtered)
  }

  const addProductToComparison = (product: any) => {
    if (selectedProducts.length < 2 && !selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const removeProductFromComparison = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
  }

  const handleHealthFilterChange = (filterId: string, checked: boolean) => {
    if (checked) {
      setHealthFilters([...healthFilters, filterId])
    } else {
      setHealthFilters(healthFilters.filter((id) => id !== filterId))
    }
  }

  const compareNutrient = (nutrient: string, product1: any, product2: any) => {
    const value1 = product1.nutrition?.[nutrient] || 0
    const value2 = product2.nutrition?.[nutrient] || 0

    if (value1 === value2) return "equal"

    // For nutrients where lower is better (sodium, sugar, saturated fat)
    const lowerIsBetter = ["sodium", "sugar", "saturatedFat", "transFat", "cholesterol"]

    if (lowerIsBetter.includes(nutrient)) {
      return value1 < value2 ? "better" : "worse"
    } else {
      // For nutrients where higher is better (protein, fiber)
      return value1 > value2 ? "better" : "worse"
    }
  }

  const getComparisonIcon = (comparison: string) => {
    switch (comparison) {
      case "better":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "worse":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getHealthScore = (product: any) => {
    let score = 70
    const nutrition = product.nutrition || {}

    if (nutrition.sodium > 600) score -= 15
    if (nutrition.sugar > 15) score -= 10
    if (nutrition.saturatedFat > 5) score -= 10
    if (nutrition.transFat > 0) score -= 20
    if (nutrition.fiber > 3) score += 10
    if (nutrition.protein > 10) score += 10

    return Math.max(0, Math.min(100, score))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
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
                Product Comparison
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Compare Food Products</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Compare nutritional values side-by-side to make informed food choices
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters & Search
              </CardTitle>
              <CardDescription>Filter products based on health conditions and search criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Health Condition Filters */}
              <div>
                <h4 className="font-medium mb-3">Health Condition Filters</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {healthConditions.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition.id}
                        checked={healthFilters.includes(condition.id)}
                        onCheckedChange={(checked) => handleHealthFilterChange(condition.id, checked as boolean)}
                      />
                      <label htmlFor={condition.id} className="text-sm font-medium">
                        {condition.label}
                      </label>
                    </div>
                  ))}
                </div>
                {healthFilters.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing products suitable for:{" "}
                      {healthFilters.map((id) => healthConditions.find((c) => c.id === id)?.label).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Selection */}
        {selectedProducts.length < 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Select Products to Compare</CardTitle>
                <CardDescription>
                  Choose up to 2 products from your scanned items ({selectedProducts.length}/2 selected)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {products.length === 0 ? "No scanned products found." : "No products match your filters."}
                    </p>
                    <Link href="/">
                      <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Scan Your First Product
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedProducts.find((p) => p.id === product.id)
                            ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg"
                            : "hover:shadow-lg hover:scale-105"
                        }`}
                        onClick={() => addProductToComparison(product)}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            {selectedProducts.find((p) => p.id === product.id) && (
                              <Badge className="bg-emerald-500">Selected</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{product.brand}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Health Score:</span>
                              <span className="font-medium">{getHealthScore(product)}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Calories:</span>
                              <span className="font-medium">{product.nutrition?.calories || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Sodium:</span>
                              <span className="font-medium">{product.nutrition?.sodium || 0}mg</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Comparison Results */}
        {selectedProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Comparison Results</h2>
              <Button variant="outline" onClick={() => setSelectedProducts([])}>
                Clear Selection
              </Button>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {selectedProducts.map((product, index) => (
                <Card key={product.id} className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{product.name}</CardTitle>
                        <CardDescription className="text-lg">{product.brand}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeProductFromComparison(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Health Score */}
                    <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {getHealthScore(product)}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-400">Health Score</div>
                    </div>

                    {/* Key Nutrients */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.nutrition?.calories || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.nutrition?.protein || 0}g
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.nutrition?.sodium || 0}mg
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Sodium</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.nutrition?.sugar || 0}g
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Sugar</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            {selectedProducts.length === 2 && (
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Detailed Nutritional Comparison</CardTitle>
                  <CardDescription>Side-by-side comparison of nutritional values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                          <th className="text-left py-4 px-2 font-bold">Nutrient</th>
                          <th className="text-center py-4 px-2 font-bold">{selectedProducts[0].name}</th>
                          <th className="text-center py-4 px-2 font-bold">Winner</th>
                          <th className="text-center py-4 px-2 font-bold">{selectedProducts[1].name}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: "calories", label: "Calories", unit: "" },
                          { key: "protein", label: "Protein", unit: "g" },
                          { key: "carbs", label: "Carbohydrates", unit: "g" },
                          { key: "fat", label: "Total Fat", unit: "g" },
                          { key: "saturatedFat", label: "Saturated Fat", unit: "g" },
                          { key: "sodium", label: "Sodium", unit: "mg" },
                          { key: "sugar", label: "Sugar", unit: "g" },
                          { key: "fiber", label: "Fiber", unit: "g" },
                        ].map((nutrient) => {
                          const value1 = selectedProducts[0].nutrition?.[nutrient.key] || 0
                          const value2 = selectedProducts[1].nutrition?.[nutrient.key] || 0
                          const comparison = compareNutrient(nutrient.key, selectedProducts[0], selectedProducts[1])

                          return (
                            <tr
                              key={nutrient.key}
                              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="py-4 px-2 font-medium">{nutrient.label}</td>
                              <td className="text-center py-4 px-2">
                                <div className="flex items-center justify-center space-x-2">
                                  {comparison === "better" && getComparisonIcon("better")}
                                  <span className="font-medium">
                                    {value1}
                                    {nutrient.unit}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center py-4 px-2">{getComparisonIcon(comparison)}</td>
                              <td className="text-center py-4 px-2">
                                <div className="flex items-center justify-center space-x-2">
                                  {comparison === "worse" && getComparisonIcon("better")}
                                  <span className="font-medium">
                                    {value2}
                                    {nutrient.unit}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      <FloatingChatbot context={`Comparing products: ${selectedProducts.map((p) => p.name).join(" vs ")}`} />
    </div>
  )
}
