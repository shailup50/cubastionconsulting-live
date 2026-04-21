import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isUpdateStatusOpen: false,
  openUpdateStatus: () => set({ isUpdateStatusOpen: true }),
  closeUpdateStatus: () => set({ isUpdateStatusOpen: false }),
}));
