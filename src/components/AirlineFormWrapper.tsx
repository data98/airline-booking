"use client";

import { Suspense } from "react";
import { AirlineForm } from "@/components/AirlineForm";
import { FlightDestination } from "@/types/FlightDestination";

interface Props {
  destinations: FlightDestination[];
}

export function AirlineFormWrapper({ destinations }: Props) {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <AirlineForm destinations={destinations} />
    </Suspense>
  );
}
