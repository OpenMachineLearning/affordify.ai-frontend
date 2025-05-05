"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function AffordabilityLoading() {
  const { user } = useUser();
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/main/affordability-score`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error("Backend error");

        // Save to React Query cache

        // Animate to 100% then redirect
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 5;
          });
        }, 30);
      } catch (error) {
        toast.error("Something went wrong when connecting with the server");
      }
    };

    const slowInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(slowInterval);
        }
        return prev + 1;
      });
    }, 80);

    fetchData();

    return () => clearInterval(slowInterval);
  }, [queryClient]);
  useEffect(() => {
    if (progress >= 100) {
      router.push("/dashboard");
    }
  }, [progress, router]);

  return (
    <div className="h-[91vh] w-full flex flex-col items-center justify-start bg-white px-4">
      <div className="w-[40%] text-center flex flex-col items-center justify-center">
        <Image
          src="/affordability_loading.gif"
          alt="Affordability Illustration"
          width={450}
          height={450}
          className="mx-auto"
        />
        <h1 className="text-[40px] font-bold text-[#2A2A33] mb-8">
          Calculating Your Affordability
        </h1>
        <div className="w-full text-[16px] text-[#2A2A33] mb-15">
          {user?.fullName}, we’re analyzing your affordability based on your
          linked
          <br />
          accounts. This will only take a moment
        </div>

        <div className="w-full bg-[#D9D9D9] rounded-full h-3 mb-2">
          <div className="flex flex-col">
            <div
              className="bg-[#2286EA] h-3 rounded-full transition-all duration-300 ease-in-out flex items-center justify-end relative"
              style={{ width: `${progress}%` }}
            >
              <p className="text-[24px] text-[#2286EA] font-semibold flex justify-end pt-10 mr-[-24px]">
                {progress}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
