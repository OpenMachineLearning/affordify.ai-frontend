// app/components/charts/IncomeVsExpensesLineChart.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Data = [
  { name: "Jan 24", income: 6600, expenses: 4600 },
  { name: "Feb", income: 6450, expenses: 4200 },
  { name: "Mar", income: 6400, expenses: 3800 },
  { name: "Apr", income: 6550, expenses: 3500 },
  { name: "May", income: 6700, expenses: 3000 },
  { name: "Jun", income: 6800, expenses: 2800 },
  { name: "Jul", income: 6800, expenses: 3200 },
  { name: "Aug", income: 6700, expenses: 4200 },
  { name: "Sep", income: 6650, expenses: 4800 },
  { name: "Oct", income: 6750, expenses: 5000 },
  { name: "Nov", income: 6900, expenses: 5200 },
  { name: "Dec", income: 7000, expenses: 4700 },
  { name: "Jan 25", income: 6850, expenses: 4300 },
  { name: "Feb", income: 6700, expenses: 4000 },
];

export default function IncomeVsExpensesLineChart() {
  return (
    <div className="w-full h-full bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-[22px] text-[#2A2A33] font-semibold">
        Average Disposable Funds
      </h3>
      <div className="flex gap-x-5 mb-5 mt-2">
        <h2 className="flex items-center text-[14px] text-[#2A2A33]">
          <div className="w-3 h-3 bg-[#1E5A9F] rounded-full mr-3"></div> Incomes
        </h2>
        <h2 className="flex items-center text-[14px] text-[#2A2A33]">
          {" "}
          <div className="w-3 h-3 bg-[#0AD0C3] rounded-full mr-3"></div>{" "}
          Expenses
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={Data} width={600} height={300}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#1976E1"
            fill="#1976E1"
            fillOpacity={0.05}
            dot={{ fill: "#1976E1", strokeWidth: 5, r: 3 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#0AD0C3"
            fill="#0AD0C3"
            fillOpacity={0.1}
            dot={{ fill: "#f87171", strokeWidth: 5, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
