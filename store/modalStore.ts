import { create } from 'zustand';
import type { AdminModalState } from "@/types/store";

export const useModalStore = create<AdminModalState>((set) => ({
  isUpdateStatusOpen: false,
  openUpdateStatus: () => set({ isUpdateStatusOpen: true }),
  closeUpdateStatus: () => set({ isUpdateStatusOpen: false }),
}));
