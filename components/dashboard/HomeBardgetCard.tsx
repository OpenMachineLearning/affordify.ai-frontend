import React, { useState } from "react";
import Tooltip from "../ui/Tooltip";

interface HomeBardgetCardProps {
  estimatedBudget?: {
    total: number;
    annual: number;
    monthly: number;
  };
}

const HomeBardgetCard: React.FC<HomeBardgetCardProps> = ({
  estimatedBudget,
}) => {
  const [budgetType, setBudgetType] = useState<"total" | "annual" | "monthly">(
    "total"
  );

  // Dynamically get the selected value, defaulting to 0 if undefined
  const estimatedBudgetValue = estimatedBudget?.[budgetType] ?? 0;

  const [isHomePriceDialogOpen, setIsHomePriceDialogOpen] = useState(false);
  const [homePriceInput, setHomePriceInput] = useState<number | null>(null);

  return (
    <div className="w-full min-w-[450px] bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-[24px] font-normal text-[#2A2A33] mb-8">
        Estimated Home budget <br />
        <div className="flex items-center space-x-1">
          <span>you can afford</span>
          <Tooltip text="Your monthly rental budget based on your actual income and expenses. Helps you understand what rent is realistically manageable">
            <img
              src="/dashboard/info.png"
              alt="Information"
              className="cursor-pointer"
            />
          </Tooltip>
        </div>
      </h2>

      <div>
        <div className="mt-5">
          <div className="flex justify-between items-center mt-2.5 space-x-3">
            <span className="w-1/2 p-3 text-[20px] text-[#2A2A33] font-bold rounded-lg">
              ${estimatedBudgetValue.toLocaleString()}
            </span>
            <select
              value={budgetType}
              onChange={(e) =>
                setBudgetType(e.target.value as "total" | "annual" | "monthly")
              }
              className="text-[14px] text-[#2A2A33] border border-[#D9D9D9] rounded-lg px-2 py-3 w-1/2 outline-none"
            >
              <option value="total">Total</option>
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBardgetCard;
