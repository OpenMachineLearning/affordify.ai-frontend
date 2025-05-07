"use client";
import Sidebar from "@/components/SideBar/SideBar";
import type { ReactNode } from "react";
import PricingPlansDialog from "@/components/pricingPlanDialog/PricingPlanDialog";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);

  return (
    <div className="flex w-full h-full">
      <Sidebar onOpenPricingDialog={() => setIsPricingDialogOpen(true)} />
      <main className="flex-1 p-6 h-fit">{children}</main>
      <PricingPlansDialog
        isOpen={isPricingDialogOpen}
        onClose={() => setIsPricingDialogOpen(false)}
      />
    </div>
  );
}
