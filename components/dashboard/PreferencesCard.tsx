import React from "react";
import { useState } from "react";
const PreferencesCard = () => {
  const [budgetType, setBudgetType] = useState<"total" | "annual" | "monthly">(
    "total"
  );

  const estimatedBudgetValue = 0;
  const [isHomePriceDialogOpen, setIsHomePriceDialogOpen] = useState(false);
  const [homePriceInput, setHomePriceInput] = useState<number | null>(null);
  const [zipcode, setzipcode] = useState<number | null>(0);

  return (
    <div className=" w-full min-w-[450px]   bg-white rounded-lg p-6 shadow-sm ">
      <div className="flex justify-between mb-15 items-center">
        <div className="flex items-center">
          <h2 className="text-[24px] font-normal text-[#2A2A33] mr-1 ">
            Your Property Preferences{" "}
          </h2>
          <div className="relative inline-block">
            <div className="group relative inline-block">
              <img
                src="/dashboard/info.png"
                alt="Info"
                className="cursor-pointer"
              />
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[350px] bg-white text-[#2A2A33] text-sm p-3 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10">
                Savings for Deposit, Agent Commissions, Closing costs (expenses
                associated with finalizing a transaction, including document
                processing fees, legal services, taxes, and other payments)
              </div>
            </div>
          </div>
        </div>
        <img
          src="/dashboard/edit.png"
          alt="Edit"
          className=" cursor-pointer"
          onClick={() => {
            setHomePriceInput(parseInt("0") || 0);
            setIsHomePriceDialogOpen(true);
          }}
        />
        {isHomePriceDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2a337a] bg-opacity-50">
            <div className="bg-white p-15 max-w-[557px] w-full max-h-[480px] h-fit text-[#2A2A33] shadow-lg relative">
              <button
                className="absolute top-4 right-4 text-3xl text-black hover:text-gray-700"
                onClick={() => setIsHomePriceDialogOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-[24px] font-bold mb-6">
                Modify Your Property Preferences
              </h2>
              <div>
                Property Price You’re Considering
                <input
                  type="string"
                  className="w-full border border-[#cecece] rounded-lg p-2 text-black mb-5 h-[48px]"
                  value={`$ ${homePriceInput?.toLocaleString()}`}
                  onChange={(e) =>
                    setHomePriceInput(
                      parseInt(e.target.value.replace(/\D/g, ""))
                    )
                  }
                />
              </div>
              <div className="mt-6">
                Zip Code of the Area You're Exploring{" "}
                <input
                  type="string"
                  className="w-full border border-[#cecece] rounded-lg p-2 text-black mb-5 h-[48px]"
                  value={` ${zipcode}`}
                  onChange={(e) =>
                    setzipcode(parseInt(e.target.value.replace(/\D/g, "")))
                  }
                />
              </div>

              <div className="flex justify-between gap-4 mt-15">
                <button
                  className="px-4 py-1 border rounded-lg w-[200px] h-[55px] text-[#1976E1] border-[#1976E1] text-[18px]"
                  onClick={() => setIsHomePriceDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-[#1976E1] text-white rounded-lg w-[200px] text-[18px]"
                  onClick={() => {
                    if (homePriceInput !== null) {
                      // updateHomePriceMutation.mutate(homePriceInput);
                    }
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg w-full mb-5 ">
        <div className="flex justify-between items-center">
          <p className="text-[16px] text-[#2A2A33] mb-1">
            Property Monthly Rent Price You’re Considering{" "}
          </p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className=" w-full p-3 text-[18px] text-[#2A2A33]  rounded-lg border border-[#D9D9D9]">
            ${parseInt("0").toLocaleString() || 0}
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg w-full ">
        <div className="flex justify-between items-center">
          <p className="text-[16px] text-[#2A2A33] mb-1">
            Zip Code of the Area You're Exploring{" "}
          </p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className=" w-full p-3 text-[18px] text-[#2A2A33]  rounded-lg border border-[#D9D9D9]">
            0
          </span>
        </div>
      </div>
    </div>
  );
};
export default PreferencesCard;
