
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { username, eventId } = await params;

    // Validate if params exist
    if (!username || !eventId) {
      return NextResponse.json({ message: 'Missing username or eventId' }, { status: 400 });
    }

    // A more efficient and secure query:
    // - findUnique is used to find a single record.
    // - The `where` clause now checks for the eventId AND the associated user's username.
    //   This ensures we only find the event if it belongs to the correct user.
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        user: {
          username: username,
        },
        // Optionally, you can ensure only public events are fetched via this API
        // isPrivate: false, 
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        user: {
          select: {
            name: true,
            username: true,
            imageUrl: true,
            availability: {
              select: {
                days: true, // User's general weekly availability
                timeGap: true, // The buffer time between meetings
              },
            },
          },
        },
        // --- THIS IS THE KEY UPDATE ---
        // Include the start time of all existing bookings for this event.
        // The frontend will use this to filter out unavailable time slots.
        bookings: {
          select: {
            startTime: true,
          },
        },
      },
    });

    // If no event matches the combined criteria (ID + username), it's not found.
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Return the event data, now including the bookings array
    return NextResponse.json({ data: event }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching event details:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching event details' },
      { status: 500 }
    );
  }
}

