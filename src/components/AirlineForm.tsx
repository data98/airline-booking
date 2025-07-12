"use client";

import { useEffect } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useQueryState, parseAsString } from "nuqs";
import { useSearchParams } from "next/navigation";
import { TripTypeSelector } from "./TripTypeSelector";
import { CitySelector } from "./CitySelector";
import { DatePicker } from "./DatePicker";

// TODO: implement the airlineForm component

export interface AirlineFormProps {
  destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
  const [origin, setOrigin] = useQueryState(
    "origin",
    parseAsString.withDefault("")
  );
  const [destination, setDestination] = useQueryState(
    "destination",
    parseAsString.withDefault("")
  );
  const [tripType, setTripType] = useQueryState("type", {
    defaultValue: "roundtrip",
    clearOnDefault: false,
    history: "push",
  });
  const [fromDateStr, setFromDateStr] = useQueryState("departureDate");
  const [toDateStr, setToDateStr] = useQueryState("returnDate");

  const formatDate = (date: Date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const parseDate = (str: string): Date => {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const fromDate = fromDateStr ? parseDate(fromDateStr) : undefined;
  const toDate = toDateStr ? parseDate(toDateStr) : undefined;

  const handleTripTypeChange = (type: "roundtrip" | "oneway") => {
    setTripType(type);

    if (type === "oneway" && toDate) {
      setToDateStr(null); // remove return date from URL
    }
  };

  const getDestinationByCode = (
    code: string
  ): FlightDestination | undefined => {
    return destinations.find((d) => d.code === code);
  };

  const isDayAvailable = (date: Date, cityCode: string | undefined) => {
    if (!cityCode) return true; // no city selected yet

    const city = getDestinationByCode(cityCode);
    if (!city) return true;

    const day = date.getDay(); // Sunday = 0 ... Saturday = 6 as indicated
    return city.availableWeekdays.includes(day);
  };

  const handleOriginChange = (code: string) => {
    if (code === destination) {
      toast.error("Origin and destination cannot be the same.");
      setDestination(null); // reset destination
    }

    setOrigin(code);

    if (fromDate && !isDayAvailable(fromDate, code)) {
      toast.error(
        "Previously selected departure date is unavailable for the new origin."
      );
      setFromDateStr(null);
    }
  };

  const handleDestinationChange = (code: string) => {
    if (code === origin) {
      toast.error("Origin and destination cannot be the same.");
      setOrigin(null); // reset origin
    }

    setDestination(code);

    if (toDate && !isDayAvailable(toDate, code)) {
      toast.error(
        "Previously selected return date is unavailable for the new destination."
      );
      setToDateStr(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!origin || !destination) {
      toast.error("Please select both origin and destination.");
      return;
    }

    if (origin === destination) {
      toast.error("Origin and destination cannot be the same.");
      return;
    }

    if (!fromDate) {
      toast.error("Please select a departure date.");
      return;
    }

    if (tripType === "roundtrip" && !toDate) {
      toast.error("Please select a return date.");
      return;
    }

    toast.success("Submitting...");
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!searchParams.has("type")) setTripType("roundtrip");
  }, []);

  return (
    <Bounded>
      <h1 className="font-body font-bold text-xl text-center">
        Welcome to the Digido Airlines!
      </h1>

      <form onSubmit={handleSubmit} className="w-full flex justify-center">
        <div className="mt-24 border rounded-lg p-8 flex flex-col items-start gap-6 w-[500px]">
          {/* Trip Type */}
          <TripTypeSelector
            value={tripType as "roundtrip" | "oneway"}
            onChange={handleTripTypeChange}
          />

          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between gap-4">
              {/* Origin */}
              <div className="main-input">
                <CitySelector
                  label="Origin"
                  value={origin}
                  onChange={handleOriginChange}
                  destinations={destinations}
                />
              </div>

              {/* Destination */}
              <div className="main-input">
                <CitySelector
                  label="Destination"
                  value={destination}
                  onChange={handleDestinationChange}
                  destinations={destinations}
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 w-full">
              {/* Departure Date */}
              <div className="main-input">
                <DatePicker
                  label="Departure date"
                  value={fromDate}
                  onSelect={(date) => {
                    if (!date) return;
                    if (!isDayAvailable(date, origin ?? undefined)) {
                      toast.error(
                        "This departure date is unavailable for the selected origin."
                      );
                      setFromDateStr(null);
                      return;
                    }
                    setFromDateStr(formatDate(date));
                  }}
                  disabled={(date) =>
                    !isDayAvailable(date, origin ?? undefined) ||
                    (tripType === "roundtrip" && toDate
                      ? date > toDate
                      : false) ||
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </div>

              {/* Return Date */}
              {tripType !== "oneway" && (
                <div className="main-input">
                  <DatePicker
                    label="Return date"
                    value={toDate}
                    onSelect={(date) => {
                      if (!date) return;
                      if (!isDayAvailable(date, destination ?? undefined)) {
                        toast.error(
                          "This return date is unavailable for the selected destination."
                        );
                        setToDateStr(null);
                        return;
                      }
                      setToDateStr(formatDate(date));
                    }}
                    disabled={(date) =>
                      !isDayAvailable(date, destination ?? undefined) ||
                      (fromDate ? date < fromDate : false) ||
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full ">
            Book Flight
          </Button>
        </div>
      </form>
    </Bounded>
  );
};
