import { NextResponse } from "next/server";

export async function GET() {
  const NEWS_API_KEY = process.env.NEWS_API_KEY || "";

  // If no API key is provided, return offline status
  if (!NEWS_API_KEY) {
    return NextResponse.json({
      online: false,
      message: "News API key is not configured",
    });
  }

  try {
    // Make a simple request to check if the API is responding
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      return NextResponse.json({
        online: false,
        message: `API returned status ${response.status}`,
      });
    }

    const data = await response.json();

    // Check if the response has the expected structure
    if (!data.articles || !Array.isArray(data.articles)) {
      return NextResponse.json({
        online: false,
        message: "API returned unexpected data format",
      });
    }

    return NextResponse.json({
      online: true,
      message: "News API is online",
    });
  } catch (error) {
    console.error("Error checking News API status:", error);
    return NextResponse.json({
      online: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
