"use client";

interface Props {
  bankSavings: number;
  cashSavings: number;
  ExtraIncome: number;
}
import React, { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function SavingsBarChart({
  bankSavings,
  cashSavings,
  ExtraIncome,
}: Props) {
  const savingsData = [
    { name: "Bank Savings", value: bankSavings, fill: "#1E5A9F" },
    { name: "Cash Savings", value: cashSavings, fill: "#1976E1" },
    { name: "Expected Extra Income", value: ExtraIncome, fill: "#BCDEFF" },
  ];
  const total = savingsData.reduce((acc, curr) => acc + curr.value, 0);

  //Dialog for Savings
  const [isOpen, setIsOpen] = useState(false);

  const [bankChecked, setBankChecked] = useState(true);
  const [cashChecked, setCashChecked] = useState(true);
  const [extraChecked, setExtraChecked] = useState(true);

  const [bank, setBank] = useState(bankSavings);
  const [cash, setCash] = useState(cashSavings);
  const [extra, setExtra] = useState(ExtraIncome);

  return (
    <div className=" w-[65%] bg-white p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[22px] text-[#2A2A33] font-semibold">
          Savings & Expected Extra Income
        </h3>
        <img
          src="./edit.png"
          alt=""
          onClick={() => setIsOpen(true)}
          className="cursor-pointer"
        />
      </div>
      <p className="text-[36px] text-[#2A2A33] font-semibold mb-4">
        ${total.toLocaleString()}{" "}
        <span className="text-sm font-semibold text-[#2A2A33]">TOTAL</span>
      </p>
      <ResponsiveContainer width="100%" height={245}>
        <BarChart width={900} height={245} data={savingsData}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Bar dataKey="value" barSize={130}>
            <LabelList
              dataKey="value"
              content={({ x, y, width, value }) => {
                if (x == null || y == null || width == null || value == null)
                  return null;

                const numericY = typeof y === "string" ? parseFloat(y) : y;
                const numericX = typeof x === "string" ? parseFloat(x) : x;
                const numericWidth =
                  typeof width === "string" ? parseFloat(width) : width;

                const formatted = `$${value.toLocaleString()}`;
                const labelY = numericY < 20 ? numericY + 18 : numericY - 10;

                return (
                  <text
                    x={numericX + numericWidth / 2}
                    y={labelY}
                    fill="#2A2A33"
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={600}
                  >
                    {formatted}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50 bg-[#2a2a337a] bg-opacity-50">
          <div className="w-[550px] h-[640px] bg-white p-15 shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-3xl  text-black hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-[24px] text-[#2A2A33] font-bold mb-6">
              Modify Savings
            </h2>
            <p className="mb-2 text-sm font-semibold text-[18px] text-[#2A2A33]">
              Savings for Home Purchase Expenses
            </p>
            <input
              type="text"
              readOnly
              value={`$${
                (bankChecked ? bank : 0) +
                (cashChecked ? cash : 0) +
                (extraChecked ? extra : 0)
              }`}
              className="w-3/4 border border-[#cecece] rounded-lg p-2 px-3 text-[#2A2A33] mb-5 h-[50px]"
            />

            <label className="block mb-2 text-[18px] text-[#2A2A33] font-semibold mt-5">
              Savings Sources
            </label>
            <div className="space-y-3">
              <div className="flex justify-between items-start h-[52px]">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={bankChecked}
                    onChange={(e) => setBankChecked(e.target.checked)}
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
                {bankChecked && (
                  <input
                    type="text"
                    className="w-3/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 h-[50px] px-3"
                    value={`$${bank}`}
                    onChange={(e) => setBank(Number(e.target.value))}
                  />
                )}
              </div>
              <div className="flex justify-between items-start  h-[52px]">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={cashChecked}
                    onChange={(e) => setCashChecked(e.target.checked)}
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
                {cashChecked && (
                  <input
                    className="w-3/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 h-[50px] px-3"
                    type="text"
                    value={`$${cash}`}
                    onChange={(e) => setCash(Number(e.target.value))}
                  />
                )}
              </div>
              <div className="flex justify-between items-start  h-[52px]">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={extraChecked}
                    onChange={(e) => setExtraChecked(e.target.checked)}
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

                {extraChecked && (
                  <input
                    className="w-3/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 h-[50px] px-3"
                    type="text"
                    value={`$${extra}`}
                    onChange={(e) => setExtra(Number(e.target.value))}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between mt-13 gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="border border-[#1976E1] rounded-md text-[#1976E1] text-[18px] h-[60px] w-[208px]"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[#1976E1] text-white rounded-md text-[18px] w-[208px]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
