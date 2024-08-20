import create from 'zustand';

interface EditorState {
  editing: {
    url: string;
    id: string;
    template?: string;
  };
  params: {
    key: string;
    encoded: boolean;
    value: string;
  }[];
  includeWWW: boolean;
  loadItem: (
    {
      url,
      id,
      template,
    }: {
      url: string;
      id: string;
      template?: string;
    },
    unencodedParams: string[],
  ) => void;
  setUrl: (url: string) => void;
  setId: (id: string) => void;
  setTemplate: (template: string) => void;
  addParam: (param: { key: string; encoded: boolean; value: string }) => void;
  removeParam: (key: string) => void;
  setParams: (
    params: {
      key: string;
      encoded: boolean;
      value: string;
    }[],
  ) => void;
  setIncludeWWW: (value: boolean) => void;
  setBlank: () => void;
}

// Create the store
export const useEditorStore = create<EditorState>((set) => ({
  editing: {
    url: '',
    id: '',
  },
  params: [],
  includeWWW: false,
  loadItem: ({ url, id, template }, unencodedParams) =>
    set(() => ({
      editing: { url, id, template },
      params: unencodedParams.map((param) => {
        return {
          key: param,
          encoded: false,
          value: '',
        };
      }),
    })),
  setUrl: (url) =>
    set((state) => ({
      editing: {
        ...state.editing,
        url,
      },
    })),
  setId: (id) => set((state) => ({ editing: { ...state.editing, id } })),
  setTemplate: (template) =>
    set((state) => ({
      editing: {
        ...state.editing,
        template,
      },
    })),
  addParam: (param) =>
    set((state) => ({
      params: [
        ...state.params,
        {
          key: param.key.replace(/[&%=?]/g, ''),
          encoded: param.encoded,
          value: param.value.replace(/[&%=?]/g, ''),
        },
      ],
    })),
  removeParam: (key) =>
    set((state) => ({
      params: state.params.filter((param) => param.key !== key),
    })),
  setParams: (params) =>
    set(() => ({
      // every value strip out & or % or = or ?
      params: params.map((param) => {
        return {
          key: param.key.replace(/[&%=?]/g, ''),
          encoded: param.encoded,
          value: param.value.replace(/[&%=?]/g, ''),
        };
      }),
    })),
  setIncludeWWW: (value) => set(() => ({ includeWWW: value })),
  setBlank: () =>
    set((state) => ({
      editing: {
        url: '',
        id: '',
      },
      params: [],
      includeWWW: state.includeWWW,
    })),
}));
