import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateDailyTotals = (bookings) => {
  const dailyTotals = { cash: 0, card: 0 };

  bookings.forEach((booking) => {
    const amount = parseFloat(booking.totalAmount);

    if (booking.paymentMethod === "Cash") {
      dailyTotals.cash += amount;
    } else if (booking.paymentMethod === "Card") {
      dailyTotals.card += amount;
    }
  });

  return dailyTotals;
};
