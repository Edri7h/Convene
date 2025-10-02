

'use client';

// React and Next.js hooks
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';

// UI and utility libraries
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog"

// Icons and Custom UI Components
import { Calendar, Clock, Video, ArrowLeft, AlertCircle, CheckCircle2, LucideCheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { BarLoader } from 'react-spinners';

// Zod schema for client-side form validation
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  additionalInfo: z.string().max(500, 'Additional information is too long').optional().or(z.literal('')),
});

// The main component for the booking page.
// It must be the default export and the file must be named `page.js`.
export default function BookingPage() {
  const params = useParams();
  const { username, eventId } = params;

  // State management for data, UI, and form
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingForm, setBookingForm] = useState(
    {
      name: '',
      email: '',
      additionalInfo: ''
    }
  );
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch event data (including bookings) when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      if (!username || !eventId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/api/${username}/${eventId}`);
        setEvent(response.data.data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        toast.error('Could not load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [username, eventId]);

  /**
   * Generates a list of all possible time slots for a given date,
   * with a flag indicating if each slot is already booked.
   * Wrapped in useCallback for performance, re-created only when `event` data changes.
   */
  const generateTimeSlots = useCallback((date) => {
    if (!event?.user?.availability?.days || !date) {
      return [];
    }

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const availableDay = event.user.availability.days.find((d) => d.day === dayOfWeek && d.isAvailable);
    if (!availableDay) {
      return [];
    }

    const bookedTimes = new Set(
      (event.bookings || [])
        .map((booking) => new Date(booking.startTime))
        .filter((bookingDate) =>
          bookingDate.getFullYear() === date.getFullYear() &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getDate() === date.getDate()
        )
        .map((bookingDate) => {
          const hours = String(bookingDate.getUTCHours()).padStart(2, '0');
          const minutes = String(bookingDate.getUTCMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`;
        })
    );

    const start = new Date(availableDay.startTime);
    const end = new Date(availableDay.endTime);
    const startMinutes = start.getUTCHours() * 60 + start.getUTCMinutes();
    const endMinutes = end.getUTCHours() * 60 + end.getUTCMinutes();

    const eventDuration = event.duration || 30;
    const bufferTime = event.user.availability.timeGap || 0;
    const totalIncrement = eventDuration + bufferTime;

    const slots = [];
    let currentTimeInMinutes = startMinutes;

    while (currentTimeInMinutes + eventDuration <= endMinutes) {
      const hours = Math.floor(currentTimeInMinutes / 60);
      const minutes = currentTimeInMinutes % 60;
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      slots.push({
        time: timeString,
        isBooked: bookedTimes.has(timeString),
      });

      currentTimeInMinutes += totalIncrement;
    }

    return slots;
  }, [event]);

  // Memoized list of available Date objects for the DatePicker
  const availableDates = useMemo(() => {
    if (!event?.user?.availability?.days) return [];
    const availableDayNames = event.user.availability.days.filter((d) => d.isAvailable).map((d) => d.day);
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      if (availableDayNames.includes(dayName)) {
        dates.push(date);
      }
    }
    return dates;
  }, [event]);



  const handleBooking = async () => {
    // 1. Client-side validation (this part is unchanged)
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time slot.');
      return;
    }
    setIsSubmitting(true);
    const validationResult = bookingSchema.safeParse(bookingForm);

    if (!validationResult.success) {
      setFormErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false);
      //  setTimeout(()=>{ setFormErrors({})},100000)
      return;
    }

    setFormErrors({});

    // --- DEBUGGING STEP 1: Log the data being sent ---
    // Create the payload object that will be sent to the API
    let payload = {
      eventId,
      date: selectedDate.toLocaleDateString('en-CA'),
      time: selectedTime,
      ...bookingForm
    };
    // payload={...payload,...bookingForm};


    //  what we're sending.
    console.log("Sending this payload to /api/book:", payload);

    try {
      // Send the request using the payload object
      // console.log(payload)
      await axios.post('/api/book', payload);
      setBookingSuccess(true);
      setBookingForm({
        name: "",
        email: "",
        additionalInfo: ""

      })

    } catch (error) {
      // --- DEBUGGING STEP 2: Log the detailed error from the server ---
      // If the API returns an error, log the detailed response data.
      console.error("Error response from /api/book:", error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to create booking.');

    } finally {
      setIsSubmitting(false);
    }
  };


  // --- UI & STYLING ---

  const customDatePickerStyles = `
    .react-datepicker { font-family: inherit; border: 2px solid #e5e7eb; border-radius: 1rem; }
    .react-datepicker__header { background-color: #f9fafb; border-bottom: 2px solid #e5e7eb; border-radius: 14px 14px 0 0; padding: 1rem 0; }
    .react-datepicker__current-month { font-weight: 600; font-size: 1rem; color: #111827; }
    .react-datepicker__day { margin: 0.125rem; width: 2rem; height: 2rem; line-height: 2rem; border-radius: 0.5rem; font-weight: 500; }
    .react-datepicker__day--selected { background-color: #3b82f6 !important; color: white !important; }
    .react-datepicker__day--disabled { color: #d1d5db !important; cursor: not-allowed; }
  `;

  if (loading) return <div><div className="fixed top-0 left-0 w-full z-50">
    <BarLoader color="#3b82f6" height={3} width="100%" />
  </div></div>;
  if (!event) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center p-4"><AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" /><h2 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h2></div>;

  // if (bookingSuccess) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center p-4"><CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" /><h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2><p className="text-slate-600 mb-6">A confirmation email is on its way.</p><Button asChild><Link href={`/users/${username}`}>Book Another</Link></Button></div>;

  const timeSlots = generateTimeSlots(selectedDate);

  return (
    <>
      <style jsx global>{customDatePickerStyles}</style>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-8">
            <Link href={`/users/${username}`} className="inline-flex items-center text-slate-700 font-medium mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Profile</Link>
            <h1 className="text-3xl font-bold text-slate-900">{event?.title}</h1>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Event Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-2 border-slate-200 shadow-none">
                <CardContent className="p-8">
                  <div className="flex items-center mb-8">
                    <Avatar className="w-16 h-16 mr-4 border-2 border-slate-200">
                      <AvatarImage src={event.user.imageUrl} alt={event.user.name} />
                      <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold text-lg">{event.user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{event.user.name}</h3>
                      <p className="text-slate-600">@{event.user.username}</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <div className="flex items-center text-slate-800"><Clock className="w-5 h-5 mr-3 text-slate-500" /><span className="font-medium">{event.duration} minutes</span></div>
                    <div className="flex items-center text-slate-800"><Video className="w-5 h-5 mr-3 text-slate-500" /><span className="font-medium">Google Meet</span></div>
                  </div>
                  {event.description && <div className="pt-6 mt-6 border-t border-slate-200"><p className="text-slate-700 leading-relaxed">{event.description}</p></div>}
                </CardContent>
              </Card>
            </div>
            {/* Right Column: Booking Flow */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-2 border-slate-200 shadow-none">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">1. Select a Date</h3>
                  <div className="flex justify-center">
                    <DatePicker selected={selectedDate} onChange={(date) => { setSelectedDate(date); setSelectedTime(null); }} includeDates={availableDates} minDate={new Date()} inline calendarClassName="border-0" />
                  </div>
                </CardContent>
              </Card>
              {selectedDate && (
                <Card className="border-2 border-slate-200 shadow-none">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">2. Choose a Time</h3>
                    {timeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant='default'
                            onClick={() => !slot.isBooked && setSelectedTime(slot.time)}
                            disabled={slot.isBooked}
                            className={`cursor-pointer ${selectedTime === slot.time ? 'bg-indigo-500 transition-transform duration-100  text-white ' : ""} py-6 text-sm font-semibold ${slot.isBooked ? 'bg-slate-100 text-slate-400 line-through cursor-not-allowed' : ''}`}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500"><Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="font-medium">No available slots on this day.</p></div>
                    )}
                  </CardContent>
                </Card>
              )}
              {selectedTime && (
                <Card className="border-2 border-slate-200 shadow-none">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">3. Your Details</h3>
                    <p className="text-slate-600 mb-6">Booking for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {selectedTime}.</p>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Full Name *</label>
                        <Input value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} placeholder="Your full name" className={`w-full border-2 ${formErrors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'} focus:ring-2`} />
                        {formErrors.name && <p className="text-red-600 text-sm mt-1 font-medium">{formErrors.name[0]}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">Email Address *</label>
                        <Input type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} placeholder="Your email address" className={`w-full border-2 ${formErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'} focus:ring-2`} />
                        {formErrors.email && <p className="text-red-600 text-sm mt-1 font-medium">{formErrors.email[0]}</p>}
                      </div>
                      <Button onClick={handleBooking} disabled={isSubmitting} size="lg" className="bg-indigo-500 border-1 border-indigo-200 text-white cursor-pointer w-full font-bold">{isSubmitting ? 'Confirming...' : `Confirm Booking`}</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(
                <Dialog open={bookingSuccess} onOpenChange={setBookingSuccess}>
                  <DialogContent className="sm:max-w-md w-full md:w-1/2 lg:w-1/3 h-64 bg-white p-8 border-white rounded-xl shadow-xl text-center">
                    <DialogHeader className="mb-2 ">
                      <LucideCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4 " />
                    </DialogHeader>

                    <DialogTitle className="text-2xl font-bold text-slate-900 ">
                      Booking Confirmed!
                    </DialogTitle>

                    <DialogDescription className="text-slate-600 ">
                      A confirmation email is on its way.
                    </DialogDescription>

                    <Button asChild className="bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors w-full cursor-pointer">
                      <p onClick={() => setBookingSuccess(false)}>  Book Another</p>
                    </Button>
                  </DialogContent>
                </Dialog>

              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



