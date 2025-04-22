"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { mutate } from "swr";

import MoneyManagementRating from "@/components/dashboard/MoneyManagementRating";
import AffordabilityScoreChart from "@/components/dashboard/AffordabilityScoreChart";
import AccountTable from "@/components/dashboard/AccountTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  homeExpense?: number;
}

export default function AffordabilityDashboard() {
  const { getToken } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["affordability"],
    queryFn: async () => {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/main/affordability-score`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.json();
    },
  });

  //Savings dialog
  const [estimatedGoal, setEstimatedGoal] = useState<number>(
    data?.estimatedGoal || 0
  );
  const [selectedSources, setSelectedSources] = useState({
    bankSavings: true,
    cashSavings: false,
    extraIncome: false,
  });
  const [savingsSources, setSavingsSources] = useState({
    bank: 0,
    cash: 0,
    extra: 0,
  });

  useEffect(() => {
    if (data) {
      setEstimatedGoal(data?.estimatedGoal || 0);
      setSavingsSources({
        bank: data?.bankSaving || 0,
        cash: data?.cashSaving || 0,
        extra: data?.extraIncome || 0,
      });
    }
  }, [data]);
  const currentSaving =
    (selectedSources.bankSavings ? savingsSources.bank : 0) +
    (selectedSources.cashSavings ? savingsSources.cash : 0) +
    (selectedSources.extraIncome ? savingsSources.extra : 0);

  const totalSavings =
    (savingsSources.bank || 0) +
    (savingsSources.cash || 0) +
    (savingsSources.extra || 0);

  const [budgetType, setBudgetType] = useState<"total" | "annual" | "monthly">(
    "total"
  );

  const estimatedBudgetValue =
    data?.affordData?.estimatedBudget?.[budgetType] || 0;

  const current = data?.currentSaving || 0;
  const goal = data?.estimatedGoal || 0;
  const max = data?.estimatedGoal || 32000;

  const MonthlySavings = data?.affordData?.monthlySaving || 0;
  const EstimateTimeline = data?.affordDta?.estimateMonthCount || 0;

  const currentPercent = (current / max) * 100;
  const goalPercent = (goal / max) * 100;
  const tickSteps = [0, 5000, 10000, 15000, 20000, 25000, 30000];

  const updateExpensesGoalMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/main/affordability-score/update-expensesGoal`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estimatedGoal,
            currentSaving,
            bankSaving: savingsSources.bank,
            cashSaving: savingsSources.cash,
            extraIncome: savingsSources.extra,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update expense goal");
      }

      queryClient.invalidateQueries({ queryKey: ["affordability"] });
      return res.json();
    },
    onSuccess: () => {
      setIsDialogOpen(false);
    },
  });

  //Dialog for homeprice
  const [isHomePriceDialogOpen, setIsHomePriceDialogOpen] = useState(false);
  const [homePriceInput, setHomePriceInput] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const updateHomePriceMutation = useMutation({
    mutationFn: async (newPrice: number) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/main/affordability-score/update-houseCost`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ homePrice: newPrice }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update home price");
      }
      queryClient.invalidateQueries({ queryKey: ["affordability"] });
      return res.json();
    },
    onSuccess: () => {
      setIsHomePriceDialogOpen(false);
    },
  });

  return (
    <div className="min-h-full space-y-5 min-w-[1230px] ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#2A2A33] ">
          Affordability Dashboard
        </h1>
        <div className="flex justify-end gap-4  min-w-[700px]">
          <button className="bg-white border border-[#1976E1] text-[#1976E1] font-semibold  px-6 py-3 rounded-xl text-[18px] ">
            See as JSON
          </button>
          <button className="bg-white border border-[#1976E1] text-[#1976E1]  font-semibold px-6 py-3 rounded-xl text-[18px]">
            Generate Report
          </button>
          <button className="bg-[#1976E1] border border-[#1976E1] text-white font-semibold px-6 py-3 rounded-xl text-[18px] flex items-center">
            <img
              src="./dashboard/user-plus-white.png"
              className="w-4 h-4 mr-1"
            />{" "}
            Invite New Member
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="flex w-full flex-col justify-between space-y-4">
            {/* Row 1 */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm w-full md:w-[48%]">
                <div className="flex justify-between items-center">
                  <p className="text-[24px] text-[#2A2A33] mb-1">
                    Property of Interest cost
                  </p>
                  <img
                    src="./dashboard/edit.png"
                    alt="Edit"
                    className=" cursor-pointer"
                    onClick={() => {
                      setHomePriceInput(parseInt(data?.homePrice) || 0);
                      setIsHomePriceDialogOpen(true);
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="bg-[#EFF6FD] w-full p-3 text-[20px] text-[#2A2A33] font-bold rounded-xl">
                    ${parseInt(data?.homePrice).toLocaleString() || 0}
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
                        setHomePriceInput(
                          parseInt(e.target.value.replace(/\D/g, ""))
                        )
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
                            updateHomePriceMutation.mutate(homePriceInput);
                          }
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg p-4 shadow-sm w-full md:w-[48%]">
                <div className="flex justify-between ">
                  <p className="text-[24px] text-[#2A2A33] mb-1">
                    Estimated Budget you can afford
                  </p>
                  <select
                    value={budgetType}
                    onChange={(e) =>
                      setBudgetType(
                        e.target.value as "total" | "annual" | "monthly"
                      )
                    }
                    className="text-sm text-[#2A2A33] border rounded px-2 py-1 h-[30px]"
                  >
                    <option value="total">Total</option>
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-[36px] text-[#2A2A33] font-bold">
                    ${estimatedBudgetValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm w-full md:w-[48%]">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <h3 className="text-[24px] font-semibold text-[#2A2A33] flex items-center">
                      Home Buying Expense Goal
                    </h3>
                    <div className="relative group items-center">
                      <img
                        src="./dashboard/info.png"
                        className="ml-1 cursor-pointer"
                        alt="info"
                      />
                      <div className="absolute top-[-153px] mt-2 -left-71 z-50 w-[317px] p-4 bg-white border border-gray-200 rounded-lg text-sm text-[#2A2A33] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Savings for Deposit, Agent Commissions, Closing costs
                        (expenses associated with finalizing a transaction,
                        including document processing fees, legal services,
                        taxes, and other payments)
                        <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-white border-l border-b border-gray-300 rotate-315 "></div>
                      </div>
                    </div>
                  </div>
                  <img
                    src="./dashboard/edit.png"
                    className=" cursor-pointer"
                    alt="edit"
                    onClick={() => setIsDialogOpen(true)}
                  />
                </div>
                <div className="flex gap-x-5 mb-5 mt-2">
                  <h2 className="flex items-center text-[14px] text-[#2A2A33]">
                    <div className="w-3 h-3 bg-[#1976E1] rounded-full mr-3"></div>{" "}
                    Disposable Funds
                  </h2>
                  <h2 className="flex items-center text-[14px] text-[#2A2A33]">
                    {" "}
                    <div className="w-3 h-3 bg-[#D9D9D9] rounded-full mr-3"></div>{" "}
                    Estimated Goal
                  </h2>
                </div>

                <div className="w-full max-w-[640px] px-4 py-6 mx-auto">
                  {/* Top Labels */}
                  <div className="relative h-10 mb-5">
                    <div
                      className="absolute text-center top-4"
                      style={{
                        left: `${currentPercent}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="text-[18px] font-semibold text-[#1976E1]">
                        ${current.toLocaleString()}
                      </div>
                    </div>

                    <div
                      className="w-[100px] absolute text-right top-[-10px]"
                      style={{
                        left: `${goalPercent}%`,
                        transform: "translateX(-96%)",
                      }}
                    >
                      <div className="text-[14px] text-neutral-900">
                        ${goal.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-[24px] bg-gray-100">
                    {/* Current Marker */}
                    <div
                      className="absolute top-[-43px] h-[98px] flex flex-col items-center"
                      style={{
                        left: `${0}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="h-25 border-1  border-[#D9D9D9] mt-[2px]" />
                    </div>
                    {/* Filled Bar */}
                    <div
                      className="absolute h-[24px]  bg-[#1976E1]"
                      style={{ width: `${currentPercent}%` }}
                    />

                    {/* Current Marker */}
                    <div
                      className="absolute top-[-13px] h-[63px] flex flex-col items-center"
                      style={{
                        left: `${currentPercent}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="w-[6px] h-[6px] rounded-full bg-[#1976E1]" />
                      <div className="h-14 border-1 border-dashed border-[#1976E1] mt-[2px]" />
                    </div>

                    {/* Goal Marker */}
                    <div
                      className="absolute top-[-50px] flex flex-col items-center"
                      style={{
                        left: `${goalPercent}%`,
                        transform: "translateX(-40%)",
                      }}
                    >
                      <div className="w-[6px] h-[6px] rounded-full bg-[#D9D9D9]" />
                      <div className="h-23 border-l border-dashed border-[#D9D9D9] mt-[2px]" />
                    </div>
                  </div>

                  {/* Tick Axis */}
                  <div className="relative mt-1 h-6">
                    {/* Horizontal Line */}
                    <div className="absolute top-5 left-0 w-full h-[1px] bg-gray-300" />

                    {/* Ticks and Labels */}
                    {tickSteps.map((val, index) => {
                      const percent = (val / max) * 100;
                      return (
                        <div
                          key={val}
                          className="absolute flex flex-col items-center"
                          style={{
                            left: `${percent}%`,
                            top: "16px",
                            transform: "translateX(-50%)",
                          }}
                        >
                          <div className="h-[9px] w-px bg-gray-400" />
                          <div className="text-xs text-gray-800 mt-1">
                            {val.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#EFF6FD] p-3 rounded-xl text-[#2A2A33] text-[16px] mt-4 mb-3">
                  <p>
                    Estimated Timeline:{" "}
                    <strong>{EstimateTimeline} Months</strong>
                  </p>
                  <p>
                    Monthly Savings: <strong>${MonthlySavings}</strong>
                  </p>
                </div>

                <a href="#" className="text-[16px] text-[#1976E1] ">
                  Want to achieve your goal earlier? Get suggestions
                </a>
              </div>
              {/* Dialog for Editing Savings Goal */}
              {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2a337a] bg-opacity-50">
                  <div className="bg-white p-15 max-w-[550px] h-[760px] w-full text-[#2A2A33] shadow-lg relative">
                    <button
                      className="absolute top-4 right-4 text-3xl  text-black hover:text-gray-700"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      &times;
                    </button>
                    <h2 className="text-[24px] text-[#2A2A33] font-bold mb-6">
                      Modify Savings and Savings Goal
                    </h2>
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-[18px] text-[#2A2A33] ">
                        Enter Home Expenses Amount
                      </h3>
                      <div className="relative group items-center">
                        <img
                          src="./dashboard/info.png"
                          className="ml-1 w-4 h-4 cursor-pointer "
                          alt="info"
                        />

                        <div className="absolute top-[-125px] mt-2 -left-75 z-50 w-[330px] h-[105px] p-2 bg-white border border-gray-200 rounded-lg text-[14px] text-[#2A2A33] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Savings for Deposit, Agent Commissions, Closing costs
                          (expenses associated with finalizing a transaction,
                          including document processing fees, legal services,
                          taxes, and other payments)
                          <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-white border-l border-b border-gray-300 rotate-315 "></div>
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      className="w-2/3 border border-[#cecece] rounded-lg p-2 px-3 text-[#2A2A33] mb-5 h-[50px]"
                      value={`$ ${estimatedGoal.toLocaleString()}`}
                      onChange={(e) =>
                        setEstimatedGoal(
                          parseInt(e.target.value.replace(/\D/g, "")) || 0
                        )
                      }
                    />

                    <label className="font-semibold block mb-2  text-[18px] text-[#2A2A33]">
                      Savings for Home Purchase Expenses
                    </label>
                    <input
                      className="w-2/3 border border-[#cecece] rounded-lg p-2 text-[#2A2A33]  px-3 h-[50px]"
                      type="text"
                      value={`$ ${currentSaving.toLocaleString()}`}
                    />

                    <label className="block mb-2 text-[18px] text-[#2A2A33] font-semibold mt-8">
                      Savings Sources
                    </label>
                    <div className="space-y-3">
                      {/* Bank Savings */}
                      <div className="flex justify-between items-start h-[52px]">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            className="w-5 h-5"
                            checked={selectedSources.bankSavings}
                            onChange={() =>
                              setSelectedSources((prev) => ({
                                ...prev,
                                bankSavings: !prev.bankSavings,
                              }))
                            }
                          />
                          <div>
                            <div className="font-semibold text-[14px] text-[#2A2A33]">
                              Bank Savings
                            </div>
                            <div className="text-[#2A2A33] text-sm ">
                              I have money in my bank account
                            </div>
                          </div>
                        </div>
                        {selectedSources.bankSavings && (
                          <input
                            className="w-3/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 h-[50px] px-3"
                            type="text"
                            value={`$ ${savingsSources.bank.toLocaleString()}`}
                            onChange={(e) =>
                              setSavingsSources({
                                ...savingsSources,
                                bank: parseInt(e.target.value || "0"),
                              })
                            }
                          />
                        )}
                      </div>

                      {/* Cash Savings */}
                      <div className="flex justify-between items-start  h-[52px]">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            className="w-5 h-5"
                            checked={selectedSources.cashSavings}
                            onChange={() =>
                              setSelectedSources((prev) => ({
                                ...prev,
                                cashSavings: !prev.cashSavings,
                              }))
                            }
                          />
                          <div>
                            <div className="font-semibold text-[14px] text-[#2A2A33]">
                              Cash Savings
                            </div>
                            <div className="text-[#2A2A33] text-sm">
                              I have savings in cash
                            </div>
                          </div>
                        </div>
                        {selectedSources.cashSavings && (
                          <input
                            className="w-3/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 h-[50px] px-3"
                            type="text"
                            value={`$ ${savingsSources.cash}`}
                            onChange={(e) =>
                              setSavingsSources({
                                ...savingsSources,
                                cash: parseInt(e.target.value || "0"),
                              })
                            }
                          />
                        )}
                      </div>

                      {/* Extra Income */}
                      <div className="flex justify-between items-start  h-[52px]">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            className="w-5 h-5"
                            checked={selectedSources.extraIncome}
                            onChange={() =>
                              setSelectedSources((prev) => ({
                                ...prev,
                                extraIncome: !prev.extraIncome,
                              }))
                            }
                          />
                          <div>
                            <div className="font-semibold text-[14px] text-[#2A2A33]">
                              Expected Extra Income
                            </div>
                            <div className="text-[#2A2A33] text-sm">
                              I expect a one-time extra income
                            </div>
                          </div>
                        </div>
                        {selectedSources.extraIncome && (
                          <input
                            className="w-3/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 h-[50px] px-3"
                            type="text"
                            value={`$ ${savingsSources.extra}`}
                            onChange={(e) =>
                              setSavingsSources({
                                ...savingsSources,
                                extra: parseInt(e.target.value || "0"),
                              })
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-13 gap-4">
                      <button
                        className="border border-[#1976E1] rounded-md text-[#1976E1] text-[18px] h-[60px] w-[208px]"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-[#1976E1] text-white rounded-md text-[18px] w-[208px]"
                        onClick={() => {
                          updateExpensesGoalMutation.mutate();
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <MoneyManagementRating
                value={parseInt(data?.affordData?.moneyManagementRating || 0)}
              />
            </div>
          </div>
          <AffordabilityScoreChart
            score={parseInt(data?.affordData?.affordabilityScore || 0)}
          />
        </div>
        {/* Row 3 */}
        <div className="flex justify-between ">
          <AccountTable />

          <div className="flex flex-col justify-between bg-white rounded-lg p-4 shadow-sm w-full md:w-[36%] ">
            <div>
              <p className="font-semibold text-[24px] mb-3 text-[#2A2A33]">
                Financial Insights
              </p>
              <ul className="list-disc pl-8 text-[16px] text-[#2A2A33] space-y-2 list-image-check flex flex-col justify-center items-center">
                <li className="">
                  A €10,000 downpayment allows you to afford a mortgage of up to
                  €1,900 per month
                </li>
                <li>
                  A €10,000 downpayment allows you to afford a mortgage of up to
                  €1,900 per month
                </li>
              </ul>
            </div>
            <a href="#" className="block mt-3 text-[16px] text-[#1976E1] ">
              Get more Insights and Suggestions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
