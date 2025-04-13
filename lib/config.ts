// Environment variables configuration
export const config = {
  // API Keys
  financialApiKey: process.env.FINANCIAL_API_KEY || "demo",
  newsApiKey: process.env.NEWS_API_KEY || "",

  // API Endpoints
  financialApiBaseUrl: "https://financialmodelingprep.com/api/v3",
  newsApiBaseUrl: "https://newsapi.org/v2",

  // Feature flags
  useRealApis: true, // Set to false to always use mock data

  // Cache settings
  cacheDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
}
