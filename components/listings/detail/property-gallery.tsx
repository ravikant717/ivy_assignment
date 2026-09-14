import React from "react";
import { Heart, Share2 } from "lucide-react";

interface PropertyGalleryProps {
    images: string[];
    activeIndex: number;
    onSelectImage: (index: number) => void;
    onOpenLightbox: () => void;
    propertyTitle: string;
    isRental: boolean;
    isSaved: boolean;
    onToggleSave: () => void;
    onShare: () => void;
}

export function PropertyGallery({
    images,
    activeIndex,
    onSelectImage,
    onOpenLightbox,
    propertyTitle,
    isRental,
    isSaved,
    onToggleSave,
    onShare,
}: PropertyGalleryProps) {
    const currentImage = images[activeIndex] || images[0];

    return (
        <div className="space-y-3">
            {/* Main Hero Photo Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm group">
                <img
                    src={currentImage}
                    alt={propertyTitle}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
                />

                {/* Status Badge (FOR SALE / FOR RENT) */}
                <div className="absolute left-4 top-4">
                    <span className="rounded-lg bg-white/95 px-3 py-1 text-xs font-extrabold tracking-wide text-gray-900 shadow-md backdrop-blur-sm">
                        {isRental ? "FOR RENT" : "FOR SALE"}
                    </span>
                </div>

                {/* Top-Right Action Buttons: Favorite & Share */}
                <div className="absolute right-4 top-4 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggleSave}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-rose-500 active:scale-95"
                        title={isSaved ? "Remove from saved" : "Save listing"}
                    >
                        <Heart
                            className={`h-4 w-4 transition ${isSaved ? "fill-rose-500 text-rose-500" : ""}`}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={onShare}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-gray-950 active:scale-95"
                        title="Share property"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Bottom-Right Photo Counter Badge */}
                <div className="absolute bottom-4 right-4">
                    <button
                        type="button"
                        onClick={onOpenLightbox}
                        className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/80"
                    >
                        <span>
                            {activeIndex + 1}/{images.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* 5-Thumbnail Strip */}
            <div className="grid grid-cols-5 gap-2.5">
                {images.slice(0, 5).map((imgUrl, index) => {
                    const isSelected = activeIndex === index;
                    const isLastWithRemaining = index === 4 && images.length > 5;
                    const remainingCount = images.length - 4;

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                if (isLastWithRemaining) {
                                    onOpenLightbox();
                                } else {
                                    onSelectImage(index);
                                }
                            }}
                            className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border bg-gray-100 transition ${
                                isSelected
                                    ? "border-[#047857] ring-2 ring-[#047857]"
                                    : "border-gray-200 hover:border-gray-400"
                            }`}
                        >
                            <img
                                src={imgUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                            {isLastWithRemaining && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white backdrop-blur-[1px] transition group-hover:bg-black/45">
                                    +{remainingCount}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
