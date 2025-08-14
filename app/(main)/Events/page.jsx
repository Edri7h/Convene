"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Calendar, Clock, Lock, Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
// import { Switch } from "@/components/ui/switch";



const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().max(100,"Description is too long").min(1,"Description is required"),
  isPrivate: z.boolean(),
});

export default function CreateEventComponent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPrivate: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  const result = eventSchema.safeParse(formData);
  if (!result.success) {
    const {fieldErrors} =result.error.flatten();
    const formattedErrors={};
    for(let key in fieldErrors){
      if(fieldErrors[key]){
          formattedErrors[key]=fieldErrors[key][0];
      }
    }
    setErrors(formattedErrors)
    
    // setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post("/api/create-event", {
      ...formData,
      duration: 45,
    });

    toast.success("Event created successfully!");
    setFormData({ title: "", description: "", isPrivate: true });
    
  } catch (error) {
    console.error("Error creating event:", error);
    if (error.response?.status === 401) {
      toast.error("Please log in to create an event");
    } else if (error.response?.status === 404) {
      toast.error("User not found");
    } else {
      toast.error("Failed to create event");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-lg mx-auto  p-3">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Create New Event
              </CardTitle>
              <p className="text-xs text-gray-600">
                Set up a 45-minute event for booking
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Event Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Consultation Call, Strategy Session"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-sm ${
                  errors.title ? "border-red-300 focus-visible:border-red-500" : "focus-visible:border-blue-500"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this event is about..."
                rows={2}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`focus-visible:ring-0 focus-visible:ring-offset-0  ${errors.description ? "border-red-300 focus-visible:border-red-500" :"focus-visible:border-blue-500  " }resize-none  text-sm`}
              />
            </div>
             { errors.description && (<p className=" text-xs text-red-600">{errors.description}</p>)}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Event Visibility
              </Label>
              <div className="space-y-2">
                <div 
                  onClick={() => handleInputChange("isPrivate", true)}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.isPrivate 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Lock className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Private Event
                    </p>
                    <p className="text-xs text-gray-600">
                      Only people with the link can book
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.isPrivate 
                        ? "bg-blue-600 border-blue-600" 
                        : "border-gray-300"
                    }`}>
                      {formData.isPrivate && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handleInputChange("isPrivate", false)}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    !formData.isPrivate 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Globe className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Public Event
                    </p>
                    <p className="text-xs text-gray-600">
                      Anyone can discover and book this event
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      !formData.isPrivate 
                        ? "bg-green-600 border-green-600" 
                        : "border-gray-300"
                    }`}>
                      {!formData.isPrivate && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Duration: 45 minutes
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-9 text-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Event...
                </div>
              ) : (
                "Create Event"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
