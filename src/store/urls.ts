import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Define the store
interface URLState {
  urls: {
    url: string;
    id: string;
    timestamp: number;
    unencodedParams: string[];
    template?: string;
  }[];
  selected: string | null;
  setSelected: (id: string) => void;
  addUrl: (
    id: string,
    url: string,
    unencodedParams: string[],
    template?: string,
  ) => void;
  updateUrl: (
    id: string,
    url: string,
    unencodedParams: string[],
    template?: string,
  ) => void;
  removeUrl: (id: string) => void;
  wipeUrls: () => void;
}

// Create the store
export const useURLStore = create<URLState>()(
  persist(
    (set, get) => ({
      urls: [],
      selected: null,
      setSelected: (id) =>
        set((state) => ({
          selected: state.urls.map((url) => url.id).includes(id) ? id : null,
        })),
      addUrl: (id, url, unencodedParams, template) =>
        set((state) => ({
          urls: [
            ...state.urls,
            { url, id, timestamp: Date.now(), unencodedParams, template },
          ],
        })),
      updateUrl: (id, url, unencodedParams, template) =>
        set((state) => ({
          urls: url
            ? [
                ...state.urls.filter((url) => url.id !== id),
                { url, id, timestamp: Date.now(), unencodedParams, template },
              ]
            : state.urls.filter((url) => url.id !== id),
        })),
      removeUrl: (id) =>
        set((state) => ({
          urls: state.urls.filter((url) => url.id !== id),
        })),
      wipeUrls: () =>
        set({
          urls: [
            // { url: 'https://www.google.com', id: '1', timestamp: 1632770120000 },
            // { url: 'https://www.facebook.com', id: '2', timestamp: 1632770120000 },
            // { url: 'https://www.twitter.com', id: '3', timestamp: 1632770120000 },
          ],
        }),
    }),
    {
      name: 'url-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        urls: state.urls,
      }),
    },
  ),
);
