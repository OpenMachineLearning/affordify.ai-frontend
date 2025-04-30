"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="grid grid-cols-2 w-full h-full">
      <div className="flex flex-col items-center justify-center bg-white">
        <img src="logo.svg" alt="" />
        <div className="text-[36px] text-[#2A2A33] font-semibold mt-2">
          {" "}
          Welcome back to affordify.ai
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
          <SignIn
            signUpUrl="/sign-up"
            afterSignInUrl="/sign-up/complete"
            afterSignUpUrl="/sign-up/complete"
            routing="hash"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <img src="signinup.png" alt="" />
        <div className="text-[36px] text-[#2A2A33] flex flex-col justify-center text-center mt-11">
          Take Control of Your
          <br /> Financial Future
        </div>
        <div className="text-[#2A2A33] text-[18px] w-[590px] text-center mt-5">
          <b>
            {" "}
            Manage your savings, optimize your spending, achieve your financial
            goals{" "}
          </b>{" "}
          faster and smarter— all with AI-powered guidance <br /> available
          through upgraded plans
        </div>
        <div className="text-[14px] text-[#ACACAC] mt-11 mb-4">
          Connects to over 12,000 financial institutions in the U.S
        </div>
        <img src="logos.png" alt="" />
      </div>
    </div>
  );
}
