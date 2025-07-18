"use client"

import { AlertTriangle, Shield, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HealthRisksProps {
  risks: Array<{
    type: string
    severity: "low" | "medium" | "high"
    description: string
    recommendation?: string
  }>
}

export function HealthRisks({ risks }: HealthRisksProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Shield className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (!risks || risks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 text-green-500 mr-2" />
            Health Risks
          </CardTitle>
          <CardDescription>Potential health concerns from this product</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              No significant health risks identified with this product based on current analysis.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          Health Risks
        </CardTitle>
        <CardDescription>Potential health concerns from this product</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {risks.map((risk, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(risk.severity)}
                  <h4 className="font-semibold">{risk.type}</h4>
                </div>
                <Badge variant={getSeverityColor(risk.severity) as any}>{risk.severity} risk</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
              {risk.recommendation && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Recommendation:</strong> {risk.recommendation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
