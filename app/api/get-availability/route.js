import { prisma } from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return NextResponse.json({
        success: false,
        message: "Login to continue"
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    // ✅ Fixed syntax - no extra comma or bracket
    const availability = await prisma.availability.findUnique({
      where: {
        userId: user.id
      },
      include: {
        days: true
      }
    });

    return NextResponse.json({ 
      success: true,
      availability 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch availability"
    }, { status: 500 });
  }
}
