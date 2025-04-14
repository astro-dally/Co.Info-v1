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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />

        <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-4 sm:mt-6">
          <Suspense
            fallback={
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <LoadingSpinner text={`Loading company profile...`} size={32} />
              </div>
            }
          >
            <CompanySummaryWrapper symbol={symbol} />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
                  <LoadingSpinner text="Loading company details..." />
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
  try {
    const companyData = await getCompanyProfile(symbol)

    if (!companyData) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
          <ErrorMessage
            title="Company not found"
            description={`We couldn't find information for ${symbol}. Please try another search.`}
            retry={true}
          />
        </div>
      )
    }

    return <CompanySummary company={companyData} />
  } catch (error) {
    console.error(`Error fetching company profile for ${symbol}:`, error)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
        <ErrorMessage
          title="Error loading company"
          description="We encountered an error while loading the company profile. Please try again later."
          retry={true}
        />
      </div>
    )
  }
}

async function CompanyNewsWrapper({ symbol }: { symbol: string }) {
  try {
    const [newsData, companyData] = await Promise.all([getCompanyNews(symbol), getCompanyProfile(symbol)])

    const companyName = companyData?.name || symbol

    if (!newsData || newsData.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
          <ErrorMessage
            title="No news available"
            description={`We couldn't find any recent news for ${companyName}.`}
            retry={true}
          />
        </div>
      )
    }

    return <CompanyNews news={newsData} />
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
        <ErrorMessage
          title="Error loading news"
          description="We encountered an error while loading news articles. Please try again later."
          retry={true}
        />
      </div>
    )
  }
}

async function CompanyFinancialsWrapper({ symbol }: { symbol: string }) {
  try {
    const [financialsData, companyData] = await Promise.all([getCompanyFinancials(symbol), getCompanyProfile(symbol)])

    if (!financialsData || !companyData) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
          <ErrorMessage
            title="Company details unavailable"
            description={`We couldn't retrieve additional details for this company.`}
            retry={true}
          />
        </div>
      )
    }

    return <CompanyFinancials financials={financialsData} company={companyData} />
  } catch (error) {
    console.error(`Error fetching financials for ${symbol}:`, error)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center">
        <ErrorMessage
          title="Error loading financials"
          description="We encountered an error while loading financial data. Please try again later."
          retry={true}
        />
      </div>
    )
  }
}
