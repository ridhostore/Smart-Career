import { create } from "zustand";

interface UiStore {
  sidebarOpen: boolean;
  activeModal: string | null;
  globalLoading: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveModal: (modalName: string | null) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  activeModal: null,
  globalLoading: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveModal: (modalName) => set({ activeModal: modalName }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));
