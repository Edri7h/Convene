import { NextResponse } from 'next/server';
import { auth, getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    // 1. Authenticate the user and get their Clerk ID
    const { userId: clerkUserId } = getAuth(request);

    if (!clerkUserId) {
      // If the user is not authenticated, return an unauthorized error
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find the user in your database using their Clerk ID to get their internal ID
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId,
      },
      select: {
        id: true, // We only need the user's database ID for the query
      },
    });

    if (!user) {
      // If no user is found in your database for the authenticated Clerk user
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Fetch all events for this user and include the count of bookings
    const events = await prisma.event.findMany({
      where: {
        userId: user.id, // Filter events by the user's database ID
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        isPrivate: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true, // Count the number of associated bookings for each event
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Show the most recently created events first
      },
    });

    // 4. Return the events in the expected format
    return NextResponse.json({ events }, { status: 200 });

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to fetch events:', error);

    // Return a generic server error response
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
