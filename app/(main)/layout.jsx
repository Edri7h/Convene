"use client";

import Link from "next/link";
import { LayoutDashboard, CalendarDays, Users, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-24 px-4 py-6 max-w-6xl mx-auto">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

function BottomNavigation() {
  const pathname = usePathname();
  
  const navigationItems = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard 
    },
    { 
      href: "/Meetings", 
      label: "Meetings", 
      icon: CalendarDays 
    },
    { 
      href: "/Events", 
      label: "Events", 
      icon: Users 
    },
    { 
      href: "/Availability", 
      label: "Availability", 
      icon: Clock 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navigationItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center justify-center py-2 px-3 rounded-lg
                  transition-all duration-200 min-w-0 flex-1
                  ${isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-blue-600" : ""}`} />
                <span className={`
                  text-xs font-medium truncate
                  ${isActive ? "text-blue-600" : "text-gray-600"}
                `}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
