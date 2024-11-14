import { create } from "zustand";

type NewBookingStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewBooking = create<NewBookingStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
