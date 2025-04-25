"use client";

interface AffordabilityScoreChartProps {
  score: number;
}

const tiers = [
  { label: "Excellent", color: "bg-[#0F948B]", min: 85 },
  { label: "Very Good", color: "bg-[#48BEB6]", min: 75 },
  { label: "Good", color: "bg-[#48BEB6]", min: 65 },
  { label: "Moderate", color: "bg-[#67CA87]", min: 55 },
  { label: "Average", color: "bg-[#B5C669]", min: 45 },
  { label: "Below Average", color: "bg-[#FAAE43]", min: 35 },
  { label: "Low", color: "bg-[#FA6E43]", min: 25 },
  { label: "Very Low", color: "bg-[#E54514]", min: 0 },
];

export default function AffordabilityScoreChart({
  score,
}: AffordabilityScoreChartProps) {
  const maxWidth = 330;
  const activeTier = tiers.find((t) => score >= t.min - 1);

  return (
    <div className="bg-white p-4 rounded-xl shadow  w-[55%] min-w-[445px] font-sans">
      {/* Header */}
      <div className="flex items-center justify-start mb-2">
        <h2 className="text-[24px] font-semibold text-[#000000] mr-2">
          Affordability Score
        </h2>
        {activeTier && (
          <span className={`w-3 h-3 rounded-full ${activeTier.color}`} />
        )}{" "}
      </div>
      <p className="text-[15px] text-[#2A2A33] opacity-80 mb-8">
        Your Affordability Score: <strong>{score}</strong>. This home is well
        within your budget!
      </p>

      {/* Chart */}
      <div className="relative flex">
        {/* Vertical Score Marker */}
        <div className="relative w-[24px] mr-4">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[11px] h-full bg-[#F5F5F5] rounded" />
          {/* Floating Score Badge */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 text-[15px] text-[#000000] font-bold shadow-md "
            style={{ top: `${100 - score}%` }} // Invert because 100 is top
          >
            {score}
          </div>
        </div>

        {/* Bars */}
        <div className="flex flex-col gap-[6px]">
          {tiers.map((tier, index) => {
            const width =
              maxWidth * ((tiers.length - index) / tiers.length) + 50;
            return (
              <div
                key={tier.label}
                className={`text-white text-[14px] font-medium rounded-md px-4 py-[7.5px] ${tier.color}`}
                style={{ width }}
              >
                {tier.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <a href="#" className="text-[16px] text-[#1976E1] mt-8 inline-block">
        Get Optimization Suggestions
      </a>
    </div>
  );
}
