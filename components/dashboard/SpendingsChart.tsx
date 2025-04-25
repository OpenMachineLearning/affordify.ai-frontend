// app/components/charts/IncomeVsExpensesLineChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
const data = [
  { day: "Day 3", thisMonth: 20, lastMonth: 10 },
  { day: "Day 6", thisMonth: 120, lastMonth: 500 },
  { day: "Day 9", lastMonth: 280 },
  { day: "Day 12", lastMonth: 450 },
  { day: "Day 15", lastMonth: 120 },
  { day: "Day 18", lastMonth: 0 },
  { day: "Day 21", lastMonth: 110 },
  { day: "Day 24", lastMonth: 660 },
  { day: "Day 27", lastMonth: 60 },
  { day: "Day 31", lastMonth: 100 },
];

export default function SpendingsChart() {
  return (
    <div className="w-full h-full bg-white p-4 rounded-xl shadow-sm">
      <div className="flex flex-col">
        <h3 className="text-[24px] text-[#2A2A33] font-semibold">Spendings</h3>
        <span className="text-[10px] text-[#ACACAC]">
          this month vs last month
        </span>
      </div>
      <div className="flex gap-x-5 mb-5 mt-4">
        <h2 className="flex items-center text-[14px] text-[#2A2A33]">
          <div className="w-3 h-3 bg-[#1976E1] rounded-full mr-3"></div> This
          Month
        </h2>
        <h2 className="flex items-center text-[14px] text-[#2A2A33]">
          <div className="w-3 h-3 bg-[#ACACAC] rounded-full mr-3"></div> Last
          Month
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} width={600} height={300}>
          <XAxis dataKey="day" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <Line
            type="linear"
            dataKey="thisMonth"
            stroke="#1976E1"
            dot={false}
          />
          <Line
            type="linear"
            dataKey="lastMonth"
            stroke="#ACACAC"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
