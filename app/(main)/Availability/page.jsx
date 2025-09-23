"use client";

import { useEffect, useState } from "react";
import { defaultAvailability } from "@/lib/defaultAvailability";
import { Clock, Calendar, Settings, Save, Check, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

const formatTime = (isoString) => {
  if (!isoString) return "09:00"; // ✅ Fallback for undefined
  return new Date(isoString).toISOString().substring(11, 16);
};

const toISOString = (timeStr) => `2025-01-01T${timeStr}:00Z`;

export default function SetAvailabilityPage() {
  // ✅ Initialize with defaultAvailability to prevent controlled input issues
  const [availability, setAvailability] = useState([]);
  const [timeGap, setTimeGap] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const getAvailability = async () => {
    try {
      const res = await axios.get("/api/get-availability");
      const updatedAvailability = res.data?.availability?.days || defaultAvailability;
      setAvailability(updatedAvailability);
      setTimeGap(res.data?.availability?.timeGap || 0); // ✅ Add fallback
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    }
  };
  const {isLoaded ,isSignedIn }=useUser();
// const router =useRouter();
  useEffect(() => {
   
    getAvailability();
  }, []);

  const toggleDay = (day) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.day === day ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    );
  };
// handle time change
  const handleTimeChange = (day, field, value) => {
    // ✅ Add safety check
    if (!value) return;
    
    const currentSelectedSlot = availability.find((slot) => slot.day === day);
    if (!currentSelectedSlot) return;

    const start = new Date(currentSelectedSlot.startTime);
    const end = new Date(currentSelectedSlot.endTime);
    const startMinutes = start.getUTCHours() * 60 + start.getUTCMinutes();
    const endMinutes = end.getUTCHours() * 60 + end.getUTCMinutes();
    const currentTimeValue = new Date(toISOString(value));
    const currentTimeMinutes = currentTimeValue.getUTCHours() * 60 + currentTimeValue.getUTCMinutes();

    if (field === "startTime") {
      if (currentTimeMinutes >= endMinutes) {
        toast.error("start time can't be after end time");
        return;
      }
    }
    if (field === "endTime") {
      if (currentTimeMinutes <= startMinutes) {
        toast.error("end time can't be before start time");
        return;
      }
    }

    setAvailability((prev) =>
      prev.map((slot) =>
        slot.day === day ? { ...slot, [field]: toISOString(value) } : slot
      )
    );
  };
// calling save API
  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    
    const dataToSend = { timeGap: Number(timeGap) || 0, days: availability };

    try {
      const res = await axios.post("/api/update-availability", {
        payload: dataToSend,
      });

      toast.success(res.data.message || "Availability updated successfully!");
      setSaveStatus("success");
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || "Something went wrong");
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-3">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Weekly Availability
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Configure your working hours for each day of the week
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Daily Schedule</h2>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Enable
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availability.map((slot, index) => {
                  const disabled = !slot.isAvailable;
                  return (
                    <tr
                      key={slot.day}
                      className={`transition-colors duration-150 ${
                        disabled ? "bg-gray-50" : "hover:bg-blue-50/30"
                      } ${index % 2 === 0 ? "bg-gray-25" : ""}`}
                    >
                      <td className="px-4 py-4">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={Boolean(slot.isAvailable)} // ✅ Ensure boolean
                            onChange={() => toggleDay(slot.day)}
                            className="sr-only"
                            id={`toggle-${slot.day}`}
                          />
                          <label 
                            htmlFor={`toggle-${slot.day}`}
                            className="flex items-center cursor-pointer"
                          >
                            <div 
                              className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
                                slot.isAvailable ? "bg-blue-600" : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                  slot.isAvailable ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </div>
                          </label>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div
                          className={`text-sm font-medium ${
                            disabled ? "text-gray-400" : "text-gray-900"
                          }`}
                        >
                          {slot.day}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="time"
                          value={formatTime(slot.startTime) || "09:00"} // ✅ Always provide a value
                          disabled={disabled}
                          onChange={(e) =>
                            handleTimeChange(slot.day, "startTime", e.target.value)
                          }
                          className={`w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                            disabled
                              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                          }`}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <input
                          type="time"
                          value={formatTime(slot.endTime) || "17:00"} // ✅ Always provide a value
                          disabled={disabled}
                          onChange={(e) =>
                            handleTimeChange(slot.day, "endTime", e.target.value)
                          }
                          className={`w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                            disabled
                              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                          }`}
                        />
                      </td>

                      <td className="px-4 py-4">
                        {!disabled ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            <X className="w-3 h-3 mr-1" />
                            Off
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Settings Section */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Time Gap (minutes):
                  </label>
                </div>
                <input
                  type="number"
                  value={timeGap || 0} // ✅ Ensure never undefined
                  onChange={(e) => setTimeGap(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  min={0}
                  placeholder="0"
                />
              </div>

              {/* Save Button and Status */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {saveStatus && (
                  <div className="flex items-center gap-2">
                    {saveStatus === "success" ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Saved!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="w-4 h-4" />
                        <span className="text-sm font-medium">Error</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 cursor-pointer border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : ( 
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
