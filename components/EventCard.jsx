import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";


export default function EventCard({ event, username }) {
  
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {event.title}
          </CardTitle>
          {event.duration && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-2 flex-shrink-0">
              {event.duration} min
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="block ">
        <div className="h-28">
          <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
          {event.description || "Click to book this event and learn more details."}
        </p>
        
        </div>
        <div className="flex  items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-300"></div>
            <span>
              {new Date(event.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <Button 
            size="sm" 
            asChild 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Link href={`${username}/${event.id}`} className="flex items-center gap-2">
              Book Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}