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
import BudgetCard from "@/components/dashboard/BardgetCard";
import HomeBardgetCard from "@/components/dashboard/HomeBardgetCard";
import SavingsGoalTracker from "@/components/dashboard/SavingGoalTracker";
import FinancialInsights from "@/components/dashboard/FinancialInsights";
import SpendingsChart from "@/components/dashboard/SpendingsChart";
import PreferencesCard from "@/components/dashboard/PreferencesCard";
import PricingPlansDialog from "@/components/pricingPlanDialog/PricingPlanDialog";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  homeExpense?: number;
}

export default function AffordabilityDashboard() {
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

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

  const { data: subscriptionData } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("https://api.affordify.ai/api/subscription/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  // welcome dialog
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // localStorage is only available in the browser
    if (typeof window !== "undefined") {
      const hasSeen = localStorage.getItem("aff_welcome_seen");
      if (!hasSeen) setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem("aff_welcome_seen", "true");
    setShowWelcome(false);
  };
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="flex flex-col justify-between mx-4 w-full max-w-[770px] h-[560px]  bg-white p-10 text-center shadow-xl items-center">
            <img src="/cel.png" alt="Party cone" className="mx-auto mb-6" />

            <h2 className="mb-2 text-[24px] font-semibold text-[#2A2A33]">
              Welcome to Your affordify.ai Dashboard!
            </h2>

            <p className="mb-6 text-[18px] w-full text-[#2A2A33] ">
              Explore your affordability insights and financial overview right
              away. <br /> Generate your full report to share with your agent,
              and upgrade anytime to <br /> unlock more tools for managing your
              money and reaching your goals faster
            </p>

            <button
              onClick={closeWelcome}
              className="rounded-lg border border-[#1976E1] bg-white px-20 py-3 text-[18px] font-semibold text-[#1976E1]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="min-h-full space-y-5 min-w-[1230px] ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-[#2A2A33] ">
              My Affordability Dashboard
            </h1>
            <p className="text-sm text-[#2A2A33]">
              This is your Free Plan dashboard.{" "}
              <u
                className="text-[#1976E1] cursor-pointer"
                onClick={() => setIsPlanDialogOpen(true)}
              >
                Upgrade
              </u>
              &nbsp;to Premium or Platinum to unlock more features and insights
            </p>
          </div>
          <div className="flex justify-end gap-4  min-w-[700px]">
            <button
              onClick={() => router.push("/affordability-scoring")}
              className="bg-[#1976E1] border border-[#1976E1] text-white font-semibold px-6 py-3 rounded-xl text-[18px] cursor-pointer"
            >
              Update Dashboard
            </button>
            <button className="bg-[#1976E1] border border-[#1976E1] text-white  font-semibold px-6 py-3 rounded-xl text-[18px] cursor-pointer">
              Generate Affordability Report
            </button>
            <div className="relative">
              <img
                className="cursor-pointer"
                src="/dashboard/collapse.png"
                alt=""
                onClick={() => setShowDropdown((prev) => !prev)}
              />
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-50 ">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        /* handle JSON download */
                      }}
                      className="flex items-center w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src="/dashboard/download.png"
                        className="w-5 h-5 mr-2"
                      />
                      Download As JSON
                    </button>
                    <button
                      onClick={() => {
                        /* handle invite */
                      }}
                      className="flex items-center w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src="/dashboard/user-plus.png"
                        className="w-5 h-5 mr-2"
                      />
                      Invite New Member
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            {/* row 1 */}
            <div className="flex w-full  justify-center space-x-4">
              {/* col 1 */}
              <div className="flex flex-col justify-between gap-4">
                <PreferencesCard
                  propertyPrice={data?.propertyPrice}
                  zipCode={data?.zipCode}
                />
                <MoneyManagementRating
                  value={parseInt(data?.affordData?.moneyManagementRating || 0)}
                />
              </div>
              {/* col 2 */}
              <div className="flex flex-col gap-4 justify-between">
                <HomeBardgetCard
                  estimatedBudget={data?.affordData?.estimatedBudget}
                />

                <FinancialInsights
                  onUpgrade={() => setIsPlanDialogOpen(true)}
                  currentPlan={subscriptionData?.subscription?.tier || "free"}
                />
              </div>
              {/* col */}
              <div className="flex flex-col gap-4 justify-between">
                <AffordabilityScoreChart
                  score={parseInt(data?.affordData?.affordabilityScore || 0)}
                />
                <SavingsGoalTracker
                  currentSavings={data?.currentSaving}
                  estimateGoal={data?.estimatedGoal}
                />
              </div>
            </div>
          </div>
          <div
            className="flex items-center justify-center border border-[#1976E1] text-[18px] text-[#1976E1] p-3 rounded-lg cursor-pointer"
            onClick={() => setIsPlanDialogOpen(true)}
          >
            Click here and get more details
          </div>
          <p className="text-[14px] text-[#2A2A33]">
            affordify.ai does not provide financial advice, nor does it solicit
            or facilitate the approval of any financial services. We are not
            responsible for the distribution or use of any data generated
            through our platform
          </p>
        </div>
        <PricingPlansDialog
          isOpen={isPlanDialogOpen}
          onClose={() => setIsPlanDialogOpen(false)}
        />
      </div>
    </>
  );
}
