import { NextResponse } from "next/server";

export async function GET() {
  const FINANCIAL_API_KEY = process.env.FINANCIAL_API_KEY || "demo";

  try {
    // Make a simple request to check if the API is responding
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/stock/list?apikey=${FINANCIAL_API_KEY}`,
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
    if (!Array.isArray(data)) {
      return NextResponse.json({
        online: false,
        message: "API returned unexpected data format",
      });
    }

    return NextResponse.json({
      online: true,
      message: "Financial API is online",
    });
  } catch (error) {
    console.error("Error checking Financial API status:", error);
    return NextResponse.json({
      online: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
