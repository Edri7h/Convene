// // // // // ./app/api/book/route.js

// // // // import { NextResponse } from 'next/server';
// // // // import { prisma } from '@/lib/prisma';
// // // // import { clerkClient } from '@clerk/nextjs/server';
// // // // import { google } from 'googleapis';
// // // // import { z } from 'zod';

// // // // const bookingRequestSchema = z.object({
// // // //   eventId: z.string(),
// // // //   name: z.string().min(2, 'Name must be at least 2 characters'),
// // // //   email: z.string().email('Please enter a valid email address'),
// // // //   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
// // // //   time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
// // // //   additionalInfo: z.string().max(500).optional().or(z.literal('')),
// // // // });

// // // // export async function POST(req) {
// // // //   try {
// // // //     const body = await req.json();
// // // //     const validationResult = bookingRequestSchema.safeParse(body);

// // // //     if (!validationResult.success) {
// // // //       return NextResponse.json(
// // // //         { success: false, error: "Invalid input provided.", details: validationResult.error.flatten() },
// // // //         { status: 400 }
// // // //       );
// // // //     }

// // // //     const { eventId, date, time, name, email, additionalInfo } = validationResult.data;

// // // //     const event = await prisma.event.findUnique({
// // // //       where: { id: eventId },
// // // //       include: { user: true },
// // // //     });

// // // //     if (!event) {
// // // //       return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
// // // //     }

// // // //     const startTime = new Date(`${date}T${time}:00`);
// // // //     const endTime = new Date(startTime.getTime() + event.duration * 60000);

// // // //     // --- CHANGE #1: Remove the 'oauth_' prefix ---
// // // //     // The provider is now 'google', not 'oauth_google'.
// // // //     const oauthResponse = (await clerkClient()).users.getUserOauthAccessToken(
// // // //       event.user.clerkUserId,
// // // //       'google' // Corrected provider name
// // // //     );
    
// // // //     // --- CHANGE #2: Access the token directly from the response array ---
// // // //     // The new API returns the array directly, not inside a 'data' object.
// // // //     const accessToken = oauthResponse[0]?.token;

// // // //     if (!accessToken) {
// // // //       return NextResponse.json(
// // // //         { success: false, error: 'The event host has not connected their Google Calendar.' },
// // // //         { status: 400 }
// // // //       );
// // // //     }
    
// // // //     const oauth2Client = new google.auth.OAuth2();
// // // //     oauth2Client.setCredentials({ access_token: accessToken });

// // // //     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
// // // //     const googleEventResponse = await calendar.events.insert({
// // // //       calendarId: 'primary',
// // // //       conferenceDataVersion: 1,
// // // //       requestBody: {
// // // //         summary: `${event.title} with ${name}`,
// // // //         description: additionalInfo || `This meeting was booked through Convene.`,
// // // //         start: { dateTime: startTime.toISOString() },
// // // //         end: { dateTime: endTime.toISOString() },
// // // //         attendees: [
// // // //           { email: email },
// // // //           { email: event.user.email }
// // // //         ],
// // // //         conferenceData: {
// // // //           createRequest: {
// // // //             requestId: `booking-${eventId}-${Date.now()}`,
// // // //           },
// // // //         },
// // // //       },
// // // //     });

// // // //     const newBooking = await prisma.booking.create({
// // // //       data: {
// // // //         eventId: event.id,
// // // //         userId: event.userId,
// // // //         name,
// // // //         email,
// // // //         startTime,
// // // //         endTime,
// // // //         additionalInfo,
// // // //         meetLink: googleEventResponse.data.hangoutLink,
// // // //         googleEventId: googleEventResponse.data.id,
// // // //       },
// // // //     });

// // // //     return NextResponse.json(
// // // //       { success: true, booking: newBooking },
// // // //       { status: 201 }
// // // //     );

// // // //   } catch (error) {
// // // //     console.error('Error in /api/book:', error);
// // // //     return NextResponse.json(
// // // //       { success: false, error: 'An internal server error occurred.' },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }


// // // // ./app/api/book/route.js
// // // // import { clerkClient } from '@clerk/clerk-sdk-node';

// // // import { clerkClient } from "@clerk/nextjs";


// // // import { NextResponse } from 'next/server';
// // // import { prisma } from '@/lib/prisma'; // Using prisma as requested
// // // // import { clerkClient } from '@clerk/nextjs/server';
// // // import { google } from 'googleapis';
// // // import { z } from 'zod';

