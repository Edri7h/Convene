import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react'; // Example using lucide-react for icons

// A list of your app's key integrations.
// Make sure to add the corresponding SVG logo files to your `public/icons/` directory.
const integrations = [
  { name: 'Google Calendar', path: '/icons/google-calendar.svg' },
  { name: 'Google Meet', path: '/icons/google-meet.svg' },
  { name: 'Outlook Calendar', path: '/icons/outlook.svg' },
  { name: 'Microsoft Teams', path: '/icons/teams.svg' },
  { name: 'Zoom', path: '/icons/zoom.svg' },
  { name: 'Slack', path: '/icons/slack.svg' },
];

const IntegrationsSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-screen-xl px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text Content Column */}
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <Briefcase className="h-4 w-4" />
              Seamless Integrations
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              All your tools, <br />
              perfectly in sync.
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Convene connects with your favorite calendar and meeting apps.
              Automatically create Google Meet events and manage your entire
              schedule without leaving the platform.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                Explore Features
              </button>
            </div>
          </div>

          {/* Icon Grid Column */}
          <div className="relative flex items-center justify-center">
            {/* Background decorative grid */}
            <div className="absolute h-full w-full -translate-x-4 -translate-y-4">
              <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-4">
                <div className="h-full w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-700"></div>
                <div className="h-full w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-700"></div>
                <div className="h-full w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-700"></div>
                <div className="h-full w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-700"></div>
                <div className="h-full w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-700"></div>
                <div className="h-full w-full rounded-lg border border-dashed border-gray-200 dark:border-gray-700"></div>
              </div>
            </div>

            {/* Foreground icon grid */}
            <div className="relative grid grid-cols-2 grid-rows-3 gap-4">
              {integrations.map((app) => (
                <div
                  key={app.name}
                  className="flex h-24 w-24 items-center justify-center rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10"
                >
                  <img
                    src={app.path}
                    alt={`${app.name} Logo`}
                    className="h-10 w-10"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
