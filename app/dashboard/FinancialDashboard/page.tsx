"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import IncomeDonutChart from "@/components/dashboard/FinancialDashboard/IncomeDonutChart";
import SavingsBarChart from "@/components/dashboard/FinancialDashboard/SavingBarchart";
import ExpenseDonutChart from "@/components/dashboard/FinancialDashboard/ExpenseDonutChart";
import IncomeVsExpensesLineChart from "@/components/dashboard/FinancialDashboard/IncomeVsExpenseLineChart";

export default function FinancialDashboard() {
  const { getToken } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/main/financial-summary`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="text-black ">Loading...</div>;
  }

  if (error) {
    return toast.error(
      "There were some error while connecting with the server"
    );
  }

  return (
    <div className="space-y-5 h-auto min-w-[1230px] ">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-[#2A2A33]">
          Your Financial Summary
        </h2>
        <div className="flex gap-3">
          <button className="bg-white border border-[#1976E1] text-[#1976E1] font-semibold  px-6 py-3 rounded-xl text-[16px] ">
            See as JSON
          </button>
          <button className="bg-white border border-[#1976E1] text-[#1976E1] font-semibold  px-6 py-3 rounded-xl text-[16px] ">
            Generate Report (3 left)
          </button>
        </div>
      </div>

      {/* Top Row */}
      <div className="flex justify-between gap-4">
        <IncomeDonutChart />
        <SavingsBarChart
          bankSavings={data.bankSaving}
          cashSavings={data.cashSaving}
          ExtraIncome={data.extraIncome}
        />
      </div>

      {/* Line Chart */}
      <div className="flex justify-between gap-4">
        <div className="w-[65%]">
          <IncomeVsExpensesLineChart />
        </div>
        <div className="w-[35%]">
          <ExpenseDonutChart />
        </div>
      </div>
    </div>
  );
}