// // // // Zod schema to validate the incoming request body from your front-end.
// // // // This is a crucial security step for any public-facing API.
// // // const bookingRequestSchema = z.object({
// // //   eventId: z.string(),
// // //   name: z.string().min(2, 'Name must be at least 2 characters'),
// // //   email: z.string().email('Please enter a valid email address'),
// // //   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'), // YYYY-MM-DD
// // //   time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),     // HH:MM
// // //   additionalInfo: z.string().max(500).optional().or(z.literal('')),
// // // });

// // // /**
// // //  * Handles POST requests to create a new booking. This is the endpoint
// // //  * your front-end `BookingPage` will call with axios.
// // //  */
// // // export async function POST(request) {
// // //   try {
// // //     // 1. PARSE AND VALIDATE THE INCOMING DATA FROM THE FRONT-END
// // //     const body = await request.json();
// // //     const validationResult = bookingRequestSchema.safeParse(body);

// // //     if (!validationResult.success) {
// // //       return NextResponse.json(
// // //         { success: false, error: "Invalid input provided.", details: validationResult.error.flatten() },
// // //         { status: 400 } // Bad Request
// // //       );
// // //     }

// // //     const { eventId, date, time, name, email, additionalInfo } = validationResult.data;

// // //     // 2. FETCH THE EVENT AND ITS HOST
// // //     const event = await prisma.event.findUnique({
// // //       where: { id: eventId },
// // //       include: { user: true },
// // //     });

// // //     if (!event) {
// // //       return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 }); // Not Found
// // //     }

// // //     // 3. GET THE HOST'S GOOGLE OAUTH TOKEN (with the modern, corrected syntax)
// // //    // 3. GET THE HOST'S GOOGLE OAUTH TOKEN
// // // const oauthTokens = await clerkClient.users.getUserOauthAccessToken(
// // //   event.user.clerkUserId,
// // //   "google" // ✅ Correct provider name for Google Calendar
// // // );

// // // const accessToken = oauthTokens[0]?.token; // ✅ No "data" property in modern API


    
    

// // //     if (!accessToken) {
// // //       return NextResponse.json(
// // //         { success: false, error: 'The event host has not connected their Google Calendar.' },
// // //         { status: 400 } // Bad Request, as the action cannot be completed
// // //       );
// // //     }
    
// // //     // 4. AUTHENTICATE WITH GOOGLE AND CREATE THE CALENDAR EVENT
// // //     const oauth2Client = new google.auth.OAuth2();
// // //     oauth2Client.setCredentials({ access_token: accessToken });
// // //     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
// // //     const startTime = new Date(`${date}T${time}:00`);
// // //     const endTime = new Date(startTime.getTime() + event.duration * 60000);

// // //     const googleEventResponse = await calendar.events.insert({
// // //       calendarId: 'primary',
// // //       conferenceDataVersion: 1,
// // //       requestBody: {
// // //         summary: `${event.title} with ${name}`,
// // //         description: additionalInfo || `This meeting was booked through Convene.`,
// // //         start: { dateTime: startTime.toISOString() },
// // //         end: { dateTime: endTime.toISOString() },
// // //         attendees: [{ email: email }, { email: event.user.email }],
// // //         conferenceData: {
// // //           createRequest: { requestId: `booking-${eventId}-${Date.now()}` },
// // //         },
// // //       },
// // //     });

// // //     // 5. SAVE THE BOOKING DETAILS TO YOUR DATABASE
// // //     const newBooking = await prisma.booking.create({
// // //       data: {
// // //         eventId: event.id,
// // //         userId: event.userId,
// // //         name,
// // //         email,
// // //         startTime,
// // //         endTime,
// // //         additionalInfo,
// // //         meetLink: googleEventResponse.data.hangoutLink,
// // //         googleEventId: googleEventResponse.data.id,
// // //       },
// // //     });

// // //     // 6. RETURN A SUCCESS RESPONSE
// // //     return NextResponse.json(
// // //       { success: true, booking: newBooking },
// // //       { status: 201 } // 201 Created
// // //     );

