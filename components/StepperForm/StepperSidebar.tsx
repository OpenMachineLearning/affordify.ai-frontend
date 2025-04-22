import React from "react";

interface StepperSidebarProps {
  steps: { id: number; title: string }[];
  currentStep: number;
}

export default function StepperSidebar({
  steps,
  currentStep,
}: StepperSidebarProps) {
  return (
    <div className="flex flex-col items-start absolute left-[-40%]">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        return (
          <div key={step.id} className="flex items-start">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-9 h-9 flex items-center justify-center border-1 rounded-md ${
                  isActive
                    ? "bg-[#F5F5F5] text-[#2286EA] border-dashed border-[#2286EA] font-bold"
                    : isCompleted
                    ? "bg-[#2286EA] text-white border-[#2286EA]"
                    : "bg-[#F5F5F5] text-[#2A2A33] border-[#2A2A33]"
                }`}
              >
                {step.id}
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`w-[1px] h-10 ${
                    isCompleted
                      ? "bg-[#2286EA]"
                      : "bg-[#2A2A33] border-[1px] border-dashed"
                  }`}
                ></div>
              )}
            </div>
            <div className="ml-4">
              <p
                className={`text-[14px] pt-[7px] ${
                  isActive
                    ? "font-bold text-black"
                    : isCompleted
                    ? "text-black"
                    : "text-[#2A2A33]"
                }`}
              >
                {step.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
