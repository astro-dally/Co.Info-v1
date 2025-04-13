import { Suspense } from "react"
import SearchBar from "@/components/search-bar"
import EmptyState from "@/components/empty-state"
import LoadingSpinner from "@/components/loading-spinner"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Co.Info</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            🔎 Explore public companies, their financials, and industry trends – all in one place.
          </p>
        </div>

        <SearchBar />

        <Suspense
          fallback={
            <div className="mt-12 flex justify-center">
              <LoadingSpinner text="Loading company data..." size={32} />
            </div>
          }
        >
          <EmptyState />
        </Suspense>
      </div>
    </div>
  )
}
