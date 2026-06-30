import { create } from "zustand";

interface ModeState {
  isRecruiterMode: boolean;
  toggleRecruiterMode: () => void;
}

export const useModeStore = create<ModeState>((set) => {
  return {
    isRecruiterMode: false,
    toggleRecruiterMode: () =>
      set((state) => ({ isRecruiterMode: !state.isRecruiterMode })),
  };
});
