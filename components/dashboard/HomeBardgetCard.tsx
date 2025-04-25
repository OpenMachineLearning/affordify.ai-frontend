import React from "react";
import { useState } from "react";
const HomeBardgetCard = () => {
  const [budgetType, setBudgetType] = useState<"total" | "annual" | "monthly">(
    "total"
  );

  const estimatedBudgetValue = 0;
  const [isHomePriceDialogOpen, setIsHomePriceDialogOpen] = useState(false);
  const [homePriceInput, setHomePriceInput] = useState<number | null>(null);

  return (
    <div className="w-[450px]  bg-white rounded-lg p-4 shadow-sm ">
      <h2 className="text-[24px] font-normal text-[#2A2A33] mb-8">
        {" "}
        Home Budget
      </h2>
      <div className="bg-white rounded-lg w-full ">
        <div className="flex justify-between items-center">
          <p className="text-[16px] text-[#2A2A33] mb-1">
            Property of Interest cost
          </p>
          <img
            src="./dashboard/edit.png"
            alt="Edit"
            className=" cursor-pointer"
            onClick={() => {
              setHomePriceInput(parseInt("0") || 0);
              setIsHomePriceDialogOpen(true);
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="bg-[#EFF6FD] w-full p-3 text-[20px] text-[#2A2A33] font-bold rounded-xl">
            ${parseInt("0").toLocaleString() || 0}
          </span>
        </div>
      </div>
      {isHomePriceDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2a337a] bg-opacity-50">
          <div className="bg-white p-15 max-w-[550px] w-full max-h-[350px] h-full text-[#2A2A33] shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-3xl text-black hover:text-gray-700"
              onClick={() => setIsHomePriceDialogOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-[24px] font-bold mb-6">
              Modify Property Interest Cost
            </h2>

            <input
              type="string"
              className="w-full border border-[#cecece] rounded-lg p-2 text-black mb-5 h-[48px]"
              value={`$ ${homePriceInput?.toLocaleString()}`}
              onChange={(e) =>
                setHomePriceInput(parseInt(e.target.value.replace(/\D/g, "")))
              }
            />

            <div className="flex justify-between gap-4 mt-10">
              <button
                className="px-4 py-2 border rounded-md w-[200px] h-[60px] text-[#1976E1] border-[#1976E1] text-[18px]"
                onClick={() => setIsHomePriceDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#1976E1] text-white rounded-md w-[200px] text-[18px]"
                onClick={() => {
                  if (homePriceInput !== null) {
                    // updateHomePriceMutation.mutate(homePriceInput);
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="mt-5">
          <div className="flex justify-between ">
            <p className="text-[16px] text-[#2A2A33] mb-1">
              Estimated Budget you can afford
            </p>
          </div>

          <div className="flex justify-between items-center mt-2.5 space-x-3">
            <span className="bg-[#EFF6FD] w-1/2 p-3 text-[20px] text-[#2A2A33] font-bold rounded-lg">
              ${estimatedBudgetValue.toLocaleString()}
            </span>
            <select
              value={budgetType}
              onChange={(e) =>
                setBudgetType(e.target.value as "total" | "annual" | "monthly")
              }
              className="text-[20px] text-[#2A2A33] border rounded-lg px-2 py-3 w-1/2  outline-none"
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
