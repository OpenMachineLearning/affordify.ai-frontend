import React from "react";

const BudgetCard = () => {
  const data = [
    { label: "Income", value: 0, max: 3200 },
    { label: "Expences", value: 110, max: 2100 },
    { label: "Goals", value: 0, max: 1100 },
  ];

  const getBarWidth = (value: number, max: number) => `${(value / max) * 100}%`;

  return (
    <div className="bg-white shadow rounded-2xl w-[606px] p-4">
      <div className="text-[24px] font-normal text-[#2A2A33]">
        Current month budget
      </div>
      <div className="text-[10px] text-[#ACACAC] mt-1 mb-4">APRIL</div>
      <div className="w-full bg-[#D9D9D9] h-[1px] mb-6"></div>

      {data.map((item, index) => (
        <div key={index} className="mb-11">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base  font-normal text-[16px] text-[#2A2A33]">
              {item.label}
            </span>
            <span className="text-base font-normal  text-[16px] text-[#2A2A33]">
              ${item.value.toLocaleString()}/${item.max.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-[10px] rounded-full bg-[#D9D9D9]">
            <div
              className={`h-full rounded-full ${
                item.label === "Expences" ? "bg-[#1976E1]" : "bg-[#D9D9D9]"
              }`}
              style={{ width: getBarWidth(item.value, item.max) }}
            ></div>
            <div className="w-full bg-[#D9D9D9] h-[1px]  mt-6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetCard;