// // //   } catch (error) {
// // //     console.error('Error in /api/book:', error);
// // //     return NextResponse.json(
// // //       { success: false, error: 'An internal server error occurred.' },
// // //       { status: 500 } // Internal Server Error
// // //     );
// // //   }
// // // }


// // // // "use server";

// // // // import { db } from "@/lib/prisma";
// // // // import { clerkClient } from "@clerk/nextjs/server";
// // // // import { google } from "googleapis";

// // // // export async function createBooking(bookingData) {
// // // //   try {
// // // //     // Fetch the event and its creator
// // // //     const event = await db.event.findUnique({
// // // //       where: { id: bookingData.eventId },
// // // //       include: { user: true },
// // // //     });

// // // //     if (!event) {
// // // //       throw new Error("Event not found");
// // // //     }

// // // //     // Get the event creator's Google OAuth token from Clerk
// // // //     const { data } = await clerkClient.users.getUserOauthAccessToken(
// // // //       event.user.clerkUserId,
// // // //       "oauth_google"
// // // //     );

// // // //     const token = data[0]?.token;

// // // //     if (!token) {
// // // //       throw new Error("Event creator has not connected Google Calendar");
// // // //     }

// // // //     // Set up Google OAuth client
// // // //     const oauth2Client = new google.auth.OAuth2();
// // // //     oauth2Client.setCredentials({ access_token: token });

// // // //     const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// // // //     // Create Google Meet link
// // // //     const meetResponse = await calendar.events.insert({
// // // //       calendarId: "primary",
// // // //       conferenceDataVersion: 1,
// // // //       requestBody: {
// // // //         summary: `${bookingData.name} - ${event.title}`,
// // // //         description: bookingData.additionalInfo,
// // // //         start: { dateTime: bookingData.startTime },
// // // //         end: { dateTime: bookingData.endTime },
// // // //         attendees: [{ email: bookingData.email }, { email: event.user.email }],
// // // //         conferenceData: {
// // // //           createRequest: { requestId: `${event.id}-${Date.now()}` },
// // // //         },
// // // //       },
// // // //     });

// // // //     const meetLink = meetResponse.data.hangoutLink;
// // // //     const googleEventId = meetResponse.data.id;

// // // //     // Create booking in database
// // // //     const booking = await db.booking.create({
// // // //       data: {
// // // //         eventId: event.id,
// // // //         userId: event.userId,
// // // //         name: bookingData.name,
// // // //         email: bookingData.email,
// // // //         startTime: bookingData.startTime,
// // // //         endTime: bookingData.endTime,
// // // //         additionalInfo: bookingData.additionalInfo,
// // // //         meetLink,
// // // //         googleEventId,
// // // //       },
// // // //     });

// // // //     return { success: true, booking, meetLink };
// // // //   } catch (error) {
// // // //     console.error("Error creating booking:", error);
// // // //     return { success: false, error: error.message };
// // // //   }
// // // // }


// // // ./app/api/book/route.js

// // import { NextResponse } from 'next/server';
// // import { prisma } from '@/lib/prisma';
// // import { clerkClient } from '@clerk/nextjs/server';
// // import { google } from 'googleapis';
// // import { z } from 'zod';

// // const bookingRequestSchema = z.object({
// //   eventId: z.string(),
// //   name: z.string().min(2, 'Name must be at least 2 characters'),
// //   email: z.string().email('Please enter a valid email address'),
// //   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
// //   time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
// //   additionalInfo: z.string().max(500).optional().or(z.literal('')),
// // });

// // export async function POST(req) {
// //   try {
// //     const body = await req.json();
// //     const validationResult = bookingRequestSchema.safeParse(body);

// //     if (!validationResult.success) {
// //       return NextResponse.json(
// //         { success: false, error: "Invalid input provided.", details: validationResult.error.flatten() },
// //         { status: 400 }
// //       );
// //     }

// //     const { eventId, date, time, name, email, additionalInfo } = validationResult.data;

// //     const event = await prisma.event.findUnique({
// //       where: { id: eventId },
// //       include: { user: true },
// //     });

// //     if (!event) {
// //       return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
// //     }

// //     const startTime = new Date(`${date}T${time}:00`);
// //     const endTime = new Date(startTime.getTime() + event.duration * 60000);

// //     // --- CHANGE #1: Use the correct provider name ---
// //     // The provider is now 'google', not 'oauth_google'.
// //     const oauthResponse = (await clerkClient()).users.getUserOauthAccessToken(
// //       event.user.clerkUserId,
// //       'google' // Corrected provider name
// //     );
// //     console.log(oauthResponse);
    
