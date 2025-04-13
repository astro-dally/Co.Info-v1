"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchCompanies } from "@/lib/api"
import type { CompanySearchResult } from "@/lib/types"
import LoadingSpinner from "@/components/loading-spinner"
import ErrorMessage from "@/components/error-message"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<CompanySearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [trendingStocks, setTrendingStocks] = useState<string[]>([
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "META",
    "TSLA",
    "NVDA",
  ])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const data = await searchCompanies(query)
        setResults(data)
      } catch (error) {
        console.error("Error searching companies:", error)
        setResults([]) // Ensure we reset results on error
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSearch = (symbol: string) => {
    if (!symbol) return
    setIsLoading(true) // Set loading state before navigation
    router.push(`/company/${symbol}`)
    setShowResults(false)
    setQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      handleSearch(results[0].symbol)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for a company or ticker symbol..."
            className="pl-10 pr-12 py-6 w-full rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
          />
          {query && (
            <button type="button" onClick={clearSearch} className="absolute inset-y-0 right-14 flex items-center pr-3">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Loading</span>
            </div>
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {showResults && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
          {query.length < 2 ? (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Companies
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingStocks.map((symbol) => (
                  <Button
                    key={symbol}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(symbol)}
                    className="text-sm"
                  >
                    {symbol}
                  </Button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-6 flex justify-center">
              <LoadingSpinner text="Searching companies..." size={24} />
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((company) => (
                <li
                  key={company.symbol}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSearch(company.symbol)}
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-2 mr-3">
                      <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {company.symbol}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{company.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{company.exchange}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center">
              <ErrorMessage
                title="No results found"
                description={`We couldn't find any companies matching "${query}". Try a different search term.`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
