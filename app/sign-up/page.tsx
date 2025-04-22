"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp signInUrl="/" afterSignInUrl="/sign-up/complete"  afterSignUpUrl="/sign-up/complete" routing="hash" />;
}
