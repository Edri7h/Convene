"use client";

import { useState, useEffect } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import React from "react"; // Import React to use React.use()
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar,   User,  AlertTriangle, Trash2, Loader2, Send, Badge, SendHorizonal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarLoader,  CircleLoader } from "react-spinners";
import Link from "next/link";
import { toast } from "sonner";

export default function MeetingPage(props) {
    const params = React.use(props.params);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!params.id) {
            setError("Invalid event ID provided.");
            setLoading(false);
            return;
        }

        const fetchBookings = async () => {
            setLoading(true);
            setError("");
            try {
                // Using the API route you specified
                const response = await axios.get(`/api/getBookings/${params.id}`);

                if (response.data.success) {
                    setBookings(response.data.data || []);
                    console.log(response.data.data);
                } else {
                    throw new Error(response.data.message || "An unknown error occurred");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load bookings. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [params.id]);

    const handleCancelBooking = async (bookingId) => {
        setLoading(true)
        // Here you would add your API call to cancel the booking
       try {
         console.log("Cancelling booking:", bookingId);
         const res=await axios.delete(`/api/cancel-booking/${bookingId}`);
         toast.success(res.data.message)
        const filteredBookings= bookings.filter((booking)=>  booking.id !== bookingId)
      setBookings(filteredBookings);
        
       } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        
       }finally{
        setLoading(false);
       }
      
        // Then refetch the bookings or remove the booking from the state
        // setBookings(currentBookings => currentBookings.filter(b => b.id !== bookingId));
    };

    const renderContent = () => {
        if (loading) {
            return (
                <>
                 <div className="fixed top-0 left-0 w-full z-50">
        <BarLoader color="#3b82f6" height={3} width="100%" />
      </div>
       <div className=" flex items-center justify-center">
        <Loader2 className=" w-8 h-8 animate-spin text-gray-600" />
      </div>
                </>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center text-red-600 bg-red-50 border border-red-200 rounded-lg py-10 px-4">
                    <AlertTriangle className="w-8 h-8 mb-3" />
                    <p className="font-semibold text-center">Error</p>
                    <p className="text-center">{error}</p>
                </div>
            );
        }

        if (bookings.length === 0) {
            return (
                <div className="flex justify-center text-center text-gray-500 py-10">
                    <p>No bookings found for this event yet.</p>
                </div>
            );
        }

        return (
            // <ul className="divide-y divide-gray-200">
                <Table>
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]"><div className="flex "><User/>Name</div></TableHead>
      <TableHead>Event</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Duration</TableHead>
      <TableHead>Link</TableHead>
      <TableHead className="">Action</TableHead>
    </TableRow>
  </TableHeader>
  
   
        <TableBody className="p-2">
    { bookings.map((booking)=>
        (
              
      <TableRow className="py-3 px-2" key={booking.id}>
                <TableCell className="font-medium"><div className="flex-col">{booking?.name}</div><div className="text-gray-500">{booking?.email}</div></TableCell>
      <TableCell className="items-baseline">{booking?.event?.title} </TableCell>
      <TableCell>       <p>{new Date(booking.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p>
{
      new Date(booking.startTime).toLocaleDateString()}
      </TableCell>
      <TableCell className="">{ booking?.event?.duration } mins</TableCell>
      <TableCell className="">
      <HoverCard> 
    <Link href={booking?.meetLink}></Link>

  <HoverCardTrigger><Send/></HoverCardTrigger>

  <HoverCardContent className="bg-white text-black border-0">
    open google meet
  </HoverCardContent>
</HoverCard>
        </TableCell>

      <TableCell className="">
        <AlertDialog>
  <AlertDialogTrigger className="bg-black text-white px-3 py-2 rounded-md cursor-pointer">Cancel</AlertDialogTrigger>
  <AlertDialogContent className="bg-white border-0 shadow-md" >
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
       This will cancel the your upcoming meeting with {booking?.name}. 
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="cursor-pointer">Go back</AlertDialogCancel>
      <AlertDialogAction onClick={()=>handleCancelBooking(booking?.id)} className="cursor-pointer">Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      </TableCell>
      </TableRow>

            
    
            
        ))
    }
    </TableBody>
    
  
</Table>

                
            // </ul>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <Card className="shadow-md border-gray-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                           <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-800">
                                Event Bookings
                            </CardTitle>
                           
                        </div>
                    </div>
                </CardHeader>
               
                  <CardContent className="">
                      {renderContent()}
                  </CardContent>
                
            </Card>
            <div className="mt-6 text-center">
                 <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}
