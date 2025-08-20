import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const awaitedParams =  await params;
        const {eventId}= awaitedParams;

        if (!eventId) {
            return NextResponse.json({
                success: false,
                message: "Event ID parameter is missing"
            }, { status: 400 });
        }

        const { userId: clerkUserId } = getAuth(req);

        if (!clerkUserId) {
            return NextResponse.json({
                success: false,
                message: "Login to continue"
            }, { status: 401 });
        }

        const userInDb = await prisma.user.findUnique({
            where: {
                clerkUserId: clerkUserId
            }
        });

        if (!userInDb) {
            // 1. Using 404 (Not Found) is more accurate for a non-existent user record
            return NextResponse.json({
                success: false,
                message: "User not found in the database"
            }, { status: 404 });
        }

        const bookings = await prisma.booking.findMany({
            where: {
                eventId: eventId,
                userId: userInDb.id,
                startTime:{
                    gte : new Date()
                }
            },
            include: {
                event: {
                    select: {
                        title: true,
                        duration: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc' // Optional: Good practice to sort the results
            }
        });

        // 2. Use a standard 'data' key for the payload for consistency
        return NextResponse.json({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({
            success: false,
            message: "An internal server error occurred"
        }, { status: 500 });
    }
}
