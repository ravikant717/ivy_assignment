import React from "react";
import {
    Building,
    Zap,
    Car,
    ShieldCheck,
    Droplets,
    Wrench,
    Dumbbell,
    Gamepad2,
    Check,
    Home,
} from "lucide-react";

export function TabAmenities() {
    return (
        <div className="space-y-6 pt-1">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-gray-900">All Amenities & Society Facilities</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Comprehensive list of facilities, security features & specifications
                    </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#047857] border border-emerald-200 shrink-0">
                    16 Verified
                </span>
            </div>

            {/* Category 1: Essentials & Utilities */}
            <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Essential Infrastructure & Utilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Building className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">High-Speed Lifts</p>
                            <p className="text-[11px] text-gray-500">Passenger & dedicated service stretcher elevator</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Zap className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">100% DG Power Backup</p>
                            <p className="text-[11px] text-gray-500">24/7 backup for common areas & home essential points</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Car className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">Reserved Covered Parking</p>
                            <p className="text-[11px] text-gray-500">Dedicated stilt/basement space + guest parking bay</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Droplets className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">24/7 Dual Water Supply</p>
                            <p className="text-[11px] text-gray-500">Continuous municipal water + high-capacity borewell</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category 2: Safety & Security */}
            <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Safety & Smart Living
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <ShieldCheck className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">24/7 Gated Security</p>
                            <p className="text-[11px] text-gray-500">Uniformed security personnel at entry and exit gates</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <ShieldCheck className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">HD CCTV Surveillance</p>
                            <p className="text-[11px] text-gray-500">Complete coverage of lobbies, elevators & premises</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Check className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">Intercom & Visitor Log</p>
                            <p className="text-[11px] text-gray-500">Direct intercom to main security desk & visitor tracking</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Check className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">Fire Safety & Hydrants</p>
                            <p className="text-[11px] text-gray-500">Smoke detectors, fire hose reels & alarm system</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category 3: Fitness & Community */}
            <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Fitness, Recreation & Community
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Dumbbell className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">Modern Gymnasium</p>
                            <p className="text-[11px] text-gray-500">Equipped with cardio machines, free weights & yoga space</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Gamepad2 className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">Children's Play Area</p>
                            <p className="text-[11px] text-gray-500">Dedicated safe rubberized play zone with swings & slides</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Wrench className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">On-Site Maintenance Staff</p>
                            <p className="text-[11px] text-gray-500">Electrician, plumber and housekeeping on call</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                        <Home className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-gray-900">Community Hall & Greens</p>
                            <p className="text-[11px] text-gray-500">Party lawn, walking track and landscaped garden</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
