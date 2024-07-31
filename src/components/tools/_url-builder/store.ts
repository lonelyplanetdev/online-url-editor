import dynamic from 'next/dynamic';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BaseParam = {
  key: string;
  encoded: boolean;
  value: string;
};

export type UrlParams = {
  dynamic?: BaseParam[];
  template?: string;
  fieldValues?: BaseParam[];
};

export type UrlItem = {
  id: string;
  base: string;
  lastEdited: number;
  params: UrlParams;
};
export type UrlItemWithoutBase = Omit<UrlItem, 'base'>;

interface UrlBuilderState {
  urls: UrlItem[];
  selected: string | null;
  setParams: (id: string, params: UrlParams) => void;
  upsertUrl: (
    id: string,
    { base, params }: { base: string; params: UrlParams },
  ) => void;
  clearUrls: () => void;
  removeUrl: (id: string) => void;
  setSelected: (id: string | null) => void;
}

export const useUrlBuilderStore = create<UrlBuilderState>()(
  persist(
    (set) => ({
      urls: [],
      selected: null,
      setParams: (base, params) =>
        set((state) => ({
          urls: state.urls.map((url) =>
            url.base === base ? { ...url, params } : url,
          ),
        })),
      removeUrl: (id) =>
        set((state) => ({
          urls: state.urls.filter((url) => url.id !== id),
        })),
      clearUrls: () =>
        set((state) => ({
          urls: [],
        })),
      setSelected: (id) =>
        set((state) => ({
          selected: id
            ? state.urls.map((url) => url.id).includes(id)
              ? id
              : null
            : null,
        })),
      upsertUrl: (id, data) =>
        set((state) => ({
          urls: state.urls.find((url) => url.id === id)
            ? state.urls.map((url) =>
                url.id === id
                  ? { ...url, ...data, id, lastEdited: Date.now() }
                  : url,
              )
            : [...state.urls, { ...data, id, lastEdited: Date.now() }],
        })),
    }),
    {
      name: 'tool-url-builder',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        urls: state.urls,
      }),
    },
  ),
);
