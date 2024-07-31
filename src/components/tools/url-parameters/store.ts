import { create } from 'zustand';

interface URLParameterBuilderStore {
  url: string;
  unencodedParameters: string[];
  setURL: (url: string) => void;
  setEncoding: (parameter: string, encoded: boolean) => void;
  setUnencodedParameters: (parameters: string[]) => void;
}
export const useURLParameterBuilderStore = create<URLParameterBuilderStore>(
  (set) => ({
    url: '',
    unencodedParameters: [],
    setURL: (url: string) => set({ url }),
    setEncoding: (parameter: string, encoded: boolean) => {
      set((state) => {
        const unencodedParameters = state.unencodedParameters;
        if (encoded) {
          return {
            unencodedParameters: unencodedParameters.filter(
              (p) => p !== parameter,
            ),
          };
        } else {
          return { unencodedParameters: [...unencodedParameters, parameter] };
        }
      });
    },
    setUnencodedParameters: (parameters: string[]) =>
      set({ unencodedParameters: parameters }),
  }),
);
