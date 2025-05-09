import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import NavBar from "../components/nav/NavBar";
import { QueryProvider } from "@/providers/QueryProvider";
import { DemoProvider } from "@/context/DemoProvider";
import { UserGoalProvider } from "@/context/UserGoalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affordify AI",
  description: "scoring affordibility",
  icons: {
    icon: "/favicon.png", // Path to your favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "blue",
          colorText: "black",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white h-[90vh]`}
        >
          <DemoProvider>
            <UserGoalProvider>
              <Toaster position="top-right" />
              <NavBar />
              <QueryProvider>
                <div className="flex h-fit">
                  <main className="flex justify-center items-center w-[100%]  max-h-full  ">
                    {children}
                  </main>
                </div>
              </QueryProvider>
            </UserGoalProvider>
          </DemoProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
