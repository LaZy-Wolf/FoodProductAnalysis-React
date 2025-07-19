import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || " Your API KEY Here (Hardcoded )",
)

export async function analyzeProductImage(frontImage: string, backImage: string) {
  const maxRetries = 3
  const baseDelay = 2000 // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `
      Analyze these food product images (front and back labels) and provide a comprehensive nutritional analysis.
      Please extract and analyze the information and return ONLY a valid JSON object with this exact structure:

      {
        "id": "unique_id_string",
        "name": "product_name",
        "brand": "brand_name", 
        "category": "food_category",
        "nutrition": {
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "saturatedFat": 0,
          "transFat": 0,
          "cholesterol": 0,
          "sodium": 0,
          "fiber": 0,
          "sugar": 0
        },
        "ingredients": [
          {
            "name": "ingredient_name",
            "description": "what_it_is",
            "safety": "safe"
          }
        ],
        "benefits": [
          {
            "type": "benefit_type",
            "description": "detailed_description",
            "impact": "medium"
          }
        ],
        "risks": [
          {
            "type": "risk_type",
            "severity": "low",
            "description": "detailed_description",
            "recommendation": "what_to_do"
          }
        ],
        "healthConcerns": ["concern1", "concern2"],
        "positiveAspects": ["aspect1", "aspect2"],
        "suitableFor": ["general_population"],
        "avoidIf": ["specific_conditions"]
      }

      Important: Return ONLY the JSON object, no additional text, explanations, or markdown formatting.
      `

      const frontImagePart = {
        inlineData: {
          data: frontImage.split(",")[1],
          mimeType: "image/jpeg",
        },
      }

      const backImagePart = {
        inlineData: {
          data: backImage.split(",")[1],
          mimeType: "image/jpeg",
        },
      }

      const result = await model.generateContent([prompt, frontImagePart, backImagePart])
      const response = await result.response
      let text = response.text().trim()

      // Clean up the response text
      text = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim()

      // Find JSON object boundaries
      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}") + 1

      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        text = text.substring(jsonStart, jsonEnd)
      }

      try {
        const analysisData = JSON.parse(text)
        analysisData.id = Date.now().toString()
        analysisData.analyzedAt = new Date().toISOString()
        return analysisData
      } catch (parseError) {
        console.error(`JSON Parse Error on attempt ${attempt}:`, parseError)
        console.error("Raw response:", text)

        if (attempt === maxRetries) {
          throw new Error("Failed to parse analysis result after all retries")
        }
        continue
      }
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error)

      // Check if it's a 503 (overloaded) error
      if (error.message?.includes("503") || error.message?.includes("overloaded")) {
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
          console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        } else {
          // Return mock data if all retries failed
          return createMockAnalysis(frontImage, backImage)
        }
      }

      // For other errors, try once more or return mock data
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        continue
      } else {
        return createMockAnalysis(frontImage, backImage)
      }
    }
  }

  // Fallback - should not reach here
  return createMockAnalysis(frontImage, backImage)
}

// Add this new function to create mock analysis data when API fails
function createMockAnalysis(frontImage: string, backImage: string) {
  return {
    id: Date.now().toString(),
    name: "Sample Food Product",
    brand: "Unknown Brand",
    category: "Packaged Food",
    analyzedAt: new Date().toISOString(),
    isDemo: true,
    nutrition: {
      calories: 250,
      protein: 8,
      carbs: 35,
      fat: 12,
      saturatedFat: 4,
      transFat: 0,
      cholesterol: 15,
      sodium: 480,
      fiber: 3,
      sugar: 8,
    },
    ingredients: [
      {
        name: "Wheat Flour",
        description: "Refined wheat flour, main carbohydrate source",
        safety: "safe",
      },
      {
        name: "Palm Oil",
        description: "Vegetable oil high in saturated fat",
        safety: "caution",
      },
      {
        name: "Sodium",
        description: "Salt content for preservation and flavor",
        safety: "caution",
      },
    ],
    benefits: [
      {
        type: "Energy Source",
        description: "Provides quick energy from carbohydrates",
        impact: "medium",
      },
      {
        type: "Protein Content",
        description: "Contains moderate protein for muscle maintenance",
        impact: "low",
      },
    ],
    risks: [
      {
        type: "High Sodium",
        severity: "medium",
        description: "Contains elevated sodium levels which may contribute to high blood pressure",
        recommendation: "Limit consumption if you have hypertension or heart conditions",
      },
      {
        type: "Saturated Fat",
        severity: "low",
        description: "Contains saturated fats that should be consumed in moderation",
        recommendation: "Balance with foods high in unsaturated fats",
      },
    ],
    healthConcerns: [
      "High sodium content may affect blood pressure",
      "Processed ingredients with limited nutritional value",
    ],
    positiveAspects: ["Moderate protein content", "Source of energy from carbohydrates", "Contains some fiber"],
    suitableFor: ["general_population"],
    avoidIf: ["severe_hypertension", "low_sodium_diet"],
  }
}

export async function getChatResponse(message: string, context?: string, previousMessages?: any[]) {
  const maxRetries = 2

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const conversationHistory =
        previousMessages?.map((msg) => `${msg.isUser ? "User" : "Assistant"}: ${msg.content}`).join("\n") || ""

      const prompt = `
      You are an AI nutrition advisor and health expert. You help users understand food labels, make healthier choices, and answer nutrition questions.

      Context: ${context || "General nutrition consultation"}
      
      Previous conversation:
      ${conversationHistory}

      Current user message: ${message}

      Please provide helpful, accurate, and personalized nutrition advice. Be friendly, informative, and focus on practical recommendations. If discussing specific health conditions, always recommend consulting with healthcare professionals for medical advice.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error: any) {
      console.error(`Chat attempt ${attempt} failed:`, error)

      if (error.message?.includes("503") || error.message?.includes("overloaded")) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          continue
        }
      }

      // Return fallback response
      return "I'm experiencing some technical difficulties right now. As your nutrition advisor, I'd be happy to help you with food analysis, meal planning, or any nutrition questions once the connection is restored. In the meantime, remember to focus on whole foods, balanced meals, and staying hydrated!"
    }
  }

  return "I'm currently unavailable, but I'll be back soon to help with your nutrition questions!"
}

