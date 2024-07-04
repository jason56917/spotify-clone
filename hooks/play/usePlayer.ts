import { create } from 'zustand'

type State = {
  ids: string[]
  activeId?: string
  setId: (id: string) => void
  setIds: (ids: string[]) => void
  reset: () => void
}

// 用來記錄當前撥放的id與整個列表的id
export const usePlayer = create<State>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids: ids }),
  reset: () => set({ ids: [], activeId: undefined }),
}))