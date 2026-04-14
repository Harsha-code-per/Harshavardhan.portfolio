import { useSyncExternalStore } from "react";
import { create } from "zustand";

type GlobalState = {
  isWebGLReady: boolean;
  activeSection: string;
  setWebGLReady: (isReady: boolean) => void;
  setActiveSection: (section: string) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  isWebGLReady: false,
  activeSection: "hero",
  setWebGLReady: (isReady) => set({ isWebGLReady: isReady }),
  setActiveSection: (section) => set({ activeSection: section }),
}));

export function useGlobalStoreFallback<T>(
  selector: (state: GlobalState) => T,
  fallbackValue: T
) {
  const selectedValue = useGlobalStore(selector);
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  return isMounted ? selectedValue : fallbackValue;
}
