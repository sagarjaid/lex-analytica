import { NextRequest, NextResponse } from "next/server";
import { checkAndUpdateExpiredGoals } from "@/lib/goal-utils";

export async function POST(request: NextRequest) {
  try {
    // Check for a secret token to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.EXPIRED_GOALS_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await checkAndUpdateExpiredGoals();
    
    return NextResponse.json({ 
      success: true, 
      message: "Expired goals check completed" 
    });
  } catch (error) {
    console.error("Error checking expired goals:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

// Also allow GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
} 