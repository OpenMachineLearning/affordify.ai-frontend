"use client";

import { useDemo } from "@/context/DemoProvider";
import { useRouter } from "next/navigation";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const { enterDemo } = useDemo();
  const router = useRouter();

  const startDemo = () => {
    enterDemo();
    router.push("/onboarding"); // Or wherever your demo starts
  };
  return (
    <div className="grid grid-cols-2 w-full h-[92vh]">
      <div className="flex flex-col items-center justify-center bg-white">
        <img src="logo.svg" alt="" />
        <div className="text-[36px] text-[#2A2A33] font-semibold mt-2">
          {" "}
          Welcome to affordify.ai
        </div>
        <div className="bg-[#EFF6FD] text-[18px] text-[#2A2A33] w-[33rem] p-5 rounded-2xl text-center mb-7 mt-5">
          <span className="text-[#159990] font-semibold">
            Trusted by 15,000 Americans,
          </span>
          helping every step of the way to make the best financial decisions
        </div>
        <div className="border-[1px] border-[#ACACAC] rounded-xl bg-white flex flex-col items-center pb-3 pt-10 w-fit h-fit">
          <div className="text-[#2A2A33] text-[24px] font-semibold">
            Create a FREE account to get started
          </div>
          <SignUp
            signInUrl="/"
            afterSignInUrl="/sign-up/complete"
            afterSignUpUrl="/sign-up/complete"
            routing="hash"
          />
        </div>
        <p className="text-[#2A2A33] text-[14px] mt-7">or</p>
        <div
          onClick={startDemo}
          className="w-[430px] h-[46px] rounded-xl text-[#1976E1] font-semibold border-1 border-[#1976E1] flex justify-center items-center mt-7 cursor-pointer"
        >
          Explore Demo Mode
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <img src="signinup.png" alt="" />
        <div className="text-[36px] text-[#2A2A33] flex flex-col justify-center items-center text-center mt-11">
          Affordability Today.
          <br /> Financial Confidence Tomorrow
        </div>
        <div className="text-[#2A2A33] text-[18px] w-[510px] text-center mt-5">
          Get
          <b> home buying or renting affordability in minutes. </b> Upgrade
          anytime to access savings goals, smarter money <br />
          management, and AI financial guidance
        </div>
        <div className="text-[14px] text-[#ACACAC] mt-11 mb-4">
          Connects to over 12,000 financial institutions in the U.S
        </div>
        <img src="logos.png" alt="" />
      </div>
    </div>
  );
}
