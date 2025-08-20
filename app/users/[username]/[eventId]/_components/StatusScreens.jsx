// ./app/[username]/[eventId]/_components/StatusScreens.jsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
  </div>
);

export const EventNotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
    <AlertCircle className="mx-auto mb-4 h-16 w-16 text-slate-400" />
    <h2 className="mb-2 text-2xl font-bold text-slate-900">Event Not Found</h2>
    <p className="mb-6 text-slate-600">This event does not exist or has been moved.</p>
    <Button asChild>
      <Link href="/">Go to Homepage</Link>
    </Button>
  </div>
);

export const BookingSuccess = ({ username }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
    <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
    <h2 className="mb-2 text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
    <p className="mb-6 max-w-md text-slate-600">
      Your meeting has been scheduled. A confirmation email with all the details is on its way to you.
    </p>
    <Button variant="outline" asChild>
      <Link href={`/${username}`}>Book Another Meeting</Link>
    </Button>
  </div>
);
