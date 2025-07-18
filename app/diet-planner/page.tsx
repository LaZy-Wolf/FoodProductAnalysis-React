"use client"

import { useState } from "react"
import { ArrowLeft, Download, Calculator, Target, Heart, Activity, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { FloatingChatbot } from "@/components/floating-chatbot"
import { ThemeToggle } from "@/components/theme-toggle"
import { generateMealPlan } from "@/lib/gemini"
import { generatePDF } from "@/lib/pdf-generator"
import Link from "next/link"

interface UserProfile {
  height: string
  weight: string
  age: string
  gender: "male" | "female" | ""
  activityLevel: string
  goal: string
  healthConditions: string[]
  additionalQuery: string
}

export default function DietPlannerPage() {
  const [profile, setProfile] = useState<UserProfile>({
    height: "",
    weight: "",
    age: "",
    gender: "",
    activityLevel: "",
    goal: "",
    healthConditions: [],
    additionalQuery: "",
  })
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const healthConditions = [
    "Diabetes",
    "Hypertension",
    "High Cholesterol",
    "Heart Disease",
    "Kidney Disease",
    "Food Allergies",
    "Lactose Intolerance",
    "Gluten Sensitivity",
    "GERD",
    "IBS",
  ]

  const calculateBMR = () => {
    const weight = Number.parseFloat(profile.weight)
    const height = Number.parseFloat(profile.height)
    const age = Number.parseFloat(profile.age)

    if (!weight || !height || !age || !profile.gender) return 0

    // Mifflin-St Jeor Equation
    let bmr = 0
    if (profile.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activity level multiplier
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9,
    }

    const multiplier = activityMultipliers[profile.activityLevel] || 1.2
    return Math.round(bmr * multiplier)
  }

  const getCalorieAdjustment = () => {
    const tdee = calculateBMR()
    switch (profile.goal) {
      case "lose-weight":
        return tdee - 500
      case "gain-weight":
        return tdee + 500
      case "maintain":
        return tdee
      case "muscle-gain":
        return tdee + 300
      default:
        return tdee
    }
  }

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setProfile((prev) => ({
        ...prev,
        healthConditions: [...prev.healthConditions, condition],
      }))
    } else {
      setProfile((prev) => ({
        ...prev,
        healthConditions: prev.healthConditions.filter((c) => c !== condition),
      }))
    }
  }

  const generatePlan = async () => {
    setIsGenerating(true)
    try {
      const targetCalories = getCalorieAdjustment()
      const plan = await generateMealPlan(profile, targetCalories)
      setMealPlan(plan)
      setActiveTab("plan")

      // Show info if it's demo data
      if (plan.isDemo) {
        console.log("Using sample meal plan due to API limitations")
      }
    } catch (error) {
      console.error("Failed to generate meal plan:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportToPDF = async () => {
    if (!mealPlan) return

    try {
      await generatePDF(mealPlan, profile)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    }
  }

  const getMacroTargets = () => {
    const calories = getCalorieAdjustment()
    return {
      protein: Math.round((calories * 0.25) / 4), // 25% of calories from protein
      carbs: Math.round((calories * 0.45) / 4), // 45% of calories from carbs
      fat: Math.round((calories * 0.3) / 9), // 30% of calories from fat
    }
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
                Diet Planner
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {mealPlan && (
                <Button onClick={exportToPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Personalized Diet Planner</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create customized meal plans based on your health goals and dietary requirements
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid w-full grid-cols-3 bg-transparent">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/20"
                  >
                    Profile Setup
                  </TabsTrigger>
                  <TabsTrigger
                    value="targets"
                    className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/20"
                  >
                    Calorie Targets
                  </TabsTrigger>
                  <TabsTrigger
                    value="plan"
                    className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/20"
                  >
                    Meal Plan
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="profile" className="p-8 space-y-8">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Enter your details to calculate personalized nutrition targets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={profile.height}
                          onChange={(e) => setProfile((prev) => ({ ...prev, height: e.target.value }))}
                          placeholder="170"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={profile.weight}
                          onChange={(e) => setProfile((prev) => ({ ...prev, weight: e.target.value }))}
                          placeholder="70"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={profile.age}
                          onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value }))}
                          placeholder="30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={profile.gender}
                          onValueChange={(value: "male" | "female") =>
                            setProfile((prev) => ({ ...prev, gender: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity">Activity Level</Label>
                      <Select
                        value={profile.activityLevel}
                        onValueChange={(value) => setProfile((prev) => ({ ...prev, activityLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                          <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goal">Primary Goal</Label>
                      <Select
                        value={profile.goal}
                        onValueChange={(value) => setProfile((prev) => ({ ...prev, goal: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose-weight">Lose Weight</SelectItem>
                          <SelectItem value="maintain">Maintain Weight</SelectItem>
                          <SelectItem value="gain-weight">Gain Weight</SelectItem>
                          <SelectItem value="muscle-gain">Build Muscle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Health Conditions</CardTitle>
                    <CardDescription>Select any health conditions to customize your meal plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {healthConditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={profile.healthConditions.includes(condition)}
                            onCheckedChange={(checked) => handleHealthConditionChange(condition, checked as boolean)}
                          />
                          <Label htmlFor={condition} className="text-sm">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Additional Requirements</CardTitle>
                    <CardDescription>Any specific dietary preferences or requirements?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={profile.additionalQuery}
                      onChange={(e) => setProfile((prev) => ({ ...prev, additionalQuery: e.target.value }))}
                      placeholder="e.g., vegetarian, low sodium, high protein, meal prep friendly..."
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setActiveTab("targets")}
                    disabled={
                      !profile.height ||
                      !profile.weight ||
                      !profile.age ||
                      !profile.gender ||
                      !profile.activityLevel ||
                      !profile.goal
                    }
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600"
                  >
                    Calculate Targets
                    <Calculator className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="targets" className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 text-blue-500 mr-2" />
                        Daily Calories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{getCalorieAdjustment()}</div>
                        <p className="text-gray-600 dark:text-gray-400">calories/day</p>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">BMR: {calculateBMR()} cal</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 text-green-500 mr-2" />
                        Macronutrients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Protein</span>
                          <span className="font-medium">{getMacroTargets().protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs</span>
                          <span className="font-medium">{getMacroTargets().carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat</span>
                          <span className="font-medium">{getMacroTargets().fat}g</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        Health Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant="outline">{profile.goal.replace("-", " ")}</Badge>
                        {profile.healthConditions.map((condition) => (
                          <Badge key={condition} variant="secondary" className="mr-1 mb-1">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("profile")}>
                    Back to Profile
                  </Button>
                  <Button
                    onClick={generatePlan}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    {isGenerating ? "Generating..." : "Generate Meal Plan"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="plan" className="p-8 space-y-8">
                {isGenerating ? (
                  <Card className="border-0 shadow-md">
                    <CardContent className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 mx-auto mb-6"></div>
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          Generating your personalized meal plan...
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">This may take a few moments</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : mealPlan ? (
                  <div className="space-y-8">
                    {/* Plan Overview */}
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-2xl">Your Personalized Meal Plan</CardTitle>
                        <CardDescription>Based on your profile and health conditions</CardDescription>
                      </CardHeader>
                      {mealPlan.isDemo && (
                        <div className="mx-6 mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <div className="flex items-center">
                            <Info className="h-4 w-4 text-blue-600 mr-2" />
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              This is a sample meal plan. For personalized recommendations, please try again when the AI
                              service is available.
                            </p>
                          </div>
                        </div>
                      )}
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{getCalorieAdjustment()}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Daily Calories</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{getMacroTargets().protein}g</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{getMacroTargets().carbs}g</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{getMacroTargets().fat}g</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weekly Meal Plan */}
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-2xl">7-Day Meal Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {mealPlan.days?.map((day: any, index: number) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                              <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">
                                Day {index + 1}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="font-medium text-green-600 mb-3">Breakfast</h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{day.breakfast}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-blue-600 mb-3">Lunch</h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{day.lunch}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-purple-600 mb-3">Dinner</h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{day.dinner}</p>
                                </div>
                              </div>
                              {day.snacks && (
                                <div className="mt-6">
                                  <h4 className="font-medium text-orange-600 mb-3">Snacks</h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{day.snacks}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommendations */}
                    {mealPlan.recommendations && (
                      <Card className="border-0 shadow-md">
                        <CardHeader>
                          <CardTitle className="text-2xl">Personalized Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {mealPlan.recommendations.map((rec: string, index: number) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="border-0 shadow-md">
                    <CardContent className="text-center py-16">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No meal plan generated yet.</p>
                      <Button
                        onClick={() => setActiveTab("targets")}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600"
                      >
                        Go to Targets
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>

      <FloatingChatbot
        context={`Diet planning for ${profile.goal} with health conditions: ${profile.healthConditions.join(", ")}`}
      />
    </div>
  )
}
