'use client';

import { motion } from "framer-motion";
import { Sparkles, Timer, Share2 } from "lucide-react";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

const features = [
  {
    title: "Instant, Intelligent Scheduling",
    description: "Eliminate the back-and-forth emails. Let clients book the perfect time from your real-time availability.",
    icon: Sparkles,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
  {
    title: "Complete Control of Your Time",
    description: "Set custom working hours, add buffers between meetings, and block out personal time with ease.",
    icon: Timer,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
  {
    title: "Shareable, Branded Links",
    description: "Create unique event links for different meeting types. Share your link and let the bookings roll in.",
    icon: Share2,
    iconColor: "text-sky-500",
    bgColor: "bg-sky-100",
  },
];

export default function Features() {
  return (
    <section className="w-full py-24 bg-slate-50 px-4 md:px-8">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
          variants={itemVariants}
        >
          Designed for Seamless Scheduling
        </motion.h2>
        <motion.p
          className="text-slate-600 text-lg max-w-2xl mx-auto mt-4"
          variants={itemVariants}
        >
          Our platform is packed with powerful features to help you reclaim your
          day and focus on what truly matters.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 transform hover:-translate-y-2 transition-all duration-300"
              variants={itemVariants}
            >
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} mx-auto mb-6`}
              >
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                {feature.title}
              </h3>
              <p className="text-md text-slate-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
