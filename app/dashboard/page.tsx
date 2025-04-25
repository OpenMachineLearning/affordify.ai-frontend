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
        <div className="flex justify-center">
          {/* row 1 */}
          <div className="flex w-full  justify-center space-x-4">
            {/* col 1 */}
            <div className="flex flex-col justify-between gap-4">
              <BudgetCard />
              <SavingsGoalTracker />
            </div>
            {/* col 2 */}
            <div className="flex flex-col gap-4 justify-between">
              <HomeBardgetCard />

              <AffordabilityScoreChart
                score={parseInt(data?.affordData?.affordabilityScore || 0)}
              />
            </div>
            {/* col */}
            <div className="flex flex-col gap-4 justify-between">
              <MoneyManagementRating
                value={parseInt(data?.affordData?.moneyManagementRating || 0)}
              />
              <FinancialInsights />
            </div>
          </div>
        </div>
        {/* row 2  */}
        <div className="flex justify-center">
          <SpendingsChart />
        </div>
      </div>
    </div>
  );
}
