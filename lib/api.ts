import type {
  CompanySearchResult,
  CompanyProfile,
  NewsArticle,
  CompanyFinancials,
} from "./types";
// Add a new caching utility at the top of the file
import { getCachedData, setCachedData } from "./utils/api-helpers";

// API Keys from environment variables
const FINANCIAL_API_KEY = process.env.FINANCIAL_API_KEY || "demo";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";

// Modify the searchCompanies function to implement caching
export async function searchCompanies(
  query: string
): Promise<CompanySearchResult[]> {
  if (query.length < 2) return [];

  // Check cache first
  const cacheKey = `search_${query.toLowerCase()}`;
  const cachedResults = getCachedData<CompanySearchResult[]>(cacheKey);
  if (cachedResults) {
    return cachedResults;
  }

  try {
    // Real API call to Financial Modeling Prep
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(
        query
      )}&limit=10&apikey=${FINANCIAL_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    const results = data.map((item: any) => ({
      symbol: item.symbol,
      name: item.name,
      exchange: item.exchangeShortName || item.exchange || "Unknown",
      type: item.type || "stock",
    }));

    // Cache the results
    setCachedData(cacheKey, results);
    return results;
  } catch (error) {
    console.error("Error fetching company search results:", error);
    // Fallback to mock data
    return getMockSearchResults(query);
  }
}

// Modify the getCompanyProfile function to implement caching
export async function getCompanyProfile(
  symbol: string
): Promise<CompanyProfile | null> {
  // Check cache first
  const cacheKey = `profile_${symbol.toUpperCase()}`;
  const cachedProfile = getCachedData<CompanyProfile>(cacheKey);
  if (cachedProfile) {
    return cachedProfile;
  }

  try {
    // Real API call to Financial Modeling Prep
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FINANCIAL_API_KEY}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    if (!data || data.length === 0) throw new Error("No company data found");

    const company = data[0];
    const profile = {
      symbol: company.symbol,
      name: company.companyName,
      price: company.price,
      changes: company.changes,
      changesPercentage: company.changesPercentage,
      currency: company.currency,
      exchange: company.exchangeShortName,
      industry: company.industry,
      website: company.website,
      description: company.description,
      ceo: company.ceo,
      sector: company.sector,
      country: company.country,
      fullTimeEmployees: company.fullTimeEmployees,
      image: company.image || "/placeholder.svg?height=100&width=100",
      ipoDate: company.ipoDate,
    };

    // Cache the profile
    setCachedData(cacheKey, profile);
    return profile;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    // Fallback to mock data
    return getMockCompanyProfile(symbol);
  }
}

// Modify the getCompanyNews function to implement caching
export async function getCompanyNews(symbol: string): Promise<NewsArticle[]> {
  // Check cache first
  const cacheKey = `news_${symbol.toUpperCase()}`;
  const cachedNews = getCachedData<NewsArticle[]>(cacheKey);
  if (cachedNews) {
    return cachedNews;
  }

  try {
    // Get company name from profile for better news search
    const companyProfile = await getCompanyProfile(symbol);
    const companyName = companyProfile?.name.split(" ")[0] || symbol;

    // Use News API with the provided API key
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        companyName
      )}&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      throw new Error("No news articles found");
    }

    const news = data.articles.map((article: any) => ({
      source: {
        id: article.source.id,
        name: article.source.name,
      },
      author: article.author || "Unknown",
      title: article.title,
      description: article.description || "",
      url: article.url,
      urlToImage: article.urlToImage || "/placeholder.svg?height=200&width=300",
      publishedAt: article.publishedAt,
      content: article.content || "",
    }));

    // Cache the news
    setCachedData(cacheKey, news);
    return news;
  } catch (error) {
    console.error("Error fetching company news:", error);
    // Fallback to mock data
    return getMockNewsData(symbol);
  }
}

