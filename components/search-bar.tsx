"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Building2, X, TrendingUp, History } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [popularCompanies, setPopularCompanies] = useState<string[]>([
    "Apple",
    "Microsoft",
    "Google",
    "Amazon",
    "Meta",
    "Tesla",
    "NVIDIA",
  ])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory.slice(0, 5)) // Keep only the 5 most recent searches
        }
      } catch (e) {
        console.error("Error parsing search history:", e)
      }
    }
  }, [])

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
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const data = await searchCompanies(query)
        setResults(data)
        if (data.length === 0) {
          setError(`No companies found matching "${query}". Try a different search term.`)
        }
      } catch (error) {
        console.error("Error searching companies:", error)
        setError("Failed to search companies. Please try again later.")
        setResults([]) // Ensure we reset results on error
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchResults, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSearch = (symbol: string, companyName?: string) => {
    if (!symbol) return

    // Add to search history
    if (companyName) {
      const newHistory = [companyName, ...searchHistory.filter((item) => item !== companyName)].slice(0, 5)
      setSearchHistory(newHistory)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))
    }

    setIsLoading(true) // Set loading state before navigation
    router.push(`/company/${symbol}`)
    setShowResults(false)
    setQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      handleSearch(results[0].symbol, results[0].name)
    } else if (query.length >= 2) {
      // If no results but query is valid, try to navigate directly using the query as a symbol
      handleSearch(query.toUpperCase())
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setError(null)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a company by name or ticker symbol..."
            className="pl-10 pr-12 py-6 w-full rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            aria-label="Search companies"
            aria-expanded={showResults}
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-14 flex items-center pr-3"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
          aria-label="Search"
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
        <div
          id="search-results"
          className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700"
          role="listbox"
        >
          {query.length < 2 ? (
            <div className="p-4">
              {searchHistory.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((company, index) => (
                      <Button
                        key={`history-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setQuery(company)
                          setShowResults(true)
                        }}
                        className="text-sm"
                      >
                        {company}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular Companies
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularCompanies.map((company, index) => (
                  <Button
                    key={`popular-${index}`}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(company)
                      setShowResults(true)
                    }}
                    className="text-sm"
                    role="option"
                  >
                    {company}
                  </Button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-6 flex justify-center">
              <LoadingSpinner text="Searching companies..." size={24} />
            </div>
          ) : error ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <ErrorMessage title="No results found" description={error} />
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2" role="listbox">
              {results.map((company, index) => (
                <li
                  key={company.symbol}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSearch(company.symbol, company.name)}
                  role="option"
                  aria-selected={index === 0}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(company.symbol, company.name)
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-md p-2 mr-3">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{company.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {company.exchange} • <span className="font-semibold">{company.symbol}</span>
                      </div>
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
