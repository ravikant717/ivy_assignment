import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose?: () => void;
}

export function Toast({ message, type = "success" }: ToastProps) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-gray-900/95 px-4 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-md animate-fade-in">
            {type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {type === "error" && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
            {type === "info" && <Info className="h-4 w-4 text-sky-400 shrink-0" />}
            <span>{message}</span>
        </div>
    );
}
