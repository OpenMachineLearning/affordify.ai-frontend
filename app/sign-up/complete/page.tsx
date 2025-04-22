"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpComplete() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth(); // Retrieves Clerk JWT token
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registerUser = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Get JWT token using the new template name
        const token = await getToken(); // Use the Clerk JWT template name

        const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
          {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include Clerk token in request
          },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          }),
        });

        if (response.ok) {
          console.log("User registered successfully");
        } else {
          const errorData = await response.json();
          console.error(" Registration failed:", errorData);
        }
      } catch (error) {
        console.error("Error registering user:", error);
      } finally {
        setLoading(false);
        router.push("/onboarding");
      }
    };

    if (isSignedIn && user) {
      registerUser();
    }
  }, [isSignedIn, user, router, getToken]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>{loading ? "Finalizing sign-up..." : "Redirecting..."}</p>
    </div>
  );
}
