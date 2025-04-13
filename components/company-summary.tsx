"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Globe, Calendar, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import type { CompanyProfile } from "@/lib/types"
import Image from "next/image"

export default function CompanySummary({ company }: { company: CompanyProfile }) {
  if (!company) {
    return <div>No company data available.</div>;
  }
  const formatCompanyName = (name: string) => {
    if (!name) return ""
    if (name === name.toUpperCase()) {
      const lower = name.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    }
    return name
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            {company.image && (
              <div className="bg-white p-2 rounded-lg shadow-md">
                <Image
                  src={company.image || "/placeholder.svg"}
                  alt={company.name}
                  width={64}
                  height={64}
                  className="rounded-md object-contain"
                  priority
                />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">{formatCompanyName(company.name)}</CardTitle>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-500 text-white">
                  {company.symbol}
                </Badge>
                <Badge variant="outline" className="bg-blue-400/20 text-white border-blue-300">
                  {company.exchange}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Current Price</div>
            <div className="text-3xl font-bold">${(company.price || 0).toFixed(2)}</div>
            <div
              className={`flex items-center justify-end text-sm ${
                (company.changes || 0) >= 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {(company.changes || 0) >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {(company.changes || 0) >= 0 ? "+" : ""}
              {(company.changes || 0).toFixed(2)} ({(company.changesPercentage || 0).toFixed(2)}%)
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Company Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InfoCard
            icon={<Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            title="Industry"
            value={company.industry || "Not available"}
          />
          <InfoCard
            icon={<Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            title="Country"
            value={company.country || "Not available"}
          />
          <InfoCard
            icon={<Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            title="IPO Date"
            value={company.ipoDate ? new Date(company.ipoDate).toLocaleDateString() : "Not available"}
          />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
          <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Summary</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {company.description || "No company description available."}
          </p>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <Globe className="h-4 w-4 mr-2" />
              Visit Website
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        {icon}
        <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <div className="text-gray-900 dark:text-gray-100 font-medium">{value}</div>
    </div>
  )
}