export async function generateMealPlan(profile: any, targetCalories: number) {
  const maxRetries = 2

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `
      Create a personalized 7-day meal plan based on the following profile:

      Personal Info:
      - Height: ${profile.height}cm
      - Weight: ${profile.weight}kg
      - Age: ${profile.age}
      - Gender: ${profile.gender}
      - Activity Level: ${profile.activityLevel}
      - Goal: ${profile.goal}
      - Target Calories: ${targetCalories}

      Health Conditions: ${profile.healthConditions.join(", ") || "None"}
      Additional Requirements: ${profile.additionalQuery || "None"}

      Please create a comprehensive meal plan and return ONLY a valid JSON object with this structure:

      {
        "days": [
          {
            "day": 1,
            "breakfast": "detailed_meal_description_with_portions",
            "lunch": "detailed_meal_description_with_portions",
            "dinner": "detailed_meal_description_with_portions",
            "snacks": "healthy_snack_options",
            "totalCalories": 2000,
            "notes": "any_special_considerations"
          }
        ],
        "recommendations": [
          "personalized_tip_1",
          "personalized_tip_2"
        ],
        "shoppingList": [
          "ingredient_1",
          "ingredient_2"
        ],
        "mealPrepTips": [
          "tip_1",
          "tip_2"
        ]
      }

      Return ONLY the JSON object, no additional text or formatting.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      let text = response.text().trim()

      // Clean up the response text
      text = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim()

      // Find JSON object boundaries
      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}") + 1

      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        text = text.substring(jsonStart, jsonEnd)
      }

      try {
        return JSON.parse(text)
      } catch (parseError) {
        console.error(`Meal plan JSON Parse Error on attempt ${attempt}:`, parseError)
        console.error("Raw response:", text)

        if (attempt === maxRetries) {
          throw new Error("Failed to parse meal plan result after all retries")
        }
        continue
      }
    } catch (error: any) {
      console.error(`Meal plan attempt ${attempt} failed:`, error)

      if (error.message?.includes("503") || error.message?.includes("overloaded")) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 3000))
          continue
        }
      }

      // Return fallback meal plan
      return createFallbackMealPlan(profile, targetCalories)
    }
  }

  return createFallbackMealPlan(profile, targetCalories)
}

// Add fallback meal plan function
function createFallbackMealPlan(profile: any, targetCalories: number) {
  return {
    days: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      breakfast: `Oatmeal with berries and nuts (${Math.round(targetCalories * 0.25)} calories) - 1 cup oatmeal, 1/2 cup mixed berries, 1 tbsp almonds`,
      lunch: `Grilled chicken salad (${Math.round(targetCalories * 0.35)} calories) - 4oz chicken breast, mixed greens, vegetables, olive oil dressing`,
      dinner: `Baked salmon with quinoa and vegetables (${Math.round(targetCalories * 0.35)} calories) - 4oz salmon, 1 cup quinoa, steamed broccoli`,
      snacks: `Greek yogurt with fruit (${Math.round(targetCalories * 0.05)} calories)`,
      totalCalories: targetCalories,
      notes: "This is a sample meal plan. Please consult with a nutritionist for personalized advice.",
    })),
    recommendations: [
      "Stay hydrated by drinking at least 8 glasses of water daily",
      "Include a variety of colorful fruits and vegetables",
      "Choose whole grains over refined grains",
      "Limit processed foods and added sugars",
      "Consider your health conditions when making food choices",
    ],
    shoppingList: [
      "Oatmeal",
      "Mixed berries",
      "Almonds",
      "Chicken breast",
      "Mixed greens",
      "Salmon",
      "Quinoa",
      "Broccoli",
      "Greek yogurt",
      "Olive oil",
    ],
    mealPrepTips: [
      "Prepare grains and proteins in bulk on weekends",
      "Wash and chop vegetables ahead of time",
      "Use portion control containers for easy meal prep",
    ],
    isDemo: true,
  }
}
