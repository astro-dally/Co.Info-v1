"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Building2, Globe, Briefcase } from "lucide-react"
import type { CompanyFinancials, CompanyProfile } from "@/lib/types"
import { useState } from "react"

export default function CompanyFinancials({
  financials,
  company,
}: {
  financials: CompanyFinancials
  company: CompanyProfile
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <Card className="overflow-hidden border-0 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Company Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          <CompanyMetric
            icon={<Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            title="Employees"
            value={company.fullTimeEmployees ? company.fullTimeEmployees.toLocaleString() : "Not available"}
          />
          <CompanyMetric
            icon={<Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            title="Headquarters"
            value={company.country || "Not available"}
          />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Key Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CompanyMetric
              icon={<Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              title="Sector"
              value={company.sector || "Not available"}
            />
            <CompanyMetric
              icon={<Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              title="Exchange"
              value={company.exchange || "Not available"}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Financial Snapshot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CompanyMetric
              icon={<DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              title="Market Cap"
              value={formatCurrency(financials.marketCap)}
            />
            <CompanyMetric
              icon={<DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              title="Revenue (Est.)"
              value={formatCurrency(financials.marketCap * 0.1)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CompanyMetric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center mb-1">
        {icon}
        <span className="ml-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <div className="text-gray-900 dark:text-gray-100 font-medium">{value}</div>
    </div>
  )
}

function formatCurrency(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`
  } else {
    return `${value.toFixed(2)}`
  }
}
