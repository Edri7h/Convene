import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { google } from "googleapis";
import {  NextResponse } from "next/server";




export  async function DELETE(req,{params}){

    try {
        const {bookingId}= await params;
    const {userId}= getAuth(req);

    if(!userId){
        return NextResponse.json({message:"unauthorized",success:false},{status:401});

    }
    if(!bookingId){
                return NextResponse.json({message:"booking id is required",success:false},{status:401});

    }
   const booking= await  prisma.booking.findUnique(
    { where:{
            id:bookingId,   
        },
        include:{
            user:true
        }

    }
    )

    if(!booking ){
        return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
    }
   if(booking.user.clerkUserId !== userId){
            return NextResponse.json({ message: 'inavalid' }, { status: 400 });

   }
   if(booking.googleEventId && booking.user.clerkUserId){
    try {
        const client = await clerkClient();
    const oauthResponse= await client.users.getUserOauthAccessToken(
        booking.user.clerkUserId,
         'oauth_google'
    )
    const accessToken= oauthResponse.data[0]?.token

    if(!accessToken){
         return NextResponse.json(
        { success: false, error: 'The event host has not connected their Google Calendar.' },
        { status: 400 }
      );
    }

    const oauth2Client= new google.auth.OAuth2();
    oauth2Client.setCredentials({access_token:accessToken});

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
     await calendar.events.delete({
        calendarId:'primary',
        eventId: booking.googleEventId,
        sendUpdates:"all"
     });
        
    } catch (error) {
        console.log("error deleting events from google workspace",error);

        
    }
   }
   await prisma.booking.delete({

    where:{
        id:bookingId
    }

   })

    
return NextResponse.json({message:"booking cancelled succesfully " , success:true},{status:200})
        
    } catch (error) {
        console.log("error canceling booking ",error);
        return NextResponse.json({message:"error in canceling booking " , success:false},{status:500})

        
    }




}