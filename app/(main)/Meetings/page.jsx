"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, Users, Loader2 } from "lucide-react";
import { BarLoader } from "react-spinners";

export default function MeetingsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch from /api/events to get all user's events
        const res = await axios.get("/api/events");
        setEvents(res.data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <>
      <div className="fixed top-0 left-0 w-full z-50">
        <BarLoader color="#3b82f6" height={3} width="100%" />
      </div>
      
      </>
    );
    
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Meetings</h1>
        <Button asChild>
          <Link href="/Events">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {events?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold">No events found</h2>
          <p className="text-gray-500 mt-2">Create your first event to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description || "No description"}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-2" />
                {event.duration} minutes
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  {event._count.bookings} bookings
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/meetings/${event.id}`}>
                    View Bookings
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
