"use client";

import { useState } from "react";
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

    if (fromDate && !isDayAvailable(fromDate, code)) {
      setFromDate(undefined);
      toast.error(
        "Previously selected departure date is unavailable for the new origin."
      );
    }
  };

  const handleDestinationChange = (code: string) => {
    setDestination(code);

    if (toDate && !isDayAvailable(toDate, code)) {
      setToDate(undefined);
      toast.error(
        "Previously selected return date is unavailable for the new destination."
      );
    }
  };

  return (
    <Bounded>
      <h1 className="font-body font-bold text-xl text-center">
        Welcome to the Digido Airlines!
      </h1>

      <form className="w-full flex justify-center">
        <div className="mt-24 border rounded-lg p-8 flex flex-col items-start gap-6 w-[500px]">
          {/* Trip Type */}
          <RadioGroup
            value={tripType}
            onValueChange={(v) => setTripType(v as "roundtrip" | "oneway")}
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
                <Select onValueChange={handleOriginChange}>
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
                <Select onValueChange={handleDestinationChange}>
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
                          // alert(
                          //   "This departure date is unavailable for the selected origin."
                          // );
                          toast.error(
                            "This departure date is unavailable for the selected origin."
                          );
                          return;
                        }
                        setFromDate(date);
                      }}
                      disabled={(date) => !isDayAvailable(date, origin) || (toDate ? date > toDate : false)}
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
                            // alert(
                            //   "This return date is unavailable for the selected destination."
                            // );
                            toast.error(
                              "This return date is unavailable for the selected destination."
                            );
                            return;
                          }
                          setToDate(date);
                        }}
                        disabled={(date) => !isDayAvailable(date, destination) || (fromDate ? date < fromDate : false)}
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
