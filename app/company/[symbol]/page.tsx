import { Suspense } from "react"
import { notFound } from "next/navigation"
import CompanySummary from "@/components/company-summary"
import CompanyNews from "@/components/company-news"
import CompanyFinancials from "@/components/company-financials"
import { getCompanyProfile, getCompanyNews, getCompanyFinancials } from "@/lib/api"
import BackButton from "@/components/back-button"
import LoadingSpinner from "@/components/loading-spinner"
import ErrorMessage from "@/components/error-message"

export default async function CompanyPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params

  if (!symbol) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />

        <div className="grid grid-cols-1 gap-8 mt-6">
          <Suspense
            fallback={
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <LoadingSpinner text={`Loading ${symbol} company profile...`} size={32} />
              </div>
            }
          >
            <CompanySummaryWrapper symbol={symbol} />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Suspense
              fallback={
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                  <LoadingSpinner text="Loading news articles..." />
                </div>
              }
            >
              <CompanyNewsWrapper symbol={symbol} />
            </Suspense>

            <Suspense
              fallback={
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                  <LoadingSpinner text="Loading financial data..." />
                </div>
              }
            >
              <CompanyFinancialsWrapper symbol={symbol} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

async function CompanySummaryWrapper({ symbol }: { symbol: string }) {
  const companyData = await getCompanyProfile(symbol)

  if (!companyData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
        <ErrorMessage
          title="Company not found"
          description={`We couldn't find information for ${symbol}. Please check the symbol and try again.`}
        />
      </div>
    )
  }

  return <CompanySummary company={companyData} />
}

async function CompanyNewsWrapper({ symbol }: { symbol: string }) {
  const newsData = await getCompanyNews(symbol)

  if (!newsData || newsData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
        <ErrorMessage title="No news available" description={`We couldn't find any recent news for ${symbol}.`} />
      </div>
    )
  }

  return <CompanyNews news={newsData} />
}

async function CompanyFinancialsWrapper({ symbol }: { symbol: string }) {
  const financialsData = await getCompanyFinancials(symbol)

  if (!financialsData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
        <ErrorMessage
          title="Financial data unavailable"
          description={`We couldn't retrieve financial data for ${symbol}.`}
        />
      </div>
    )
  }

  return <CompanyFinancials financials={financialsData} />
}
