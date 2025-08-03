// app/api/create-event/route.js
import { NextResponse } from "next/server";
import { auth, getAuth } from "@clerk/nextjs/server"; // Import from /server
import { prisma } from "@/lib/prisma"; // Your existing Prisma client

export async function POST(request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { title, description, isPrivate } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Event title is required" }, 
        { status: 400 }
      );
    }

    // Find existing user in database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    // Create the event
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        duration: 45,
        isPrivate: Boolean(isPrivate),
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      { 
        message: "Event created successfully", 
        event 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
