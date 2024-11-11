// hooks/use-new-room.ts
import { create } from "zustand";

type NewRoomStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewRoom = create<NewRoomStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