// Modify the getCompanyFinancials function to implement caching
export async function getCompanyFinancials(
  symbol: string
): Promise<CompanyFinancials | null> {
  // Check cache first
  const cacheKey = `financials_${symbol.toUpperCase()}`;
  const cachedFinancials = getCachedData<CompanyFinancials>(cacheKey);
  if (cachedFinancials) {
    return cachedFinancials;
  }

  try {
    // Real API calls to Financial Modeling Prep
    const [quoteResponse, ratiosResponse] = await Promise.all([
      fetch(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FINANCIAL_API_KEY}`,
        {
          next: { revalidate: 3600 },
        }
      ), // Cache for 1 hour
      fetch(
        `https://financialmodelingprep.com/api/v3/ratios/${symbol}?limit=1&apikey=${FINANCIAL_API_KEY}`,
        {
          next: { revalidate: 86400 },
        }
      ), // Cache for 24 hours
    ]);

    if (!quoteResponse.ok || !ratiosResponse.ok)
      throw new Error("API request failed");

    const quoteData = await quoteResponse.json();
    const ratiosData = await ratiosResponse.json();

    if (!quoteData || quoteData.length === 0)
      throw new Error("No quote data found");

    const quote = quoteData[0];
    const ratios = ratiosData[0] || {};

    const financials = {
      symbol: quote.symbol,
      marketCap: quote.marketCap,
      pe: quote.pe,
      eps: quote.eps,
      beta: quote.beta || 1.0,
      yearHigh: quote.yearHigh,
      yearLow: quote.yearLow,
      avgVolume: quote.avgVolume,
      priceToBookRatio: ratios.priceToBookRatio || quote.priceToBookRatio || 0,
      priceToSalesRatio:
        ratios.priceToSalesRatio || quote.priceToSalesRatio || 0,
      dividendYield: (quote.dividendYield || 0) / 100,
      debtToEquity: ratios.debtToEquity || 0,
    };

    // Cache the financials
    setCachedData(cacheKey, financials);
    return financials;
  } catch (error) {
    console.error("Error fetching company financials:", error);
    // Fallback to mock data
    return getMockFinancialsData(symbol);
  }
}

