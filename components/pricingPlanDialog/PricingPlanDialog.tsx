"use client";

import React, { useEffect, useState } from "react";
import Dialog from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const plans = [
  {
    key: "free",
    name: "One-time Report",
    price: "FREE",
    description: "For one-off users testing their affordability",
    features: [
      "Full Affordability Snapshot",
      "Money Management Rating",
      "Property Affordability Estimate",
      "PDF Report Download",
    ],
  },
  {
    key: "premium",
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
  },
  {
    key: "platinum",
    name: "Platinum",
    price: "$49.99/mo",
    description:
      "For couples, families, and power users ready for real estate action",
    features: [
      "All that include Premium",
      "UNLIMITED Reports (individual and joint)",
      `"Coach Mode" AI with dynamic financial milestones`,
      `Spouse/Partner/Co-buyer Invite <br/><span style="font-size: 13px; font-weight: 400;"> Invite a co-buyer or spouse to jointly plan finances, share reports, and make informed decisions together</span>`,
      "VIP Support + 1:1 Onboarding",
      "Early Feature Access (e.g., Affordability Certification Badge)",
    ],
  },
];

export default function PricingPlansDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { getToken } = useAuth();
  const [activeTier, setActiveTier] = useState<
    "free" | "premium" | "platinum" | null
  >(null);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscription = async () => {
    try {
      const token = await getToken();
      const res = await fetch("https://api.affordify.ai/api/subscription/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setActiveTier(data?.subscription?.tier ?? "free");
      setSubscriptionId(data?.subscription?.id ?? null);
    } catch (err) {
      toast.error("Failed to fetch subscription");
    }
  };

  useEffect(() => {
    if (isOpen) fetchSubscription();
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");
    if (sessionId) {
      setIsLoading(true);
      setTimeout(async () => {
        await fetchSubscription();
        setIsLoading(false);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, document.title, url.pathname);
      }, 2000);
    }
  }, [isOpen, getToken]);

  const handleCheckout = async (tier: string) => {
    const token = await getToken();
    try {
      const res = await fetch("https://api.affordify.ai/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tier,
          successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/dashboard`,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Unable to redirect: Stripe checkout URL is missing.");
      }
    } catch (err) {
      toast.error("Stripe checkout error. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (!subscriptionId) return toast.error("No subscription found to cancel");
    const token = await getToken();

    try {
      const res = await fetch(
        `https://api.affordify.ai/api/subscription/${subscriptionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        toast.success("Subscription cancelled. You’re on the Free plan now.");
        setActiveTier("free");
        setSubscriptionId(null);
      } else {
        toast.error("Failed to cancel subscription.");
      }
    } catch (err) {
      toast.error("Cancel request failed.");
    }
  };

  const getButtonLabel = (planKey: string): string => {
    if (planKey === activeTier) return "Current Plan";
    if (activeTier === "platinum" && planKey === "premium")
      return "Downgrade to Premium";
    if (activeTier === "premium" && planKey === "platinum")
      return "Upgrade to Platinum";
    if (activeTier !== "free" && planKey === "free")
      return "Cancel Subscription";
    return `Proceed with ${
      planKey.charAt(0).toUpperCase() + planKey.slice(1)
    } Plan`;
  };

  const handleAction = (planKey: string) => {
    if (planKey === activeTier) return;
    if (activeTier !== "free" && planKey === "free") {
      handleCancel();
    } else {
      handleCheckout(planKey);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <p className="text-[36px] font-bold mb-4 text-[#2A2A33]">
        Plans & Billing
      </p>
      {isLoading && (
        <p className="text-sm text-gray-500 mb-4">
          Updating your subscription...
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {plans.map((plan, index) => {
          const isActive = plan.key === activeTier;
          return (
            <Card key={index} className="rounded-3xl p-5 h-[91%]">
              <CardContent>
                <div className="flex flex-col">
                  <h3 className="text-[24px] mb-1 text-[#2A2A33]">
                    {plan.name}
                  </h3>
                  <p className="text-[13px] text-[#2A2A33] mb-6">
                    {plan.description}
                  </p>
                  <div className="text-[36px] font-bold mb-6 text-[#2A2A33]">
                    {plan.price}
                  </div>

                  <Button
                    disabled={isActive || isLoading}
                    className="mb-6 text-[18px] font-semibold"
                    onClick={() => handleAction(plan.key)}
                  >
                    {getButtonLabel(plan.key)}
                  </Button>

                  <ul className="text-sm mb-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Image
                          src="/dashboard/Check Pricing.svg"
                          alt="Check"
                          width={20}
                          height={20}
                          className="mr-3 mt-[2px]"
                        />
                        <span
                          className="text-[#2A2A33] text-[16px] font-semibold"
                          dangerouslySetInnerHTML={{ __html: feature }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Dialog>
  );
}
