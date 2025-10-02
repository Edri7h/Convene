
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { google } from 'googleapis';
import { z } from 'zod';

const bookingRequestSchema = z.object({
  eventId: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  additionalInfo: z.string().max(500).optional().or(z.literal('')),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validationResult = bookingRequestSchema.safeParse(body);

    if (!validationResult.success) { 
      return NextResponse.json(
        { success: false, error: "Invalid input provided.", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { eventId, date, time, name, email, additionalInfo } = validationResult.data;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { user: true },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

     const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + event.duration * 60000);
    console.log("this works")

    const client = await clerkClient();
    const oauthResponse = await client.users.getUserOauthAccessToken(
      event.user.clerkUserId,
      'oauth_google'
    );

    console.log("this works2")
    
    const accessToken = oauthResponse.data[0]?.token;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'The event host has not connected their Google Calendar.' },
        { status: 400 }
      );
    }
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const googleEventResponse = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all', 
      requestBody: {
        summary: `${event.title} with ${event.user.name}`,
        description: additionalInfo || `This meeting was booked through Convene.`,
        start: { dateTime: startTime.toISOString(), timeZone: 'Asia/Kolkata' },
        end: { dateTime: endTime.toISOString(), timeZone: 'Asia/Kolkata' },
        attendees: [{ email: email }, { email: event.user.email }],
        conferenceData: {
          createRequest: { requestId: `booking-${eventId}-${Date.now()}` },
        },
      },
    });

    const newBooking = await prisma.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name,
        email,
        startTime,
        endTime,
        additionalInfo,
        meetLink: googleEventResponse.data.hangoutLink,
        googleEventId: googleEventResponse.data.id,
      },
    });

    return NextResponse.json(
      { success: true, booking: newBooking },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in /api/book:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
