import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";

// TODO: implement the airlineForm component

export interface AirlineFormProps {
  destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
  return (
    <Bounded>
      <h1 className="font-body font-bold text-xl text-center">
        Welcome to the Digido Airlines!
        {/* comment for testing commiting by ssh*/}
      </h1>
    </Bounded>
  );
};
