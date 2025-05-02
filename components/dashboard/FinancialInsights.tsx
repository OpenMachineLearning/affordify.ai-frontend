import React from "react";

const FinancialInsights = ({ mask = true }) => {
  return (
    <div className="relative flex flex-col justify-between bg-white rounded-lg p-4 shadow-sm w-[530px] h-full overflow-hidden">
      {/* Main Content */}
      <div
        className={`${
          mask
            ? "blur-sm opacity-40 pointer-events-none "
            : "flex flex-col justify-between h-full"
        }`}
      >
        <div>
          <p className="flex items-center font-semibold text-[24px] mb-5 text-[#2A2A33]">
            Financial Insights
            <img className="ml-2" src="/dashboard/info.png" alt="" />
          </p>

          <div className="flex items-start">
            <img src="dashboard/list-dot.png" alt="" />
            <p className="text-[#2A2A33] text-[16px] ml-3 mb-4">
              Spending +12% more on food delivery this month slowed savings by
              8%
            </p>
          </div>
          <div className="flex items-start">
            <img src="dashboard/list-dot.png" alt="" />
            <p className="text-[#2A2A33] text-[16px] ml-3">
              A €10,000 downpayment allows you to afford a mortgage of up to
              €1,900 per month
            </p>
          </div>
        </div>

        <a href="#" className="block text-[16px] text-[#1976E1] mb-1">
          Get more Insights and Suggestions
        </a>
      </div>

      {/* Mask Overlay */}
      {mask && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/0  rounded-lg">
          <div className="mb-6 text-center items-center flex flex-col justify-center">
            <img src="/dashboard/upgrade.png" alt="" />
            <p className="text-[20px] font-semibold text-[#2A2A33]">
              Upgrade your plan to
              <br />
              View Financial Insights
            </p>
          </div>
          <button className="bg-[#1976E1] text-white text-[18px] px-8 py-3 rounded-lg">
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialInsights;
5;
