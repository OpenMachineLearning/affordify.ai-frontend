// app/components/charts/IncomeDonutChart.tsx
"use client";

import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

const data = [
  { name: "Disposable Funds", value: 50000, fill: "#1E5A9F" },
  { name: "Expenses", value: 50000, fill: "#0AD0C3" },
];
const total = data.reduce((acc, curr) => acc + curr.value, 0);

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fontWeight={900}
        fontSize={21}
        fill="#2A2A33"
      >
        ${total}
      </text>
      <text
        x={cx}
        y={cy + 10}
        dy={8}
        fontSize={14}
        textAnchor="middle"
        fontWeight={550}
        fill="#2A2A33"
      >
        Total Income
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#2A2A33"
        fontSize={16}
        fontWeight={550}
      >{`$${value.toLocaleString()}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        fontWeight={550}
        fontSize={12}
        textAnchor={textAnchor}
        fill="#2A2A33"
      >
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

export default class IncomeDonutChart extends PureComponent<
  {},
  { activeIndex: number }
> {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_: any, index: number) => {
    this.setState({ activeIndex: index });
  };

  render() {
    return (
      <div className="w-[35%] bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[22px] text-[#2A2A33] font-semibold">
            Average Disposable Funds
          </h3>
          <select className="text-sm text-[#2A2A33] border rounded px-2 py-1 h-[30px]">
            <option>Annual</option>
            <option>Month</option>
          </select>
        </div>
        <div className="flex relative" style={{ width: "100%", height: 310 }}>
          <div className="w-[32%] absolute top-7">
            <h2 className="flex items-center text-[14px] text-[#2A2A33]">
              <div className="w-3 h-3 bg-[#1E5A9F] rounded-full mr-3"></div>{" "}
              Disposable Funds
            </h2>
            <h2 className="flex items-center text-[14px] text-[#2A2A33]">
              {" "}
              <div className="w-3 h-3 bg-[#0AD0C3] rounded-full mr-3"></div>{" "}
              Expenses
            </h2>
          </div>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={this.state.activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={105}
                fill="#2563EB"
                dataKey="value"
                onMouseEnter={this.onPieEnter}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
