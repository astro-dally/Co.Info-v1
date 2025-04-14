"use client"

import { useState, useEffect } from "react"
import { AlertCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ApiStatus() {
  const [apiStatus, setApiStatus] = useState<{
    financial: { status: "loading" | "online" | "offline"; message?: string }
    news: { status: "loading" | "online" | "offline"; message?: string }
  }>({
    financial: { status: "loading" },
    news: { status: "loading" },
  })

  useEffect(() => {
    const checkApiStatus = async () => {
      // Check Financial API status
      try {
        const financialResponse = await fetch("/api/check-financial-api", { cache: "no-store" })
        const financialData = await financialResponse.json()

        setApiStatus((prev) => ({
          ...prev,
          financial: {
            status: financialData.online ? "online" : "offline",
            message: financialData.message,
          },
        }))
      } catch (error) {
        setApiStatus((prev) => ({
          ...prev,
          financial: {
            status: "offline",
            message: "Could not connect to Financial API",
          },
        }))
      }

      // Check News API status
      try {
        const newsResponse = await fetch("/api/check-news-api", { cache: "no-store" })
        const newsData = await newsResponse.json()

        setApiStatus((prev) => ({
          ...prev,
          news: {
            status: newsData.online ? "online" : "offline",
            message: newsData.message,
          },
        }))
      } catch (error) {
        setApiStatus((prev) => ({
          ...prev,
          news: {
            status: "offline",
            message: "Could not connect to News API",
          },
        }))
      }
    }

    // Only check API status in production to avoid unnecessary API calls during development
    if (process.env.NODE_ENV === "production") {
      checkApiStatus()
    } else {
      // In development, assume APIs are online after a short delay
      const timer = setTimeout(() => {
        setApiStatus({
          financial: { status: "online" },
          news: { status: "online" },
        })
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  // If both APIs are online, don't show anything
  if (apiStatus.financial.status === "online" && apiStatus.news.status === "online") {
    return null
  }

  // If still loading, don't show anything yet
  if (apiStatus.financial.status === "loading" || apiStatus.news.status === "loading") {
    return null
  }

  // Show warning if any API is offline
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-900 shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Service Disruption</AlertTitle>
        <AlertDescription className="mt-2">
          {apiStatus.financial.status === "offline" && (
            <div className="flex items-start mb-2">
              <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
              <span>Financial data service is currently unavailable. Using demo data.</span>
            </div>
          )}
          {apiStatus.news.status === "offline" && (
            <div className="flex items-start">
              <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
              <span>News service is currently unavailable. Using sample news.</span>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
