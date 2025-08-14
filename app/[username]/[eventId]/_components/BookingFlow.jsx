// ./app/[username]/[eventId]/_components/BookingFlow.jsx

import { useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

// Zod schema defines the shape of our form data and validation rules.
// This ensures that users submit valid data before it's sent to the server.
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

// Animation variants for Framer Motion to make cards appear smoothly
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * Manages the entire multi-step booking process.
 * This component is "stateful" - it manages its own state for selected dates, times, and form inputs.
 */
export default function BookingFlow({ event, availableDates, onBookingConfirmed }) {
  // --- STATE MANAGEMENT ---
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIC & HELPERS ---

  /**
   * Generates time slots for a given date based on the user's availability.
   * useCallback prevents this function from being recreated on every render,
   * which is a good practice for functions passed to child components or used in effects.
   */
  const generateTimeSlots = useCallback(
    (date) => {
      // Return empty if there's no event data or no selected date
      if (!event?.user?.availability?.days || !date) return [];
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const availableDay = event.user.availability.days.find((d) => d.day === dayOfWeek && d.isAvailable);
      if (!availableDay) return [];

      // Create a Set of already booked times for quick lookups (O(1) complexity)
      const bookedTimes = new Set(
        (event.bookings || [])
          .map((booking) => new Date(booking.startTime))
          // Filter for bookings on the currently selected date
          .filter((bookingDate) => bookingDate.toDateString() === date.toDateString())
          // Format them as "HH:MM" in UTC to match how we generate slots
          .map((bookingDate) => {
            const hours = String(bookingDate.getUTCHours()).padStart(2, '0');
            const minutes = String(bookingDate.getUTCMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
          })
      );
      
      const start = new Date(availableDay.startTime);
      const end = new Date(availableDay.endTime);
      // Convert start and end times to total minutes from midnight for easier calculation
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
    },
    [event] // This function only needs to be recreated if the 'event' data changes
  );
  
  const timeSlots = generateTimeSlots(selectedDate);

  // --- EVENT HANDLERS ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleBooking = async () => {
    // 1. Validate form data using Zod
    const validationResult = bookingSchema.safeParse(bookingForm);
    if (!validationResult.success) {
      // If validation fails, update the formErrors state to display messages
      setFormErrors(validationResult.error.flatten().fieldErrors);
      return;
    }
    // If validation succeeds, clear any previous errors
    setFormErrors({});
    setIsSubmitting(true);

    // 2. Send booking data to the API
    try {
      await axios.post('/api/book', {
        eventId: event.id,
        date: selectedDate.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
        time: selectedTime,
        ...bookingForm,
      });
      // 3. If successful, call the parent's confirmation function
      onBookingConfirmed();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER ---
  return (
    <>
      {/* Custom styles for the DatePicker to match our theme */}
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit; border-radius: 1rem; border: 2px solid #e2e8f0; background-color: white;
        }
        .react-datepicker__header {
          background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; padding-top: 1rem; padding-bottom: 0.5rem;
        }
        .react-datepicker__current-month, .react-datepicker__day-name {
          font-weight: 600; color: #1e293b;
        }
        .react-datepicker__day {
          margin: 0.125rem; width: 2.25rem; height: 2.25rem; line-height: 2.25rem; border-radius: 0.75rem; font-weight: 500;
        }
        .react-datepicker__day:hover {
          background-color: #f1f5f9; border-radius: 0.75rem;
        }
        .react-datepicker__day--selected {
          background-color: #4f46e5 !important; color: white !important;
        }
        .react-datepicker__day--disabled {
          color: #94a3b8 !important; cursor: not-allowed;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #475569;
        }
      `}</style>
      
      <div className="space-y-8">
        {/* Step 1: Select a Date */}
        <Card className="border-2 border-slate-200 shadow-none">
          <CardContent className="p-6">
            <h3 className="mb-6 text-xl font-bold text-slate-900">1. Select a Date</h3>
            <div className="flex justify-center">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                includeDates={availableDates}
                minDate={new Date()}
                inline
                calendarClassName="border-0 bg-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Choose a Time (only shows if a date is selected) */}
        {selectedDate && (
          <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="border-2 border-slate-200 shadow-none">
              <CardContent className="p-6">
                <h3 className="mb-6 text-xl font-bold text-slate-900">2. Choose a Time</h3>
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? 'default' : 'outline'}
                        onClick={() => !slot.isBooked && setSelectedTime(slot.time)}
                        disabled={slot.isBooked}
                        className={`py-6 text-sm font-semibold transition-all duration-200 ${
                          slot.isBooked ? 'cursor-not-allowed bg-slate-100 text-slate-400 line-through' : ''
                        } ${selectedTime === slot.time ? 'bg-indigo-600 hover:bg-indigo-700' : 'hover:bg-slate-100'}`}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                    <p className="font-medium">No available slots on this day.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Step 3: Your Details (only shows if a time is selected) */}
        {selectedTime && (
           <motion.div initial="hidden" animate="visible" variants={cardVariants}>
            <Card className="border-2 border-slate-200 shadow-none">
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-bold text-slate-900">3. Your Details</h3>
                <p className="mb-6 text-slate-600">
                  Booking for{' '}
                  <span className="font-semibold text-slate-800">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </span>{' '}
                  at <span className="font-semibold text-slate-800">{selectedTime}</span>.
                </p>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-800">Full Name *</label>
                    <Input name="name" value={bookingForm.name} onChange={handleFormChange} placeholder="John Doe" />
                    {formErrors.name && <p className="mt-1 text-sm font-medium text-red-600">{formErrors.name[0]}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-800">Email Address *</label>
                    <Input name="email" type="email" value={bookingForm.email} onChange={handleFormChange} placeholder="you@example.com" />
                    {formErrors.email && <p className="mt-1 text-sm font-medium text-red-600">{formErrors.email[0]}</p>}
                  </div>
                  <Button onClick={handleBooking} disabled={isSubmitting} size="lg" className="w-full font-bold">
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </Button>
                </div>
              </CardContent>
            </Card>
           </motion.div>
        )}
      </div>
    </>
  );
}
