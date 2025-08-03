// "use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
// import { saveUserToDb } from "@/lib/saveUserToDb";
import InitUser from "./InitUser";
import { saveUserToDb } from "@/app/actions/saveUser";

export default async function  Navbar() {
  // await saveUserToDb();
  await saveUserToDb();
  return (
    <nav className="w-full border-b px-4 py-3 flex items-center justify-between">
      {/* <InitUser/> */}
      {/* Logo / App name */}
      <Link href="/" className="text-xl font-semibold">
        BookWithMe
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
            <Button className="w-24" size="lg">Create</Button>
          <UserButton  appearance={{
    elements: {
      userButtonAvatarBox: "w-100 h-30", // Increase width/height
    },
  }} />
        </SignedIn>
      </div>
    </nav>
  );
}
