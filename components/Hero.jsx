"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Video } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96], // A more dramatic ease
    },
  },
};

export default function Hero() {
  return (
    <section className="w-full dark:bg-gray-900 text-white">
      <motion.div
        className="min-h-screen container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-4 py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Text Section */}
        <motion.div
          className="flex flex-col justify-center space-y-8"
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400"
            variants={itemVariants}
          >
            Transform Your Time.
            <br />
            Schedule Meetings, Not Headaches.
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-lg"
            variants={itemVariants}
          >
            Our intelligent scheduling platform automates your calendar, so you can focus on what matters. Sync your availability, share a link, and let the perfect meeting time find you.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                className="cursor-pointer border-1 border-indigo-500 text-indigo-400 hover:bg-indigo-600/20 font-semibold py-3 px-6 rounded-lg shadow-lg transform  transition-transform duration-300"
              >
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-in" passHref>
              <Button
                variant="outline"
                size="lg"
                className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white font-semibold py-3 px-6 rounded-lg "
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          <motion.div className="pt-8" variants={itemVariants}>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
              Trusted by teams at
            </p>
            <div className="flex items-center gap-6 mt-4">
              {/* Replace with your actual SVG logos for a premium look */}
              <span className="font-bold text-gray-400 text-lg">NXT.corp</span>
              <span className="font-bold text-gray-400 text-lg">Quantum</span>
              <span className="font-bold text-gray-400 text-lg">Apex</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual Section */}
        <motion.div className="hidden lg:flex items-center justify-center" variants={imageVariants}>
          <div className="relative w-full max-w-md p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10">
            <div className="flex items-center mb-4">
              <img
                src="https://i.pravatar.cc/40?u=a042581f4e29026704h" // Placeholder avatar
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-4 border-2 border-gray-600"
              />
              <div>
                <h3 className="font-semibold text-gray-100">Alex Monet</h3>
                <p className="text-sm text-gray-400">Design Lead at Quantum</p>
              </div>
            </div>
            <div className="my-6">
              <h4 className="font-bold text-xl text-gray-50">Project Kick-off</h4>
              <p className="text-gray-400 flex items-center mt-1">
                <CalendarDays className="h-4 w-4 mr-2" />
                30 Minute Meeting
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { time: "9:00 AM", available: true },
                { time: "9:30 AM", available: true },
                { time: "10:00 AM", available: false },
                { time: "10:30 AM", available: true },
                { time: "11:00 AM", available: true },
                { time: "11:30 AM", available: false },
              ].map((slot) => (
                <Button
                  key={slot.time}
                  variant={slot.available ? "outline" : "secondary"}
                  disabled={!slot.available}
                  className={`w-full ${
                    slot.available
                      ? "border-indigo-500 text-indigo-400 hover:bg-indigo-600/20"
                      : "bg-gray-700 text-gray-500"
                  }`}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
             <motion.div 
                className="absolute -top-4 -right-4 bg-white text-gray-900 p-2 rounded-full shadow-lg"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0]}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
               <Video className="h-5 w-5" />
             </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
