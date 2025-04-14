"use client"

import { Calendar, ExternalLink } from "lucide-react"
import type { NewsArticle } from "@/lib/types"
import Image from "next/image"
import { useState } from "react"

export default function NewsCard({ article }: { article: NewsArticle }) {
  const [imageError, setImageError] = useState(false)

  // Format the date to be more readable
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row">
        {article.urlToImage && !imageError && (
          <div className="sm:w-1/3 h-32 relative">
            <Image
              src={article.urlToImage || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        <div className={`p-4 ${article.urlToImage && !imageError ? "sm:w-2/3" : "w-full"}`}>
          <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{article.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="mr-1">{formattedDate}</span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">
                {article.source.name}
              </span>
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              aria-label={`Read more about ${article.title}`}
            >
              Read More
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