// Mock data functions (keep these as fallbacks)
function getMockSearchResults(query: string): CompanySearchResult[] {
  const mockCompanies = [
    { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", type: "stock" },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      exchange: "NASDAQ",
      type: "stock",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      exchange: "NASDAQ",
      type: "stock",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      exchange: "NASDAQ",
      type: "stock",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      exchange: "NASDAQ",
      type: "stock",
    },
    { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", type: "stock" },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      exchange: "NASDAQ",
      type: "stock",
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase & Co.",
      exchange: "NYSE",
      type: "stock",
    },
    { symbol: "V", name: "Visa Inc.", exchange: "NYSE", type: "stock" },
    { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", type: "stock" },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson",
      exchange: "NYSE",
      type: "stock",
    },
    {
      symbol: "PG",
      name: "Procter & Gamble Co.",
      exchange: "NYSE",
      type: "stock",
    },
    { symbol: "MA", name: "Mastercard Inc.", exchange: "NYSE", type: "stock" },
    {
      symbol: "UNH",
      name: "UnitedHealth Group Inc.",
      exchange: "NYSE",
      type: "stock",
    },
    { symbol: "HD", name: "Home Depot Inc.", exchange: "NYSE", type: "stock" },
    {
      symbol: "INTC",
      name: "Intel Corporation",
      exchange: "NASDAQ",
      type: "stock",
    },
    {
      symbol: "DIS",
      name: "The Walt Disney Company",
      exchange: "NYSE",
      type: "stock",
    },
    {
      symbol: "NFLX",
      name: "Netflix, Inc.",
      exchange: "NASDAQ",
      type: "stock",
    },
    {
      symbol: "CSCO",
      name: "Cisco Systems, Inc.",
      exchange: "NASDAQ",
      type: "stock",
    },
    { symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ", type: "stock" },
  ];

  // Filter the mock companies based on the query (case insensitive)
  const lowerQuery = query.toLowerCase();
  return mockCompanies.filter(
    (company) =>
      company.symbol.toLowerCase().includes(lowerQuery) ||
      company.name.toLowerCase().includes(lowerQuery)
  );
}

function getMockCompanyProfile(symbol: string): CompanyProfile {
  const mockProfiles: Record<string, Partial<CompanyProfile>> = {
    AAPL: {
      name: "Apple Inc.",
      industry: "Consumer Electronics",
      sector: "Technology",
      country: "US",
      website: "https://www.apple.com",
      description:
        "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, iPad, Mac, Apple Watch, and services such as Apple Music, iCloud, and Apple Pay.",
      ceo: "Tim Cook",
      exchange: "NASDAQ",
      price: 175.34,
      changes: 2.45,
      changesPercentage: 1.42,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "1980-12-12",
      fullTimeEmployees: 154000,
    },
    MSFT: {
      name: "Microsoft Corporation",
      industry: "Software—Infrastructure",
      sector: "Technology",
      country: "US",
      website: "https://www.microsoft.com",
      description:
        "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments.",
      ceo: "Satya Nadella",
      exchange: "NASDAQ",
      price: 328.79,
      changes: 1.23,
      changesPercentage: 0.38,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "1986-03-13",
      fullTimeEmployees: 181000,
    },
    GOOGL: {
      name: "Alphabet Inc.",
      industry: "Internet Content & Information",
      sector: "Technology",
      country: "US",
      website: "https://www.abc.xyz",
      description:
        "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.",
      ceo: "Sundar Pichai",
      exchange: "NASDAQ",
      price: 142.65,
      changes: 0.87,
      changesPercentage: 0.61,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "2004-08-19",
      fullTimeEmployees: 156500,
    },
    AMZN: {
      name: "Amazon.com Inc.",
      industry: "Internet Retail",
      sector: "Consumer Cyclical",
      country: "US",
      website: "https://www.amazon.com",
      description:
        "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally. It operates through e-commerce, AWS, and advertising segments.",
      ceo: "Andy Jassy",
      exchange: "NASDAQ",
      price: 178.75,
      changes: 1.56,
      changesPercentage: 0.88,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "1997-05-15",
      fullTimeEmployees: 1540000,
    },
    META: {
      name: "Meta Platforms Inc.",
      industry: "Internet Content & Information",
      sector: "Technology",
      country: "US",
      website: "https://www.meta.com",
      description:
        "Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.",
      ceo: "Mark Zuckerberg",
      exchange: "NASDAQ",
      price: 485.58,
      changes: 3.45,
      changesPercentage: 0.72,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "2012-05-18",
      fullTimeEmployees: 86482,
    },
    TSLA: {
      name: "Tesla Inc.",
      industry: "Auto Manufacturers",
      sector: "Consumer Cyclical",
      country: "US",
      website: "https://www.tesla.com",
      description:
        "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.",
      ceo: "Elon Musk",
      exchange: "NASDAQ",
      price: 177.89,
      changes: -2.34,
      changesPercentage: -1.3,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "2010-06-29",
      fullTimeEmployees: 127855,
    },
    INTC: {
      name: "Intel Corporation",
      industry: "Semiconductors",
      sector: "Technology",
      country: "US",
      website: "https://www.intel.com",
      description:
        "Intel Corporation designs, manufactures, and sells computer products and technologies worldwide. The company operates through Client Computing Group, Data Center and AI, Network and Edge, and other segments.",
      ceo: "Pat Gelsinger",
      exchange: "NASDAQ",
      price: 31.45,
      changes: 0.23,
      changesPercentage: 0.74,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "1971-10-13",
      fullTimeEmployees: 121100,
    },
    DIS: {
      name: "The Walt Disney Company",
      industry: "Entertainment",
      sector: "Communication Services",
      country: "US",
      website: "https://www.thewaltdisneycompany.com",
      description:
        "The Walt Disney Company, together with its subsidiaries, operates as an entertainment company worldwide. It operates through two segments, Disney Media and Entertainment Distribution; and Disney Parks, Experiences and Products.",
      ceo: "Bob Iger",
      exchange: "NYSE",
      price: 105.78,
      changes: 1.25,
      changesPercentage: 1.2,
      currency: "USD",
      image: "/placeholder.svg?height=100&width=100",
      ipoDate: "1957-11-12",
      fullTimeEmployees: 195000,
    },
  };

  // Default mock profile for any symbol not in our mock data
  const defaultProfile: CompanyProfile = {
    symbol: symbol,
    name: `${symbol} Corporation`,
    industry: "Technology",
    sector: "Technology",
    country: "US",
    website: `https://www.${symbol.toLowerCase()}.com`,
    description: `${symbol} is a leading technology company that provides innovative solutions to businesses and consumers worldwide.`,
    ceo: "John Doe",
    exchange: "NASDAQ",
    price: 150.0,
    changes: 1.25,
    changesPercentage: 0.84,
    currency: "USD",
    image: "/placeholder.svg?height=100&width=100",
    ipoDate: "2000-01-01",
    fullTimeEmployees: 10000,
  };

  return {
    ...defaultProfile,
    ...mockProfiles[symbol],
    symbol,
  } as CompanyProfile;
}

function getMockNewsData(symbol: string): NewsArticle[] {
  const companyName = getMockCompanyProfile(symbol).name.split(" ")[0];

  return [
    {
      source: { id: null, name: "Financial Times" },
      author: "John Doe",
      title: `${companyName} Reports Strong Q3 Earnings, Beating Analyst Expectations`,
      description: `${companyName} announced quarterly earnings that exceeded Wall Street expectations, driven by strong growth in its core business segments.`,
      url: "https://example.com/news/1",
      urlToImage: "/placeholder.svg?height=200&width=300",
      publishedAt: new Date().toISOString(),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      source: { id: null, name: "Bloomberg" },
      author: "Jane Smith",
      title: `${companyName} Expands into New Markets with Strategic Acquisition`,
      description: `${companyName} announced today it has acquired a leading competitor to expand its market presence in emerging economies.`,
      url: "https://example.com/news/2",
      urlToImage: "/placeholder.svg?height=200&width=300",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      source: { id: null, name: "CNBC" },
      author: "Robert Johnson",
      title: `${companyName} Unveils New Product Line at Annual Conference`,
      description: `${companyName} CEO presented the company's latest innovations at their annual technology conference, highlighting advancements in AI and machine learning.`,
      url: "https://example.com/news/3",
      urlToImage: "/placeholder.svg?height=200&width=300",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      source: { id: null, name: "Reuters" },
      author: "Sarah Williams",
      title: `${companyName} Partners with Leading AI Research Institute`,
      description: `${companyName} has announced a strategic partnership with a leading AI research institute to accelerate development of next-generation technologies.`,
      url: "https://example.com/news/4",
      urlToImage: "/placeholder.svg?height=200&width=300",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      source: { id: null, name: "Wall Street Journal" },
      author: "Michael Brown",
      title: `${companyName} Announces Stock Buyback Program`,
      description: `${companyName}'s board has approved a $10 billion stock buyback program, signaling confidence in the company's financial position and future growth prospects.`,
      url: "https://example.com/news/5",
      urlToImage: "/placeholder.svg?height=200&width=300",
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
  ];
}

function getMockFinancialsData(symbol: string): CompanyFinancials {
  // Different financial profiles based on company type
  const financialProfiles: Record<string, CompanyFinancials> = {
    AAPL: {
      symbol: "AAPL",
      marketCap: 2850000000000,
      pe: 32.4,
      eps: 5.61,
      beta: 1.28,
      yearHigh: 182.94,
      yearLow: 124.17,
      avgVolume: 56800000,
      priceToBookRatio: 46.5,
      priceToSalesRatio: 7.8,
      dividendYield: 0.0051,
      debtToEquity: 1.73,
    },
    MSFT: {
      symbol: "MSFT",
      marketCap: 2780000000000,
      pe: 37.2,
      eps: 9.21,
      beta: 0.93,
      yearHigh: 366.78,
      yearLow: 242.0,
      avgVolume: 26500000,
      priceToBookRatio: 12.8,
      priceToSalesRatio: 11.5,
      dividendYield: 0.0074,
      debtToEquity: 0.42,
    },
    GOOGL: {
      symbol: "GOOGL",
      marketCap: 1820000000000,
      pe: 28.5,
      eps: 5.4,
      beta: 1.06,
      yearHigh: 153.78,
      yearLow: 102.21,
      avgVolume: 28700000,
      priceToBookRatio: 6.2,
      priceToSalesRatio: 5.8,
      dividendYield: 0,
      debtToEquity: 0.06,
    },
    AMZN: {
      symbol: "AMZN",
      marketCap: 1890000000000,
      pe: 61.2,
      eps: 2.9,
      beta: 1.24,
      yearHigh: 185.1,
      yearLow: 101.15,
      avgVolume: 48900000,
      priceToBookRatio: 8.4,
      priceToSalesRatio: 2.9,
      dividendYield: 0,
      debtToEquity: 0.45,
    },
    META: {
      symbol: "META",
      marketCap: 1240000000000,
      pe: 33.8,
      eps: 14.87,
      beta: 1.42,
      yearHigh: 496.25,
      yearLow: 244.61,
      avgVolume: 16800000,
      priceToBookRatio: 7.2,
      priceToSalesRatio: 8.1,
      dividendYield: 0.0042,
      debtToEquity: 0.09,
    },
    INTC: {
      symbol: "INTC",
      marketCap: 132000000000,
      pe: 22.8,
      eps: 1.38,
      beta: 0.87,
      yearHigh: 40.73,
      yearLow: 24.59,
      avgVolume: 42500000,
      priceToBookRatio: 1.2,
      priceToSalesRatio: 2.1,
      dividendYield: 0.0125,
      debtToEquity: 0.36,
    },
    DIS: {
      symbol: "DIS",
      marketCap: 193000000000,
      pe: 72.6,
      eps: 1.46,
      beta: 1.31,
      yearHigh: 123.74,
      yearLow: 84.07,
      avgVolume: 12700000,
      priceToBookRatio: 1.9,
      priceToSalesRatio: 2.2,
      dividendYield: 0.0,
      debtToEquity: 0.49,
    },
  };

  // Return specific financial profile if available, otherwise return default
  return (
    financialProfiles[symbol] || {
      symbol,
      marketCap: 350000000000,
      pe: 25.4,
      eps: 5.28,
      beta: 1.2,
      yearHigh: 185.75,
      yearLow: 120.45,
      avgVolume: 28000000,
      priceToBookRatio: 8.5,
      priceToSalesRatio: 6.2,
      dividendYield: 0.015,
      debtToEquity: 0.45,
    }
  );
}
