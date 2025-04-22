"use client";
import { useMemo } from "react";

import { PieChart, Pie, Cell, Tooltip, TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

const expensesData = [
  { name: "Grossery", value: 10500 },
  { name: "Car & Transportation", value: 8000 },
  { name: "House", value: 9200 },
  { name: "Entertainment", value: 4800 },
  { name: "Health", value: 4600 },
  { name: "Shopping", value: 5600 },
  { name: "Dept Payments", value: 4300 },
];

const COLORS = [
  "#085D58",
  "#159990",
  "#27B8AF",
  "#0AD0C3",
  "#75EEE6",
  "#A1FDF7",
  "#D3FFFC",
];

const total = expensesData.reduce((acc, curr) => acc + curr.value, 0);

const CustomTooltip = ({
  active,
  payload,
  coordinate,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const total = expensesData.reduce((sum, curr) => sum + curr.value, 0);
    const percent = ((value / total) * 100).toFixed(1);

    return (
      <div
        style={{
          position: "absolute",
          top: coordinate?.y ?? 0,
          left: (coordinate?.x ?? 0) + 20,
          background: "white",
          border: "1px solid #ccc",

          padding: "6px 12px",
          zIndex: "2",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          pointerEvents: "none",
          width: "140px",
        }}
      >
        <div className=" text-[#AEAFB3] text-[12px]">{name}</div>
        <div className="text-[#2A2A33] text-[16px] font-semibold">
          ${value.toLocaleString()}
        </div>
        <div className="text-[#2A2A33] text-[12px]">{percent}%</div>
      </div>
    );
  }

  return null;
};

export default function ExpenseDonutChart() {
  return (
    <div className="w-full h-full bg-white p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[22px] text-[#2A2A33] font-semibold">
          Average Disposable Funds
        </h3>
        <select className="text-sm text-[#2A2A33] border rounded px-2 py-1 h-[30px]">
          <option>Annual</option>
          <option>Month</option>
        </select>
      </div>

      <div className=" justify-center gap-x-6 gap-y-2  grid grid-cols-3">
        {expensesData.map((entry, index) => (
          <div
            key={entry.name}
            className=" items-center space-x-2 text-sm text-gray-800"
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
      <div className="relative w-[235px] h-[235px] mx-auto">
        <PieChart width={235} height={235}>
          <Pie
            data={expensesData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={105}
            dataKey="value"
            paddingAngle={0}
            stroke="none"
            labelLine={false}
          >
            {expensesData.map((entry, index) => (
              <Cell
                key={`cell-exp-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>

        {/* Center total */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center ">
          <p className="text-lg font-semibold text-gray-800">
            ${total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
      </div>

      <a
        href="#"
        className="text-[16px] text-start text-[#1976E1] font-medium mt-5 inline-block"
      >
        Get Optimization Suggestions
      </a>
    </div>
  );
}
