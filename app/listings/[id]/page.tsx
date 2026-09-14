"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { Navbar } from "@/components/listings/navbar";
import { Toast } from "@/components/common/toast";
import { useToast } from "@/lib/hooks/use-toast";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { useListingDetail } from "@/lib/hooks/use-listing-detail";
import {
    PropertyGallery,
    GalleryLightbox,
    PropertyTabs,
    TabOverview,
    TabAmenities,
    TabLocation,
    TabSimilar,
    PropertyInfo,
    DetailSkeleton,
    PropertyBreadcrumbs,
    type DetailTabType,
} from "@/components/listings/detail";

interface SingleListingPageProps {
    params: Promise<{ id: string }>;
}

export default function SingleListingPage({ params }: SingleListingPageProps) {
    const resolvedParams = use(params);
    const listingId = resolvedParams.id;

    // Custom hook for listing data & formatting
    const {
        listing,
        similarListings,
        isLoading,
        error,
        galleryImages,
        formattedPrice,
        propertyTitle,
        localityFormatted,
        carpetAreaStr,
        furnishingStr,
        floorStr,
        isRental,
    } = useListingDetail(listingId);

    // Active Gallery & UI States
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<DetailTabType>("overview");
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const { isFavourite, toggleFavourite } = useFavourites();
    const isSaved = isFavourite(listingId);
    const { toastMessage, showToast } = useToast();

    function handleShare() {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            showToast("Listing link copied to clipboard!");
        }
    }

    // Loading State
    if (isLoading) {
        return <DetailSkeleton />;
    }

    // Error State
    if (error || !listing) {
        return (
            <div className="min-h-screen bg-[#FDFDFD]">
                <Navbar activeTab="listings" />
                <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
                        <X className="h-8 w-8" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Listing Not Found</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {error || "We couldn't locate this property. It might have been unlisted or moved."}
                    </p>
                    <Link
                        href="/listings"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#047857] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#065f46]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to all listings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-gray-900">
            {/* Top Navigation Bar */}
            <Navbar activeTab="listings" />

            {/* Breadcrumbs Navigation */}
            <PropertyBreadcrumbs
                listingId={listing.listing_id}
                locality={listing.locality || "Sector 65"}
                city={localityFormatted.split(",")[1]?.trim() || "Gurgaon"}
            />

            {/* Main Content */}
            <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Left Column (6 cols): Photos & Tabs */}
                    <section className="space-y-6 lg:col-span-6">
                        <PropertyGallery
                            images={galleryImages}
                            activeIndex={activeImageIndex}
                            onSelectImage={setActiveImageIndex}
                            onOpenLightbox={() => setIsLightboxOpen(true)}
                            propertyTitle={propertyTitle}
                            isRental={isRental}
                            isSaved={isSaved}
                            onToggleSave={async () => {
                                const nextSaved = !isSaved;
                                await toggleFavourite(listingId);
                                showToast(
                                    nextSaved
                                        ? "Listing saved to favorites!"
                                        : "Listing removed from favorites."
                                );
                            }}
                            onShare={handleShare}
                        />

                        {/* Section Tabs */}
                        <PropertyTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            similarCount={similarListings.length}
                        />

                        {/* Tab Content Panels */}
                        {activeTab === "overview" && (
                            <TabOverview
                                listing={listing}
                                carpetAreaStr={carpetAreaStr}
                                floorStr={floorStr}
                                localityFormatted={localityFormatted}
                                similarCount={similarListings.length}
                                onNavigateTab={setActiveTab}
                            />
                        )}

                        {activeTab === "amenities" && <TabAmenities />}

                        {activeTab === "location" && (
                            <TabLocation
                                listing={listing}
                                localityFormatted={localityFormatted}
                            />
                        )}

                        {activeTab === "similar" && (
                            <TabSimilar
                                similarListings={similarListings}
                                targetPrice={listing.price}
                                bedroom={listing.bedroom}
                                localityName={localityFormatted.split(",")[0]}
                            />
                        )}
                    </section>

                    {/* Right Column (6 cols): Property Details */}
                    <section className="space-y-6 lg:col-span-6">
                        <PropertyInfo
                            listing={listing}
                            propertyTitle={propertyTitle}
                            localityFormatted={localityFormatted}
                            formattedPrice={formattedPrice}
                            carpetAreaStr={carpetAreaStr}
                            furnishingStr={furnishingStr}
                            floorStr={floorStr}
                        />
                    </section>
                </div>
            </main>

            {/* Lightbox Modal */}
            <GalleryLightbox
                isOpen={isLightboxOpen}
                images={galleryImages}
                activeIndex={activeImageIndex}
                onClose={() => setIsLightboxOpen(false)}
                onSelectIndex={setActiveImageIndex}
                propertyTitle={propertyTitle}
                localityFormatted={localityFormatted}
            />

            {/* Floating Toast Notification */}
            {toastMessage && <Toast message={toastMessage} />}
        </div>
    );
}
