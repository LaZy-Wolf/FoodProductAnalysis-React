"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface NutritionChartProps {
  nutrition: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
    sugar?: number
    sodium?: number
    saturatedFat?: number
    transFat?: number
    cholesterol?: number
  }
}

export function NutritionChart({ nutrition }: NutritionChartProps) {
  const macroData = [
    { name: "Protein", value: nutrition.protein || 0, color: "#10b981" },
    { name: "Carbs", value: nutrition.carbs || 0, color: "#3b82f6" },
    { name: "Fat", value: nutrition.fat || 0, color: "#f59e0b" },
  ]

  const microData = [
    { name: "Fiber", value: nutrition.fiber || 0, daily: 25, unit: "g" },
    { name: "Sugar", value: nutrition.sugar || 0, daily: 50, unit: "g" },
    { name: "Sodium", value: nutrition.sodium || 0, daily: 2300, unit: "mg" },
    { name: "Cholesterol", value: nutrition.cholesterol || 0, daily: 300, unit: "mg" },
  ]

  const getDailyValuePercentage = (value: number, daily: number) => {
    return Math.min((value / daily) * 100, 100)
  }

  const getProgressColor = (percentage: number, nutrient: string) => {
    if (nutrient === "Fiber") {
      return percentage > 80 ? "bg-green-500" : "bg-blue-500"
    }
    if (nutrient === "Sugar" || nutrient === "Sodium") {
      return percentage > 80 ? "bg-red-500" : percentage > 50 ? "bg-yellow-500" : "bg-green-500"
    }
    return "bg-blue-500"
  }

  return (
    <div className="space-y-6">
      {/* Macronutrients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Macronutrient Breakdown</CardTitle>
            <CardDescription>Distribution of protein, carbs, and fats</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}g`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {macroData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-gray-600">{item.value}g</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calorie Information</CardTitle>
            <CardDescription>Total calories and breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">{nutrition.calories || 0}</div>
              <div className="text-gray-600">Calories per serving</div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Calories from Protein</span>
                <span className="font-medium">{(nutrition.protein || 0) * 4} cal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Calories from Carbs</span>
                <span className="font-medium">{(nutrition.carbs || 0) * 4} cal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Calories from Fat</span>
                <span className="font-medium">{(nutrition.fat || 0) * 9} cal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Micronutrients */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Value Percentages</CardTitle>
          <CardDescription>How much of your daily recommended intake this provides</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {microData.map((nutrient) => {
              const percentage = getDailyValuePercentage(nutrient.value, nutrient.daily)
              return (
                <div key={nutrient.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{nutrient.name}</span>
                    <span className="text-sm text-gray-600">
                      {nutrient.value}
                      {nutrient.unit} / {nutrient.daily}
                      {nutrient.unit} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Nutrition Facts */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Nutrition Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span>Total Fat</span>
                <span className="font-medium">{nutrition.fat || 0}g</span>
              </div>
              <div className="flex justify-between border-b pb-2 pl-4">
                <span className="text-sm">Saturated Fat</span>
                <span className="text-sm">{nutrition.saturatedFat || 0}g</span>
              </div>
              <div className="flex justify-between border-b pb-2 pl-4">
                <span className="text-sm">Trans Fat</span>
                <span className="text-sm">{nutrition.transFat || 0}g</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Cholesterol</span>
                <span className="font-medium">{nutrition.cholesterol || 0}mg</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span>Sodium</span>
                <span className="font-medium">{nutrition.sodium || 0}mg</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Total Carbohydrates</span>
                <span className="font-medium">{nutrition.carbs || 0}g</span>
              </div>
              <div className="flex justify-between border-b pb-2 pl-4">
                <span className="text-sm">Dietary Fiber</span>
                <span className="text-sm">{nutrition.fiber || 0}g</span>
              </div>
              <div className="flex justify-between border-b pb-2 pl-4">
                <span className="text-sm">Total Sugars</span>
                <span className="text-sm">{nutrition.sugar || 0}g</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Protein</span>
                <span className="font-medium">{nutrition.protein || 0}g</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
