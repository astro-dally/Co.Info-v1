"use client"

import { Building2, Newspaper, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function EmptyState() {
  const router = useRouter()

  const handleExampleSearch = (company: string) => {
    router.push(`/company/${company}`)
  }

  return (
    <div className="mt-16 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
        <Building2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Search for a company</h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-lg mb-8 text-lg">
        Enter a company name in the search bar above to view company information, recent news, and key details.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Button
          variant="outline"
          onClick={() => handleExampleSearch("AAPL")}
          className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          Apple
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExampleSearch("MSFT")}
          className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          Microsoft
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExampleSearch("GOOGL")}
          className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExampleSearch("AMZN")}
          className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          Amazon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-3">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    icon: <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    title: "Company Profile",
    description: "Get a comprehensive overview of the company, including description, industry, and key information.",
  },
  {
    icon: <Newspaper className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    title: "Recent News",
    description: "Stay updated with the latest news articles about the company from reliable sources.",
  },
  {
    icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    title: "Company Details",
    description: "View key company information including leadership, employees, and headquarters location.",
  },
]
