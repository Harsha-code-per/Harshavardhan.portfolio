import { create } from "zustand";

interface ModeState {
  isRecruiterMode: boolean;
  isAudioMuted: boolean;
  toggleRecruiterMode: () => void;
  setAudioMuted: (muted: boolean) => void;
}

export const useModeStore = create<ModeState>((set) => {
  return {
    isRecruiterMode: false,
    isAudioMuted: true, // safe default for SSR initial render
    toggleRecruiterMode: () =>
      set((state) => ({ isRecruiterMode: !state.isRecruiterMode })),
    setAudioMuted: (muted) => set({ isAudioMuted: muted }),
  };
});
