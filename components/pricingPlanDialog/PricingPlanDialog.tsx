"use client";

import React from "react";
import Dialog from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import Image from "next/image";

const plans = [
  {
    name: "One-time Report",
    price: "FREE",
    description: "For one-off users testing their affordability",
    features: [
      "Full Affordability Snapshot",
      "Money Management Rating",
      "Property Affordability Estimate",
      "PDF Report Download",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    name: "Premium",
    price: "$24.99/mo",
    description: "For users managing savings, credit repair, or purchase plans",
    features: [
      "All that include One-time Report Plan",
      "4 Affordability Reports Generation at month",
      "Unlimited AI Chat Access",
      "Deposit Goal Tracker + Visual Timeline",
      "Progress Dashboards",
      "Financial Insights",
      "Email Alerts for Spending Trends",
    ],
    cta: "Proceed with Premium Plan",
  },
  {
    name: "Platinum",
    price: "$49.99/mo",
    description:
      "For couples, families, and power users ready for real estate action",
    features: [
      "All that include Premium",
      "UNLIMITED Reports (individual and joint)",
      '"Coach Mode" AI with dynamic financial milestones',
      `Spouse/Partner/Co-buyer Invite <br/><span style="font-size: 13px; font-weight: 400;"> Invite a co-buyer or spouse to jointly plan finances, share reports, and make informed decisions togethe</span>`,
      "VIP Support + 1:1 Onboarding",
      "Early Feature Access (e.g., Affordability Certification Badge)",
    ],
    cta: "Proceed with Platinum Plan",
  },
];

export default function PricingPlansDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <p className="text-[36px] font-bold mb-4 text-[#2A2A33]">
        Plans & Billing
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {plans.map((plan, index) => (
          <Card key={index} className=" rounded-3xl p-5 h-[91%]">
            <CardContent className="">
              <div className="flex flex-col ">
                <div>
                  <h3 className="text-[24px]  mb-1 text-[#2A2A33]">
                    {plan.name}
                  </h3>

                  <p className="text-[13px] text-[#2A2A33] mb-6">
                    {plan.description}
                  </p>

                  <div className=" text-[36px] font-bold mb-6 text-[#2A2A33]">
                    {plan.price}
                  </div>
                  <Button
                    disabled={plan.disabled}
                    className="mb-6 text-[18px] font-semibold"
                  >
                    {plan.cta}
                  </Button>
                  <ul className="text-sm mb-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Image
                          src="/dashboard/Check Pricing.svg"
                          alt="Check"
                          width={20}
                          height={20}
                          className="mr-3"
                        />
                        <span 
                          className="text-[#2A2A33] text-[16px] font-semibold"
                          dangerouslySetInnerHTML={{ __html: feature }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Dialog>
  );
}
