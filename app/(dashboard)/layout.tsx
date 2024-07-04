import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/isSubscribed";
import React, { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  return (
    <div className="h-full relative">
      {/* hidden on mobile devices */}
      <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900 md:min-w-72">
        <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
