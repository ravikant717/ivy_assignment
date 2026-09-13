import { requireUnAuth } from "@/lib/auth-guard";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireUnAuth();
    return <>{children}</>;
};

export default AuthLayout;