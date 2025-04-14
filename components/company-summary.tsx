"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, MapPin, Briefcase, TrendingUp, TrendingDown } from "lucide-react"
import type { CompanyProfile } from "@/lib/types"
import Image from "next/image"

export default function CompanySummary({ company }: { company: CompanyProfile }) {
  // Determine if price change is positive or negative
  const isPriceUp = company.changes > 0
  const priceChangeIcon = isPriceUp ? (
    <TrendingUp className="h-4 w-4 text-green-500" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-500" />
  )

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {company.image && (
              <div className="bg-white p-2 rounded-lg shadow-md w-16 h-16 flex items-center justify-center">
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
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">{company.name}</CardTitle>
              <div className="flex flex-wrap items-center mt-2 gap-2">
                <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-500 text-white">
                  {company.industry || "Technology"}
                </Badge>
                <Badge variant="outline" className="bg-blue-400/20 text-white border-blue-300">
                  {company.sector || "Tech"}
                </Badge>
                {company.exchange && (
                  <Badge variant="outline" className="bg-blue-400/10 text-white border-blue-300/50">
                    {company.exchange}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col justify-between sm:justify-end sm:text-right mt-2 sm:mt-0 bg-blue-600/50 p-3 rounded-lg sm:bg-transparent sm:p-0">
            <div>
              <div className="text-sm opacity-80">Founded</div>
              <div className="text-lg font-bold">
                {company.ipoDate ? new Date(company.ipoDate).getFullYear() : "N/A"}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm opacity-80">Stock Price</div>
              <div className="flex items-center">
                <span className="text-lg font-bold mr-2">{company.price ? `$${company.price.toFixed(2)}` : "N/A"}</span>
                {company.changes && (
                  <div className={`flex items-center text-sm ${isPriceUp ? "text-green-300" : "text-red-300"}`}>
                    {priceChangeIcon}
                    <span className="ml-1">
                      {Math.abs(company.changes).toFixed(2)} ({Math.abs(company.changesPercentage).toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Company Overview</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <InfoCard
            icon={<Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            title="Industry"
            value={company.industry || "Not available"}
          />
          <InfoCard
            icon={<MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            title="Country"
            value={company.country || "Not available"}
          />
          <InfoCard
            icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            title="CEO"
            value={company.ceo || "Not available"}
          />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
          <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">About</h3>
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
