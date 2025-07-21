"use server";

import axios from "axios";

export async function bookFlight(previousState: any, formData: FormData) {
  const origin = formData.get("origin") as string;
  const destination = formData.get("destination") as string;
  const type = formData.get("type") as "roundtrip" | "oneway";
  const departureDate = formData.get("departureDate") as string;
  const returnDate = formData.get("returnDate") as string | null;

  const payload = {
    origin,
    destination,
    type,
    departureDate,
    ...(type === "roundtrip" && returnDate ? { returnDate } : {}),
  };

  try {
    const res = await axios.post(
      "https://airline-booking-nine.vercel.app/api/booking",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-key": process.env.BOOKING_API_KEY ?? "",
        },
      }
    );

    // revalidatePath

    return {
      success: true,
      bookingId: res.data.bookingId,
      status: res.data.status,
      timestamp: res.data.timestamp,
    };
  } catch (error: any) {
    console.error("Booking failed:", error?.message || error);
    return { success: false, error: "Booking failed" };
  }
}
