import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface TripTypeSelectorProps {
  value: "roundtrip" | "oneway";
  onChange: (type: "roundtrip" | "oneway") => void;
}

export const TripTypeSelector = ({
  value,
  onChange,
}: TripTypeSelectorProps) => (
  <RadioGroup
    value={value}
    onValueChange={onChange}
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
);
