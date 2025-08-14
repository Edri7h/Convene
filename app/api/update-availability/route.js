import { prisma } from "@/lib/prisma";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get authenticated user using the correct import
    const { userId: clerkUserId } = getAuth(req)
    
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in your database using clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { timeGap, days } = body.payload;

    // Validate the data
    if (!Array.isArray(days)) {
      return NextResponse.json({ error: "Invalid days data" }, { status: 400 });
    }

    // Check if the user already has availability set
    let available = await prisma.availability.findUnique({
      where: { userId: user.id }, // Use database user ID
    });

    if (!available) {
      // Create new availability with days in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create availability record
        const newAvailability = await tx.availability.create({
          data: { 
            timeGap: Number(timeGap) || 0, 
            userId: user.id // Use database user ID
          },
        });

        // Create day availability records with time strings (not Date objects)
        await tx.dayAvailability.createMany({
          data: days.map((d) => ({
            availabilityId: newAvailability.id,
            day: d.day,
            startTime: d.startTime, // Keep as string
            endTime: d.endTime,     // Keep as string
            isAvailable: Boolean(d.isAvailable),
          })),
        });

        return newAvailability;
      });

      available = result;
    } else {
      // Update existing availability in a transaction
      await prisma.$transaction(async (tx) => {
        // Update availability
        await tx.availability.update({
          where: { userId: user.id },
          data: { timeGap: Number(timeGap) || 0 },
        });

        // Remove old day availability records
        await tx.dayAvailability.deleteMany({
          where: { availabilityId: available.id },
        });

        // Create new day availability records
        await tx.dayAvailability.createMany({
          data: days.map((d) => ({
            availabilityId: available.id,
            day: d.day,
            startTime: d.startTime, // Keep as string
            endTime: d.endTime,     // Keep as string
            isAvailable: Boolean(d.isAvailable),
          })),
        });
      });
    }

    return NextResponse.json(
      { success: true, message: "Availability updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating availability:", error);
    
    // More specific error messages
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "User reference not found" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}
