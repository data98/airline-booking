import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Label } from "./ui/label";
import { FlightDestination } from "@/types/FlightDestination";

interface CitySelectorProps {
  label: string;
  value: string | null;
  onChange: (code: string) => void;
  destinations: FlightDestination[];
}

export const CitySelector = ({
  label,
  value,
  onChange,
  destinations,
}: CitySelectorProps) => (
  <div className="main-input">
    <Label>{label}</Label>
    <Select value={value ?? undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
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
);
