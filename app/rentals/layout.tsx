import { requireAuth } from "@/lib/auth-guard";
import React from "react";

const RentalsLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuth();
    return <div className="min-h-screen w-full bg-background font-sans">{children}</div>;
};

export default RentalsLayout; 