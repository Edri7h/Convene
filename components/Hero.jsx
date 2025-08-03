import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Text Section */}
      <div className="flex flex-col justify-center px-6 py-16 lg:py-0 space-y-6 max-w-2xl mx-auto lg:mx-0">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          Book 1:1 Meetings Effortlessly
        </h1>
        <p className="text-muted-foreground text-lg">
          Create events, set your availability, and share your link — let others book time with you in just a few clicks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <Button size="lg">Create</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Background Image */}
      <div
        className="hidden lg:block w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/generated-image.png')", // Replace with your actual image path
        }}
      />
    </section>
  );
}
