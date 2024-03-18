import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer'
import { IThreadGroup } from '../@types/interfaces/IThreadGroup';

enableMapSet();

interface IUseUpdatedThreadGroupsStore {
    threadGroup: IThreadGroup | null;
    setThreadGroup: (threadGroup: IThreadGroup) => void;
    clear: () => void;
}

const store = immer<IUseUpdatedThreadGroupsStore>((set) => ({
    threadGroup: null,
    setThreadGroup: (threadGroup: IThreadGroup) => {
        set((state) => { state.threadGroup = threadGroup })
    },
    clear: () => {
        set((state) => { state.threadGroup = null })
    }
}))

const useUpdatedThreadGroupsStore = create(store)

export default useUpdatedThreadGroupsStore;