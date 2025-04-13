export interface CompanySearchResult {
  symbol: string
  name: string
  exchange: string
  type: string
}

export interface CompanyProfile {
  symbol: string
  name: string
  price: number
  changes: number
  changesPercentage: number
  currency: string
  exchange: string
  industry: string
  website: string
  description: string
  ceo: string
  sector: string
  country: string
  fullTimeEmployees: number
  image: string
  ipoDate: string
}

export interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
}

export interface CompanyFinancials {
  symbol: string
  marketCap: number
  pe: number | null
  eps: number
  beta: number
  yearHigh: number
  yearLow: number
  avgVolume: number
  priceToBookRatio: number
  priceToSalesRatio: number
  dividendYield: number
  debtToEquity: number
}
