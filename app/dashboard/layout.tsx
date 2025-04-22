import Sidebar from "@/components/SideBar/SideBar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <main className="flex-1 p-6 ">{children}</main>
    </div>
  );
}
