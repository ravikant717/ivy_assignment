import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PropertyBreadcrumbsProps {
    listingId: string | number;
    locality: string;
    city?: string;
    backHref?: string;
    backLabel?: string;
}

export function PropertyBreadcrumbs({
    listingId,
    locality,
    city = "Gurgaon",
    backHref = "/listings",
    backLabel = "Back to listings",
}: PropertyBreadcrumbsProps) {
    return (
        <div className="border-b border-gray-100 bg-white">
            <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-3 text-xs md:px-8 text-gray-500">
                <Link
                    href={backHref}
                    className="group flex items-center gap-1.5 font-medium text-gray-700 transition hover:text-[#047857]"
                >
                    <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                    <span>{backLabel}</span>
                </Link>
                <span className="text-gray-300">&gt;</span>
                <span className="capitalize font-medium text-gray-600">{city}</span>
                <span className="text-gray-300">&gt;</span>
                <span className="capitalize font-medium text-gray-600">{locality}</span>
                <span className="text-gray-300">&gt;</span>
                <span className="font-semibold text-gray-900">
                    Listing #{listingId}
                </span>
            </div>
        </div>
    );
}
