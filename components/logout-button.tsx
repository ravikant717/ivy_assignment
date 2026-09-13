"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
    className?: string;
    showIcon?: boolean;
    label?: string;
    onSuccess?: () => void;
}

export function LogoutButton({
    className = "",
    showIcon = true,
    label = "Log out",
    onSuccess,
}: LogoutButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        try {
            await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm transition-colors hover:bg-[#f9fafb] hover:text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1e7e53]/30 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
            {showIcon && <LogOut className="h-4 w-4" />}
            <span>{loading ? "Logging out..." : label}</span>
        </button>
    );
}

export default LogoutButton;
