"use client"

import { CheckCircle, Heart, Zap, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BenefitsProps {
  benefits: Array<{
    type: string
    description: string
    impact: "low" | "medium" | "high"
  }>
}

export function Benefits({ benefits }: BenefitsProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getBenefitIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "heart health":
      case "cardiovascular":
        return <Heart className="h-4 w-4 text-red-500" />
      case "energy":
      case "metabolism":
        return <Zap className="h-4 w-4 text-yellow-500" />
      case "immune":
      case "antioxidant":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  if (!benefits || benefits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Health Benefits
          </CardTitle>
          <CardDescription>Positive nutritional aspects of this product</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Analyzing nutritional benefits... This product may contain beneficial nutrients that support overall health
            and wellness.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          Health Benefits
        </CardTitle>
        <CardDescription>Positive nutritional aspects of this product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getBenefitIcon(benefit.type)}
                  <h4 className="font-semibold text-green-800">{benefit.type}</h4>
                </div>
                <Badge variant={getImpactColor(benefit.impact) as any}>{benefit.impact} impact</Badge>
              </div>
              <p className="text-sm text-green-700">{benefit.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
