"use client";

import React from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
    isSaved?: boolean;
    onToggle: () => void;
    label?: string;
    className?: string;
}

export function FavoriteButton({
    isSaved = false,
    onToggle,
    label = "Save property",
    className = "",
}: FavoriteButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            className={`rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-rose-500 ${className}`}
        >
            <Heart
                className={`h-4.5 w-4.5 ${
                    isSaved
                        ? "fill-rose-500 text-rose-500"
                        : "text-gray-400"
                }`}
            />
        </button>
    );
}
