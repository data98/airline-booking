import { AirlineFormWrapper } from "@/components/AirlineFormWrapper";
import { FlightDestination } from "@/types/FlightDestination";

export default function Home() {
  const destinations: FlightDestination[] = [
    {
      city: "London",
      code: "LON",
      country: "United Kingdom",
      airportName: "Heathrow Airport",
      availableWeekdays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      city: "New York",
      code: "NYC",
      country: "United States",
      airportName: "John F. Kennedy International Airport",
      availableWeekdays: [1, 2, 3, 4, 5],
    },
    {
      city: "Paris",
      code: "PAR",
      country: "France",
      airportName: "Charles de Gaulle Airport",
      availableWeekdays: [0, 6],
    },
    {
      city: "Tokyo",
      code: "TYO",
      country: "Japan",
      airportName: "Narita International Airport",
      availableWeekdays: [3],
    },
  ];

  return <AirlineFormWrapper destinations={destinations} />;
}
