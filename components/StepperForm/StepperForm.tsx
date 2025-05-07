"use client";

import { useState, useEffect } from "react";
import StepperSidebar from "./StepperSidebar";
import StepperStep from "./StepperStep";
import StepperDialog from "./StepperDialog";
import { useBankConnection } from "../../hooks/useBankConnection";
import { steps } from "../../utils/constants";
import { useUser, useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useUserGoal } from "@/context/UserGoalProvider";

export default function StepperForm() {
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") || "1");
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [connectedBanks, setConnectedBanks] = useState<
    { name: string; icon: string | null }[]
  >([]);
  const { selectedGoal } = useUserGoal();

  const { getToken } = useAuth();
  const {
    isDialogOpen,
    closeDialog,
    handleBankConnect,
    authorizationCode,
    externalUser_id,
  } = useBankConnection();

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Reset step to 1 if no goal is selected
  useEffect(() => {
    if (!selectedGoal && currentStep > 1) {
      setCurrentStep(1);
    }
  }, [selectedGoal, currentStep]);

  useEffect(() => {
    const handleVisaMessage = async (event: MessageEvent) => {
      if (event.data?.source === "visa-sdk") {
        const { code, credentialsId } = event.data;
        console.log("Received from iframe:", code, credentialsId);

        try {
          const token = await getToken();
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tink/callback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                code: code,
                credentials_id: credentialsId,
                external_user_id: externalUser_id,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to send data to backend");
          }

          const result = await response.json();
          console.log("Backend response:", result);
          if (result?.bankData) {
            setConnectedBanks((prev) => [...prev, result.bankData]);
          }
        } catch (error) {
          console.error("Error sending to backend:", error);
        }
        closeDialog?.();
        nextStep();
      }
    };

    window.addEventListener("message", handleVisaMessage);

    return () => {
      window.removeEventListener("message", handleVisaMessage);
    };
  }, [closeDialog]);

  return (
    <div className="flex p-8 h-[95%] relative ">
      <StepperSidebar steps={steps} currentStep={currentStep} />
      <StepperStep
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        handleBankConnect={handleBankConnect}
        connectedBanks={connectedBanks}
      />
      {isDialogOpen && (
        <StepperDialog
          authorizationCode={authorizationCode}
          closeDialog={closeDialog}
        />
      )}
    </div>
  );
}
