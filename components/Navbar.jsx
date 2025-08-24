"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { saveUserToDb } from "@/app/actions/saveUser";

export default function Navbar() {
  useEffect(() => {
    // Save user to DB only once after mount
    (async () => {
      try {
        await saveUserToDb();
      } catch (err) {
        console.error("Failed to save user:", err);
      }
    })();
  }, []);

  return (
    <nav className="w-full border-b px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-xl font-semibold">
        Convene
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-100 h-30",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}
