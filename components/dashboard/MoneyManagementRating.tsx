"use client";
import { useEffect, useState } from "react";
import Tooltip from "../ui/Tooltip";

interface Props {
  value: number;
  max?: number;
}

export default function MoneyManagementRating({ value, max = 100 }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const radius = 140;
  const strokeWidth = 18;
  const center = radius + strokeWidth;
  const totalAngle = Math.PI; // 180 degrees

  const percent = value / max;
  const gap = 0.13; // small gap in radians (~2.8°)
  const arc1Angle = totalAngle * 0.32 - gap;
  const arc2Angle = totalAngle * 0.36 - gap;
  const arc3Angle = totalAngle * 0.32;

  const arc1Start = Math.PI;
  const arc2Start = arc1Start + arc1Angle + gap;
  const arc3Start = arc2Start + arc2Angle + gap;

  const getArcPath = (startAngle: number, angle: number) => {
    const start = polarToCartesian(center, center, radius, startAngle);
    const end = polarToCartesian(center, center, radius, startAngle + angle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y,
    ].join(" ");
  };

  function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleRad: number
  ) {
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  const filledAngleRadians = totalAngle * percent;
  const filledPosition = polarToCartesian(
    center,
    center,
    radius,
    Math.PI + filledAngleRadians
  );

  return (
    <div className="flex flex-col w-full  bg-white rounded-xl p-6 text-center shadow min-w-[520px] h-full">
      {/* Heading */}
      <div className="flex items-center">
        {" "}
        <h2 className="text-[24px] text-[#2A2A33]  mb-2 mr-2">
          Money Management Rating
        </h2>
        <Tooltip text="This score shows how effectively you manage your finances and how quickly you can reach your savings goals. Improving it can help you save faster and achieve financial milestones.">
          <img
            src="/dashboard/info.png"
            alt="Information"
            className=" cursor-pointer"
          />
        </Tooltip>
      </div>

      <p className="text-[14px] text-[#2A2A33] opacity-80 text-start mb-4 leading-tight w-6/8">
        You're managing your money effectively and are on a strong path toward
        achieving your financial goals
      </p>

      {/* Gauge */}
      <div className="relative w-[320px] h-[200px] mx-auto mt-10">
        <svg width="320" height="200">
          {/* Tick Dots */}
          {[...Array(21)].map((_, i) => {
            const theta = Math.PI * (i / 20);
            const r = radius - 23;
            const x = center + r * Math.cos(Math.PI + theta);
            const y = center + r * Math.sin(Math.PI + theta);
            return <circle key={i} cx={x} cy={y} r="1.2" fill="#9CA3AF" />;
          })}

          {/* Arc 1: Light Blue */}
          <path
            d={getArcPath(Math.PI, arc1Angle)}
            fill="none"
            stroke="#EFF6FD"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Arc 2: Bright Blue */}
          <path
            d={getArcPath(arc2Start, arc2Angle)}
            fill="none"
            stroke="#1976E1"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Arc 3: Dark Blue */}
          <path
            d={getArcPath(arc3Start, arc3Angle)}
            fill="none"
            stroke="#1E5A9F"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Outer Dot */}
        <div
          className="absolute w-8 h-8 rounded-full border-[10px] border-[#1976E1] bg-white shadow"
          style={{
            left: `${filledPosition.x}px`,
            top: `${filledPosition.y - 8}px`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Center Value */}
        <div className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2 translate-y-[10px] text-[36px] font-semibold text-neutral-900">
          {value}
        </div>
        <div
          className="absolute text-[16px] font-semibold text-[#2A2A33]"
          style={{ left: "10px", bottom: "5px" }}
        >
          0
        </div>
        <div
          className="absolute text-[16px] font-semibold text-[#2A2A33]"
          style={{ right: "8px", bottom: "5px" }}
        >
          100
        </div>
      </div>

      {/* CTA */}
      <a href="#" className="text-[16px] text-start text-[#1976E1] mt-30 flex ">
        Get Optimization Suggestions
        <img className="ml-2" src="/dashboard/side-5-1.png" alt="" />
      </a>
    </div>
  );
}
