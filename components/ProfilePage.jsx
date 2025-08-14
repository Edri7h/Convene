"use client"

import React from 'react'
// import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, Calendar,   Send } from "lucide-react";
import Link from "next/link";
// import { getUserProfile } from "../actions/user";
import { useDispatch } from "react-redux";
// import { setEvents } from "@/Redux/userSlice";
import EventCard from "@/components/EventCard";
import {  setUserDetails } from '@/Redux/userSlice';

const ProfilePage = ({user}) => {
  const dispatch=useDispatch();

   const { events, _count } = user;
   console.log(user)
   const userData={
    username:user.username,
    name:user.name,
    imageUrl:user.imageUrl,
    email:user.email,

   }
   
   dispatch(setUserDetails(userData));

  return (
   <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 border-2 border-gray-100">
                <AvatarImage src={user.imageUrl} alt={user.name || user.username} />
                <AvatarFallback className="text-xl bg-gray-600 text-white font-semibold">
                  {user.name 
                    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : user.username?.[0]?.toUpperCase() || 'U'
                  }
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name || user.username}
              </h1>
              
              {user.name && (
                <p className="text-lg text-gray-600 mb-6">@{user.username}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Member since</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Public Events</span>
                  </div>
                  <p className="font-semibold text-gray-900">{_count.events}</p>
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Total Bookings</span>
                  </div>
                  <p className="font-semibold text-gray-900">{_count.bookings}</p>
                </div>
              </div>

              {/* CTA Button */}
             <div className="flex gap-5">

               {/* <Button asChild size="lg" className="border-green-700 bg-green-200 hover:bg-green-300 text-black  px-6 py-3 rounded-lg">
                <Link href={`/book/${user.username}`} className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule a Meeting
                </Link>
              </Button> */}
               {/* <Button asChild size="lg" className="bg-blue-200 border-blue-700 text-black px-6 py-3 hover:bg-blue-300 rounded-lg">
                <Link href={`/book/${user.username}`} className="flex items-center gap-2">
                  <Contact2Icon className="w-5 h-5" />
                  Get in touch
                </Link>
              </Button> */}
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-2 flex-shrink-0">
               <Link href={"/"} className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule a Meeting
                </Link>
            </Badge>
               <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-2 flex-shrink-0">
              <Link href={"/"} className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Get in touch
                </Link>
            </Badge>
             </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Available Events</h2>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1">
              {events.length} {events.length === 1 ? 'Event' : 'Events'}
            </Badge>
          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events available yet
              </h3>
              <p className="text-gray-600">
                {user.name || user.username} hasn't created any public events yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} username={user.username} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;