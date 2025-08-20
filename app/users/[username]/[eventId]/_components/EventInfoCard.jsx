// ./app/[username]/[eventId]/_components/EventInfoCard.jsx

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Video } from 'lucide-react';

/**
 * A card component that displays a summary of the event and the host's details.
 * It's a "presentational" component; it just displays the data it's given.
 */
export default function EventInfoCard({ event }) {
  // A helper to get the initials from a name for the Avatar Fallback
  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="lg:col-span-1">
      <div className="mb-4">
        <Link
          href={`/${event.user.username}`}
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Link>
      </div>
      <Card className="sticky top-8 border-2 border-slate-200 shadow-none">
        <CardContent className="p-6">
          {/* Host Information */}
          <div className="flex items-center">
            <Avatar className="mr-4 h-12 w-12 border-2 border-slate-100">
              <AvatarImage src={event.user.imageUrl} alt={event.user.name} />
              <AvatarFallback className="bg-slate-200 text-lg font-semibold text-slate-700">
                {getInitials(event.user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{event.user.name}</h3>
              <p className="text-sm text-slate-600">@{event.user.username}</p>
            </div>
          </div>

          {/* Event Title */}
          <h2 className="mt-6 border-t border-slate-200 pt-6 text-2xl font-bold text-slate-900">
            {event.title}
          </h2>

          {/* Event Details */}
          <div className="mt-4 space-y-3 text-slate-700">
            <div className="flex items-center">
              <Clock className="mr-3 h-5 w-5 text-slate-500" />
              <span className="font-medium">{event.duration} minutes</span>
            </div>
            <div className="flex items-center">
              <Video className="mr-3 h-5 w-5 text-slate-500" />
              <span className="font-medium">Google Meet</span>
            </div>
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="leading-relaxed text-slate-600">{event.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
