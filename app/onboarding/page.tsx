"use client";
import StepperForm from "../../components/StepperForm/StepperForm";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function OnboardingInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const credentialsId =
      searchParams.get("credentialsId") || searchParams.get("credentials_id");

    if (code && credentialsId) {
      window.parent.postMessage(
        {
          source: "visa-sdk",
          code,
          credentialsId,
        },
        "*"
      );
    }
  }, [searchParams]);

  return <StepperForm />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingInner />
    </Suspense>
  );
}
