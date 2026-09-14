"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterDropdownProps {
    id: string;
    icon: ReactNode;
    label: string;
    selectedValue: string;
    options: FilterOption[] | readonly FilterOption[];
    onChange: (value: string) => void;
    isOpen?: boolean;
    onToggle?: () => void;
    placeholder?: string;
    className?: string;
    menuWidth?: string;
}

export function FilterDropdown({
    icon,
    label,
    selectedValue,
    options,
    onChange,
    isOpen: controlledIsOpen,
    onToggle,
    placeholder,
    className = "",
    menuWidth = "w-56",
}: FilterDropdownProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

    const toggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            setInternalOpen(!internalOpen);
        }
    };

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                if (onToggle) {
                    onToggle();
                } else {
                    setInternalOpen(false);
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onToggle]);

    const blankOption = options.find((opt) => opt.value === "");
    const effectivePlaceholder = placeholder || blankOption?.label;
    const nonBlankOptions = options.filter((opt) => opt.value !== "");

    const selectedOption = nonBlankOptions.find((opt) => opt.value === selectedValue);
    const isSelected = Boolean(selectedValue && selectedValue !== "");
    const displayLabel = selectedOption ? selectedOption.label : label;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={toggle}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                    isSelected
                        ? "border-[#047857] bg-emerald-50/60 text-[#047857] shadow-2xs"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
                <span className="shrink-0 text-gray-500">{icon}</span>
                <span className="truncate max-w-[120px] sm:max-w-[140px]">
                    {displayLabel}
                </span>
                <ChevronDown
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180 text-gray-600" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu Popover */}
            {isOpen && (
                <div
                    className={`absolute left-0 top-full z-40 mt-1.5 ${menuWidth} max-h-64 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl scrollbar-thin animate-in fade-in-50 zoom-in-95`}
                >
                    {effectivePlaceholder && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                toggle();
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                                !isSelected
                                    ? "bg-emerald-50/80 font-bold text-[#047857]"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <span>{effectivePlaceholder}</span>
                            {!isSelected && <Check className="h-3.5 w-3.5 text-[#047857]" />}
                        </button>
                    )}

                    {nonBlankOptions.map((option) => {
                        const isCurrent = option.value === selectedValue;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(isCurrent ? "" : option.value);
                                    toggle();
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                                    isCurrent
                                        ? "bg-emerald-50/80 font-bold text-[#047857]"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {isCurrent && <Check className="h-3.5 w-3.5 text-[#047857]" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
