"use client";

import { useEffect, useState } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

// TODO: implement the airlineForm component

export interface AirlineFormProps {
  destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTripTypeChange = (type: "roundtrip" | "oneway") => {
    setTripType(type);

    if (type === "oneway" && toDate) {
      setToDate(undefined);
    }

    updateURLParams({ type, toDate: undefined });
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
    setOrigin(code);

    let overrides: any = { origin: code };

    if (fromDate && !isDayAvailable(fromDate, code)) {
      setFromDate(undefined);
      toast.error(
        "Previously selected departure date is unavailable for the new origin."
      );
      overrides.fromDate = undefined;
    }

    if (code === destination) {
      toast.error("Origin and destination cannot be the same.");
      setDestination(""); // reset destination
      overrides.destination = "";
    }

    updateURLParams(overrides);
  };

  const handleDestinationChange = (code: string) => {
    setDestination(code);

    let overrides: any = { destination: code };

    if (toDate && !isDayAvailable(toDate, code)) {
      setToDate(undefined);
      toast.error(
        "Previously selected return date is unavailable for the new destination."
      );
      overrides.toDate = undefined;
    }

    if (code === origin) {
      toast.error("Origin and destination cannot be the same.");
      setOrigin(""); // reset origin
      overrides.origin = "";
    }

    updateURLParams(overrides);
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

  const updateURLParams = (
    overrides: Partial<{
      origin: string;
      destination: string;
      type: "roundtrip" | "oneway";
      fromDate: Date | undefined;
      toDate: Date | undefined;
    }> = {}
  ) => {
    const params = new URLSearchParams();

    const originParam = "origin" in overrides ? overrides.origin : origin;
    const typeParam = "type" in overrides ? overrides.type : tripType;
    const destinationParam =
      "destination" in overrides ? overrides.destination : destination;
    const from = "fromDate" in overrides ? overrides.fromDate : fromDate;
    const to = "toDate" in overrides ? overrides.toDate : toDate;

    if (originParam) params.set("origin", originParam);
    if (typeParam) params.set("type", typeParam);
    if (destinationParam) params.set("destination", destinationParam);
    if (from) params.set("departureDate", from.toLocaleDateString("en-CA"));
    if (typeParam === "roundtrip" && to) {
      params.set("returnDate", to.toLocaleDateString("en-CA"));
    }

    router.push(`/?${params.toString()}`);
  };

  useEffect(() => {
    const originParam = searchParams.get("origin");
    const typeParam = searchParams.get("type");
    const destinationParam = searchParams.get("destination");
    const departureParam = searchParams.get("departureDate");
    const returnParam = searchParams.get("returnDate");

    if (originParam) setOrigin(originParam);
    if (typeParam === "oneway" || typeParam === "roundtrip")
      setTripType(typeParam);
    if (destinationParam) setDestination(destinationParam);
    if (departureParam) setFromDate(new Date(departureParam));
    if (returnParam) setToDate(new Date(returnParam));
  }, []);

  return (
    <Bounded>
      <h1 className="font-body font-bold text-xl text-center">
        Welcome to the Digido Airlines!
      </h1>

      <form onSubmit={handleSubmit} className="w-full flex justify-center">
        <div className="mt-24 border rounded-lg p-8 flex flex-col items-start gap-6 w-[500px]">
          {/* Trip Type */}
          <RadioGroup
            value={tripType}
            onValueChange={handleTripTypeChange}
            className="flex justify-center gap-8"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="roundtrip" id="r1" />
              <Label htmlFor="r1">Roundtrip</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="oneway" id="r2" />
              <Label htmlFor="r2">One-way</Label>
            </div>
          </RadioGroup>

          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between gap-4">
              {/* Origin */}
              <div className="main-input">
                <Label>Origin</Label>
                <Select value={origin} onValueChange={handleOriginChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.code} value={d.code}>
                        {d.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination */}
              <div className="main-input">
                <Label>Destination</Label>
                <Select
                  value={destination}
                  onValueChange={handleDestinationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.code} value={d.code}>
                        {d.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between gap-4 w-full">
              {/* Departure Date */}
              <div className="main-input">
                <Label>Departure date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {fromDate
                        ? format(fromDate, "dd/MM/yyyy")
                        : "Pick departure date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => {
                        if (!date) return;
                        if (!isDayAvailable(date, origin)) {
                          toast.error(
                            "This departure date is unavailable for the selected origin."
                          );
                          setFromDate(undefined);
                          updateURLParams({ fromDate: undefined });
                          return;
                        }
                        setFromDate(date);
                        updateURLParams({ fromDate: date });
                      }}
                      disabled={(date) =>
                        !isDayAvailable(date, origin) ||
                        (tripType === "roundtrip" && toDate
                          ? date > toDate
                          : false) ||
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date */}
              {tripType !== "oneway" && (
                <div className="main-input">
                  <Label>Return date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {toDate
                          ? format(toDate, "dd/MM/yyyy")
                          : "Pick return date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={(date) => {
                          if (!date) return;
                          if (!isDayAvailable(date, destination)) {
                            toast.error(
                              "This return date is unavailable for the selected destination."
                            );
                            setToDate(undefined);
                            updateURLParams({ toDate: undefined });
                            return;
                          }
                          setToDate(date);
                          updateURLParams({ toDate: date });
                        }}
                        disabled={(date) =>
                          !isDayAvailable(date, destination) ||
                          (fromDate ? date < fromDate : false) ||
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
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
