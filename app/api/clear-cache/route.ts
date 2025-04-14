import { NextResponse } from "next/server";
import { clearCache, getCacheStats } from "@/lib/utils/api-helpers";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    // Clear specific cache or all cache
    clearCache(key);

    // Get updated cache stats
    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      message: key ? `Cache cleared for pattern: ${key}` : "All cache cleared",
      stats,
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get cache stats
    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
