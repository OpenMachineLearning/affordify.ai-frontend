import React from "react";

const FinancialInsights = () => {
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg p-4 shadow-sm w-full ">
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
      <a href="#" className="block mt-50 text-[16px] text-[#1976E1] ">
        Get more Insights and Suggestions
      </a>
    </div>
  );
};

export default FinancialInsights;