// //     // --- CHANGE #2: Access the token directly from the response ---
// //     // The new API returns an array directly, not inside a 'data' object.
// //     const accessToken = oauthResponse[0]?.token;

// //     if (!accessToken) {
// //       return NextResponse.json(
// //         { success: false, error: 'The event host has not connected their Google Calendar.' },
// //         { status: 400 }
// //       );
// //     }
    
// //     const oauth2Client = new google.auth.OAuth2();
// //     oauth2Client.setCredentials({ access_token: accessToken });

// //     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
// //     const googleEventResponse = await calendar.events.insert({
// //       calendarId: 'primary',
// //       conferenceDataVersion: 1,
// //       requestBody: {
// //         summary: `${event.title} with ${name}`,
// //         description: additionalInfo || `This meeting was booked through Convene.`,
// //         start: { dateTime: startTime.toISOString() },
// //         end: { dateTime: endTime.toISOString() },
// //         attendees: [
// //           { email: email },
// //           { email: event.user.email }
// //         ],
// //         conferenceData: {
// //           createRequest: {
// //             requestId: `booking-${eventId}-${Date.now()}`,
// //           },
// //         },
// //       },
// //     });

// //     const newBooking = await prisma.booking.create({
// //       data: {
// //         eventId: event.id,
// //         userId: event.userId,
// //         name,
// //         email,
// //         startTime,
// //         endTime,
// //         additionalInfo,
// //         meetLink: googleEventResponse.data.hangoutLink,
// //         googleEventId: googleEventResponse.data.id,
// //       },
// //     });

// //     return NextResponse.json(
// //       { success: true, booking: newBooking },
// //       { status: 201 }
// //     );

// //   } catch (error) {
// //     console.error('Error in /api/book:', error);
// //     return NextResponse.json(
// //       { success: false, error: 'An internal server error occurred.' },
// //       { status: 500 }
// //     );
// //   }
// // }



// // ./app/api/book/route.js

// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { clerkClient } from '@clerk/nextjs/server';
// import { google } from 'googleapis';
// import { z } from 'zod';

// // Zod schema to validate the incoming request body
// const bookingRequestSchema = z.object({
//   eventId: z.string(),
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email address'),
//   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
//   time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
//   additionalInfo: z.string().max(500).optional().or(z.literal('')),
// });

// export async function POST(req) {
//     console.log("CLERK_SECRET_KEY on server:", process.env.CLERK_SECRET_KEY ? "Found" : "NOT FOUND");
//   try {
//     const body = await req.json();
//     const validationResult = bookingRequestSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         { success: false, error: "Invalid input provided.", details: validationResult.error.flatten() },
//         { status: 400 }
//       );
//     }

//     const { eventId, date, time, name, email, additionalInfo } = validationResult.data;

//     const event = await prisma.event.findUnique({
//       where: { id: eventId },
//       include: { user: true },
//     });

//     if (!event) {
//       return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
//     }

//     const startTime = new Date(`${date}T${time}:00`);
//     const endTime = new Date(startTime.getTime() + event.duration * 60000);

//     // --- THIS IS THE FINAL, CORRECTED SYNTAX ---
//     // The 'await' is placed before the function call, not on clerkClient.
//     console.log(clerkClient)
//     const oauthResponse =  await clerkClient
    
//     .users.getUserOauthAccessToken(
//       event.user.clerkUserId,
//       'google' // Correct provider name
//     );
    
//     // The token is accessed directly from the response array.
//     const accessToken = oauthResponse[0]?.token;

//     if (!accessToken) {
//       return NextResponse.json(
//         { success: false, error: 'The event host has not connected their Google Calendar.' },
//         { status: 400 }
//       );
//     }
    
//     const oauth2Client = new google.auth.OAuth2();
//     oauth2Client.setCredentials({ access_token: accessToken });

//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
//     const googleEventResponse = await calendar.events.insert({
//       calendarId: 'primary',
//       conferenceDataVersion: 1,
//       requestBody: {
//         summary: `${event.title} with ${name}`,
//         description: additionalInfo || `This meeting was booked through Convene.`,
//         start: { dateTime: startTime.toISOString() },
//         end: { dateTime: endTime.toISOString() },
//         attendees: [
//           { email: email },
//           { email: event.user.email }
//         ],
//         conferenceData: {
//           createRequest: {
//             requestId: `booking-${eventId}-${Date.now()}`,
//           },
//         },
//       },
//     });

