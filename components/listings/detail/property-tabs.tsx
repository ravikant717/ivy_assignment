import React from "react";

export type DetailTabType = "overview" | "amenities" | "location" | "similar";

interface PropertyTabsProps {
    activeTab: DetailTabType;
    setActiveTab: (tab: DetailTabType) => void;
    similarCount?: number;
}

export function PropertyTabs({
    activeTab,
    setActiveTab,
    similarCount = 0,
}: PropertyTabsProps) {
    const tabs: { id: DetailTabType; label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "amenities", label: "Amenities" },
        { id: "location", label: "Location" },
        { id: "similar", label: "Similar Listings" },
    ];

    return (
        <div className="border-b border-gray-200 pt-2">
            <nav className="flex items-center gap-6 text-sm">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative pb-3 font-semibold transition ${
                                isActive ? "text-gray-950 font-bold" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            <span>{tab.label}</span>
                            {tab.id === "similar" && similarCount > 0 && (
                                <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-[#047857]">
                                    {similarCount}
                                </span>
                            )}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#047857]" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
