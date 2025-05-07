import React, { useState, useRef, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import Tooltip from "../ui/Tooltip";

interface SavingsGoalTrackerProps {
  currentSavings: number;
  estimateGoal: number;
}

const SavingsGoalTracker: React.FC<SavingsGoalTrackerProps> = ({
  currentSavings,
  estimateGoal,
}) => {
  const goals = [
    {
      type: "LONG-TERM GOAL",
      title: "Home Buying Expense",
      current: currentSavings || 0,
      total: estimateGoal || 0,
      months: 0,
      saved: 0,
      completed: true,
      durationType: "years",
    },
  ];
  const [sliderValues, setSliderValues] = useState(
    goals.map((goal) => goal.months || 1)
  );

  const getBarWidth = (value: number, max: number) => `${(value / max) * 100}%`;

  return (
    <div className="bg-white shadow rounded-2xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[24px] font-normal text-[#2A2A33] mb-8 w-6/8">
          Estimated Home Buying <br />
          <div className="flex items-center ">
            Expenses
            <Tooltip text="Savings for Deposit, Agent Commissions, Closing costs (expenses associated with finalizing a transaction, including document processing fees, legal services, taxes, and other payments)">
              <img
                src="/dashboard/info.png"
                alt="Information"
                className="cursor-pointer ml-2"
              />
            </Tooltip>{" "}
          </div>
        </h2>
      </div>

      {goals.map((goal, idx) => (
        <div key={idx} className="mb-10 mt-10">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1 text-[20px]  text-[#2A2A33] ">
              ${goal.current.toLocaleString()}/${goal.total.toLocaleString()}
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-[#D9D9D9] mb-2">
            <div
              className={`h-full rounded-full ${
                goal.completed ? "bg-[#1976E1]" : "bg-[#D9D9D9]"
              }`}
              style={{ width: getBarWidth(goal.current, goal.total) }}
            ></div>
          </div>
          <div className="flex justify-start text-sm text-gray-700">
            <span>Estimated TImeLine To Reach Goal: &nbsp;</span>

            <span className="font-medium"> {goal.months} Months</span>
          </div>
        </div>
      ))}

      <div className="text-[16px] text-[#1976E1] font-normal flex justify-start items-center">
        <a href="#">Want to achieve your goals earlier? Get suggestions</a>
        <img className="cursor-pointer" src="/dashboard/side-5-1.png" alt="" />
      </div>
    </div>
  );
};

export default SavingsGoalTracker;
