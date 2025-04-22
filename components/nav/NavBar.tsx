"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useDemo } from "@/context/DemoProvider";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { isDemo } = useDemo();

  const goLive = () => {
    router.push("/sign-up");
  };

  return (
    <div className="flex justify-between items-center p-4 h-19 border-b shadow-sm bg-white unset top-0 w-full min-w-[1557px]">
      <Link href="/">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="Affordify AI" width={171} height={44} />
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : isDemo ? (
          <div
            onClick={goLive}
            className="flex justify-center items-center w-[261px] h-[43px] text-white text-[18px] bg-[#1976E1] rounded-xl cursor-pointer"
          >
            Sign Up to Live Mode
          </div>
        ) : null}
      </div>
    </div>
  );
}
