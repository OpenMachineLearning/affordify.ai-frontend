"use client";

import { useDemo } from "@/context/DemoProvider";
import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function Home() {
  const { enterDemo } = useDemo();
  const router = useRouter();

  const startDemo = () => {
    enterDemo();
    router.push("/onboarding"); // Or wherever your demo starts
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <SignIn
        signUpUrl="/sign-up"
        afterSignInUrl="/sign-up/complete"
        afterSignUpUrl="/sign-up/complete"
        routing="hash"
      />
      <p className="text-[#2A2A33] text-[14px] mt-7">or</p>
      <div
        onClick={startDemo}
        className="w-[430px] h-[46px] rounded-xl text-[#1976E1] font-semibold border-1 border-[#1976E1] flex justify-center items-center mt-7 cursor-pointer"
      >
        Explore Demo Mode
      </div>
    </div>
  );
}
