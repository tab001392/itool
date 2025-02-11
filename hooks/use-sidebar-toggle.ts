import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarToggleStore {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useSidebarToggle = create(
  persist<SidebarToggleStore>(
    (set) => ({
      isOpen: true,
      openSidebar: () => set({ isOpen: true }),
      closeSidebar: () => set({ isOpen: false }),
    }),
    {
      name: "sidebar-toggle",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
