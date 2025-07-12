import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { format } from "date-fns";

interface DatePickerProps {
  label: string;
  value: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export const DatePicker = ({
  label,
  value,
  onSelect,
  disabled,
}: DatePickerProps) => (
  <div className="main-input">
    <Label>{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {value ? format(value, "dd/MM/yyyy") : `Pick ${label.toLowerCase()}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  </div>
);