//     const newBooking = await prisma.booking.create({
//       data: {
//         eventId: event.id,
//         userId: event.userId,
//         name,
//         email,
//         startTime,
//         endTime,
//         additionalInfo,
//         meetLink: googleEventResponse.data.hangoutLink,
//         googleEventId: googleEventResponse.data.id,
//       },
//     });

//     return NextResponse.json(
//       { success: true, booking: newBooking },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error('Error in /api/book:', error);
//     return NextResponse.json(
//       { success: false, error: 'An internal server error occurred.' },
//       { status: 500 }
//     );
//   }
// }



// ./app/api/book/route.js

// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// // --- THIS IS THE CRUCIAL CHANGE YOU FOUND ---
// // We are using createClerkClient to explicitly instantiate the client.
// import { createClerkClient } from '@clerk/backend';
// import { google } from 'googleapis';
// import { z } from 'zod';

// const bookingRequestSchema = z.object({
//   eventId: z.string(),
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email address'),
//   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
//   time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
//   additionalInfo: z.string().max(500).optional().or(z.literal('')),
// });

// export async function POST(req) {
//   try {
//     // --- Step 1: Instantiate the Clerk client using your secret key ---
//     const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

//     // Step 2: Validate the incoming data
//     const body = await req.json();
//     const validationResult = bookingRequestSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         { success: false, error: "Invalid input provided.", details: validationResult.error.flatten() },
//         { status: 400 }
//       );
//     }

//     const { eventId, date, time, name, email, additionalInfo } = validationResult.data;

//     const event = await prisma.event.findUnique({
//       where: { id: eventId },
//       include: { user: true },
//     });

//     if (!event) {
//       return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
//     }

//     const startTime = new Date(`${date}T${time}:00`);
//     const endTime = new Date(startTime.getTime() + event.duration * 60000);

//     // Step 3: Use the correctly instantiated client to get the token
//     const oauthResponse = await clerkClient.users.getUserOauthAccessToken(
//       event.user.clerkUserId,
//       'google'
//     );
    
//     const accessToken = oauthResponse[0]?.token;

//     if (!accessToken) {
//       return NextResponse.json(
//         { success: false, error: 'The event host has not connected their Google Calendar.' },
//         { status: 400 }
//       );
//     }
    
//     // Step 4: Continue with the Google Calendar API call
//     const oauth2Client = new google.auth.OAuth2();
//     oauth2Client.setCredentials({ access_token: accessToken });

//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
//     const googleEventResponse = await calendar.events.insert({
//       calendarId: 'primary',
//       conferenceDataVersion: 1,
//       requestBody: {
//         summary: `${event.title} with ${name}`,
//         description: additionalInfo || `This meeting was booked through Convene.`,
//         start: { dateTime: startTime.toISOString() },
//         end: { dateTime: endTime.toISOString() },
//         attendees: [{ email: email }, { email: event.user.email }],
//         conferenceData: {
//           createRequest: { requestId: `booking-${eventId}-${Date.now()}` },
//         },
//       },
//     });

//     const newBooking = await prisma.booking.create({
//       data: {
//         eventId: event.id,
//         userId: event.userId,
//         name,
//         email,
//         startTime,
//         endTime,
//         additionalInfo,
//         meetLink: googleEventResponse.data.hangoutLink,
//         googleEventId: googleEventResponse.data.id,
//       },
//     });

//     return NextResponse.json(
//       { success: true, booking: newBooking },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error('Error in /api/book:', error);
//     return NextResponse.json(
//       { success: false, error: 'An internal server error occurred.' },
//       { status: 500 }
//     );
//   }
// }


// ./app/api/book/route.js
// ./app/api/book/route.js

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

    const client = await clerkClient();
    const oauthResponse = await client.users.getUserOauthAccessToken(
      event.user.clerkUserId,
      'oauth_google'
    );
    
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
      sendUpdates: 'all', // <-- THIS IS THE FIX
      requestBody: {
        summary: `${event.title} with ${name}`,
        description: additionalInfo || `This meeting was booked through Convene.`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
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
