import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

import { Toaster } from "sonner";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Convene",
  description: "Book and manage meetings effortlessely",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

      
         <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* <Navbar/> */}
        
           <Navbar/>
          {children}
          <Toaster/>
        
        </body>
      </html>
       

    </ClerkProvider>
  );
}
