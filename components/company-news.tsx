import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"
import type { NewsArticle } from "@/lib/types"
import NewsCard from "@/components/news-card"

export default function CompanyNews({ news }: { news: NewsArticle[] }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          Recent News
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 overflow-auto" style={{ maxHeight: "600px" }}>
        <div className="space-y-4">
          {news.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
