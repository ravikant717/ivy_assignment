"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MonthlyTrend } from "@/lib/insights-data";

interface PriceTrendChartProps {
    trends: MonthlyTrend[];
    propertyType: string;
    onPropertyTypeChange: (type: string) => void;
    title?: string;
    subtitle?: string;
    isRent?: boolean;
}

export function PriceTrendChart({
    trends,
    propertyType,
    onPropertyTypeChange,
    title = "Average Price Trends",
    subtitle = "Track how property prices have changed over time.",
    isRent = false,
}: PriceTrendChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Chart dimensions
    const width = 640;
    const height = 240;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Values range: dynamic scaling based on Gurgaon raw data range
    const values = trends.map((item) => (isRent ? (item.rent_pm || item.price_sqft) : item.price_sqft));
    const maxVal = Math.max(...values, 1000);

    let minY = 4000;
    let maxY = 12000;
    let yTicks = [12000, 10000, 8000, 6000, 4000];

    if (isRent) {
        minY = 20000;
        maxY = 40000;
        yTicks = [40000, 35000, 30000, 25000, 20000];
    } else if (maxVal > 12000) {
        // Gurgaon raw data range (₹13K - ₹17K)
        minY = 10000;
        maxY = 18000;
        yTicks = [18000, 16000, 14000, 12000, 10000];
    }

    // Compute coordinate points
    const points = trends.map((item, idx) => {
        const val = isRent ? (item.rent_pm || item.price_sqft) : item.price_sqft;
        const x = paddingLeft + (idx / (trends.length - 1)) * chartWidth;
        const normalized = Math.max(0, Math.min(1, (val - minY) / (maxY - minY)));
        const y = paddingTop + chartHeight * (1 - normalized);
        return { x, y, val, item, idx };
    });

    // Generate smooth cubic bezier SVG path
    function generatePath(): string {
        if (points.length < 2) return "";
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cx1 = curr.x + (next.x - curr.x) / 2;
            const cy1 = curr.y;
            const cx2 = curr.x + (next.x - curr.x) / 2;
            const cy2 = next.y;
            path += ` C ${cx1},${cy1} ${cx2},${cy2} ${next.x},${next.y}`;
        }
        return path;
    }

    const linePath = generatePath();
    const areaPath = `${linePath} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${paddingTop + chartHeight} Z`;

    // Active tooltip point: default to May (index 4) if not hovered
    const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[4] || points[points.length - 1];

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
                <div>
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                </div>

                {/* Property Type Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">Property Type</span>
                    <div className="relative">
                        <select
                            value={propertyType}
                            onChange={(e) => onPropertyTypeChange(e.target.value)}
                            className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-7 font-medium text-gray-800 shadow-2xs transition focus:border-[#047857] focus:outline-none"
                        >
                            <option value="All">All</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Independent House">Independent House</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* SVG Chart */}
            <div className="relative w-full overflow-x-auto select-none pt-2">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto max-h-[250px] overflow-visible"
                >
                    <defs>
                        <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#047857" stopOpacity="0.16" />
                            <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines & Y-Axis Labels */}
                    {yTicks.map((tick, i) => {
                        const y = paddingTop + (i / (yTicks.length - 1)) * chartHeight;
                        const label = isRent ? `₹ ${(tick / 1000).toFixed(0)}K` : `₹ ${(tick / 1000).toFixed(0)}K`;
                        return (
                            <g key={i}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={width - paddingRight}
                                    y2={y}
                                    stroke="#f1f5f9"
                                    strokeWidth={1}
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={paddingLeft - 10}
                                    y={y + 3.5}
                                    textAnchor="end"
                                    fontSize={10}
                                    fill="#94a3b8"
                                    fontFamily="sans-serif"
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Gradient Area Fill */}
                    <path d={areaPath} fill="url(#chartGradientGreen)" />

                    {/* Main Curve Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#047857"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                    />

                    {/* X-Axis Month Labels & Hover Hit Areas */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <text
                                x={p.x}
                                y={height - 8}
                                textAnchor="middle"
                                fontSize={11}
                                fill={activePoint?.idx === i ? "#047857" : "#94a3b8"}
                                fontWeight={activePoint?.idx === i ? "600" : "400"}
                                fontFamily="sans-serif"
                            >
                                {p.item.month}
                            </text>

                            {/* Transparent hover column */}
                            <rect
                                x={p.x - chartWidth / (trends.length * 2)}
                                y={paddingTop}
                                width={chartWidth / trends.length}
                                height={chartHeight}
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        </g>
                    ))}

                    {/* Active/Pinned Tooltip & Dot */}
                    {activePoint && (
                        <g className="transition-all duration-200">
                            {/* Vertical Line */}
                            <line
                                x1={activePoint.x}
                                y1={activePoint.y}
                                x2={activePoint.x}
                                y2={paddingTop + chartHeight}
                                stroke="#cbd5e1"
                                strokeWidth={1}
                                strokeDasharray="2 2"
                            />

                            {/* Outer Dot */}
                            <circle
                                cx={activePoint.x}
                                cy={activePoint.y}
                                r={5}
                                fill="#047857"
                                stroke="#ffffff"
                                strokeWidth={2.5}
                                className="drop-shadow-sm"
                            />

                            {/* Pinned Tooltip Box */}
                            <g
                                transform={`translate(${Math.max(
                                    paddingLeft + 35,
                                    Math.min(width - paddingRight - 45, activePoint.x)
                                )}, ${activePoint.y - 42})`}
                            >
                                <rect
                                    x={-42}
                                    y={0}
                                    width={84}
                                    height={34}
                                    rx={6}
                                    fill="#047857"
                                    className="drop-shadow-md"
                                />
                                {/* Arrow Tip */}
                                <polygon
                                    points="0,38 -5,34 5,34"
                                    fill="#047857"
                                />
                                <text
                                    x={0}
                                    y={13}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fill="#a7f3d0"
                                    fontFamily="sans-serif"
                                >
                                    {activePoint.item.label || `${activePoint.item.month} 2025`}
                                </text>
                                <text
                                    x={0}
                                    y={27}
                                    textAnchor="middle"
                                    fontSize={10.5}
                                    fontWeight="bold"
                                    fill="#ffffff"
                                    fontFamily="sans-serif"
                                >
                                    {isRent
                                        ? `₹ ${activePoint.val.toLocaleString("en-IN")}`
                                        : `₹ ${activePoint.val.toLocaleString("en-IN")} / sq ft`}
                                </text>
                            </g>
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
