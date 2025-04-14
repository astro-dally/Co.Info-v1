import Link from "next/link"
import { Github,BarChart2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
                <div className="bg-gradient-finance p-1.5 rounded-md mr-2 shadow-sm">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl gradient-text">Co.Info</span>
              </Link>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              About
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Co.Info. All rights reserved.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Powered by{" "}
            <a
              href="https://financialmodelingprep.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Financial Modeling Prep
            </a>{" "}
            and{" "}
            <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="hover:underline">
              News API
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
