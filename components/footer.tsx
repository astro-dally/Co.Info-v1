import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-600 text-white p-1.5 rounded-md mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 21v-7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7" />
                <rect width="20" height="5" x="2" y="3" rx="2" />
                <path d="M12 12v9" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Co.Info</span>
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
