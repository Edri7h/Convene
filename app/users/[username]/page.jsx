
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, Calendar, ArrowRight,   Send } from "lucide-react";
import Link from "next/link";
// import { getUserProfile } from "../../actions/";
// import { useDispatch } from "react-redux";
// import { setEvents } from "@/Redux/userSlice";
import EventCard from "@/components/EventCard";
// import { UserProfile } from "@clerk/clerk-react";
import ProfilePage from "@/components/ProfilePage";
import { getUserProfile } from "@/app/actions/user";

export default async function PublicProfilePage({ params }) {
  const awaitedParams = await params;
  const username = awaitedParams.username;

  const user = await getUserProfile(username);
  console.log(user);

  if (!user) {
    notFound();
  }
  // const dispatch=useDispatch();
  // dispatch(setEvents(events));
  const { events, _count } = user;

  return (
   
     <ProfilePage user={user}/>
  );
}
