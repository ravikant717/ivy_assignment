import React from "react";

interface IvyLogoProps {
    className?: string;
    variant?: "default" | "white";
}

export function IvyLogo({
    className = "h-6 w-auto",
    variant = "default",
}: IvyLogoProps) {
    return (
        <img
            src="/icons/ivyhomes_logo.svg"
            alt="Ivy Homes"
            className={`${className} ${variant === "white" ? "brightness-0 invert" : ""}`}
        />
    );
}
