import React from "react";
import { PropertyLoadingState } from "@/components/common/property-loading-state";

export function DetailSkeleton() {
    return (
        <PropertyLoadingState
            withNavbar={true}
            activeNavTab="listings"
            fullPage={true}
            title="Finding the best properties for you..."
            subtitle="This may take a few seconds. Hang tight!"
        />
    );
}
