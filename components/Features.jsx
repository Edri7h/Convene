import { CalendarCheck, Users, LinkIcon } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Instant Scheduling",
      description:
        "Let users book meetings based on your availability. Say goodbye to the back-and-forth.",
      icon: <CalendarCheck className="w-8 h-8 text-primary" />,
    },
    {
      title: "Control Your Time",
      description:
        "Set your working hours, buffer time, and prevent overlapping bookings with full control.",
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      title: "Sharable Links",
      description:
        "Each event has a public URL you can share to let others instantly book time with you.",
      icon: <LinkIcon className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <section className="w-full py-24 bg-white px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Powerful Features
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
          Everything you need to manage your time and schedule efficiently.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
