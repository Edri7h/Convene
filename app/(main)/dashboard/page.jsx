"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { z } from "zod";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
// import Image from "next/image";

// Username validation
const schema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username cannot exceed 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed");

export default function DashboardPage() {
  // const router=useRouter();
  const { user, isLoaded,isSignedIn } = useUser();
  const { updateUser } = useClerk();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    
    if (isLoaded && user?.username) {
      setUsername(user.username);
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="fixed top-0 left-0 w-full z-50">
        <BarLoader color="#3b82f6" height={3} width="100%" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const result = schema.safeParse(username);
  if (!result.success) {
    setError(result.error.errors[0].message);
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("/api/update-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update username");
    }

    toast.success("Username updated successfully");
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const userLink = username ? `${baseUrl}/users/${username}` : "";

  const handleCopy = async () => {
    if (!userLink) return;
    try {
      await navigator.clipboard.writeText(userLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed top-0 left-0 w-full z-50">
          <BarLoader color="#3b82f6" height={3} width="100%" />
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className=" rounded-full">
                  <img
                    src={user.imageUrl}
                    alt="User avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Welcome back
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Username Configuration */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Booking Link
              </CardTitle>
              <p className="text-sm text-gray-600">
                Set up your personalized booking link for clients and customers.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="flex rounded-md shadow-sm border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <span className="w-96 inline-flex items-center px-3 bg-gray-50 border-r border-gray-300 text-gray-500 text-sm">
                     <p className=""> https://convene-xiyn.vercel.app/</p>
                    </span> 
                    <Input
                      id="username"
                      type="text"
                      placeholder="your-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="border-0 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      maxLength={20}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Preview Link */}
                {userLink && !error && (
                  <div className="p-4 bg-gray-50 rounded-md border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Your booking link
                        </p>
                        <p className="text-sm text-gray-900 font-mono truncate">
                          {userLink}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="h-8 px-3"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(userLink, '_blank')}
                          className="h-8 px-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={loading || !username.trim()}
                  className="flex text-white w-32 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Updating..." : "Update Username"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
