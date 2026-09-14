"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SortDropdownOption<T extends string = string> {
    value: T;
    label: string;
}

interface SortDropdownProps<T extends string> {
    options: Record<T, { label: string }> | SortDropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
    labelPrefix?: string;
    className?: string;
}

export function SortDropdown<T extends string>({
    options,
    value,
    onChange,
    labelPrefix = "Sort by: ",
    className = "",
}: SortDropdownProps<T>) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Normalize options into an array
    const optionsList: SortDropdownOption<T>[] = Array.isArray(options)
        ? options
        : (Object.entries(options) as [T, { label: string }][]).map(
              ([key, val]) => ({
                  value: key,
                  label: val.label,
              })
          );

    const currentLabel =
        optionsList.find((opt) => opt.value === value)?.label || value;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 transition hover:text-gray-900"
            >
                <span>
                    {labelPrefix}
                    {currentLabel}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-30 mt-1.5 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl">
                    {optionsList.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                value === opt.value
                                    ? "bg-emerald-50 font-semibold text-[#047857]"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
