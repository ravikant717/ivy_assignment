import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryLightboxProps {
    isOpen: boolean;
    images: string[];
    activeIndex: number;
    onClose: () => void;
    onSelectIndex: (index: number) => void;
    propertyTitle: string;
    localityFormatted: string;
}

export function GalleryLightbox({
    isOpen,
    images,
    activeIndex,
    onClose,
    onSelectIndex,
    propertyTitle,
    localityFormatted,
}: GalleryLightboxProps) {
    // Keyboard navigation listener
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") {
                onSelectIndex(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
            }
            if (e.key === "ArrowRight") {
                onSelectIndex(activeIndex < images.length - 1 ? activeIndex + 1 : 0);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, activeIndex, images.length, onClose, onSelectIndex]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 p-4 md:p-6 backdrop-blur-md">
            {/* Top Header */}
            <div className="flex w-full max-w-6xl items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <span className="rounded-md bg-white/20 px-2.5 py-1 text-xs font-bold">
                        {activeIndex + 1} of {images.length}
                    </span>
                    <h3 className="text-sm font-semibold truncate max-w-xs md:max-w-md">
                        {propertyTitle} · {localityFormatted}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Main Photo with Arrows */}
            <div className="relative flex w-full max-w-5xl flex-1 items-center justify-center my-4 overflow-hidden">
                <button
                    type="button"
                    onClick={() =>
                        onSelectIndex(activeIndex > 0 ? activeIndex - 1 : images.length - 1)
                    }
                    className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition hover:bg-black/90 active:scale-95"
                    title="Previous photo"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <img
                    src={images[activeIndex]}
                    alt={`Gallery photo ${activeIndex + 1}`}
                    className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />

                <button
                    type="button"
                    onClick={() =>
                        onSelectIndex(activeIndex < images.length - 1 ? activeIndex + 1 : 0)
                    }
                    className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition hover:bg-black/90 active:scale-95"
                    title="Next photo"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="flex max-w-4xl gap-2 overflow-x-auto py-2 px-4 scrollbar-thin">
                {images.map((thumb, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectIndex(idx)}
                        className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition ${
                            activeIndex === idx
                                ? "ring-2 ring-emerald-500 scale-105"
                                : "opacity-60 hover:opacity-100"
                        }`}
                    >
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
