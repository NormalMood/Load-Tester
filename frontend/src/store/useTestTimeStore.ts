import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IThreadGroup } from '../@types/interfaces/IThreadGroup';

const MS_IN_SECOND = 1000;

interface IUseTestTimeStore {
    time: number;
    update: (threadGroups: IThreadGroup[]) => void;
    clear: () => void;
    targetTime: number;
    setTargetTime: () => void;
}

const store = immer<IUseTestTimeStore>((set) => ({
    time: 0,
    update: (threadGroups: IThreadGroup[]) => {
        set((state) => { 
            threadGroups.forEach(threadGroup => {
                if (threadGroup.data?.rampUp !== undefined && threadGroup.data.rampUp > state.time)
                    state.time = threadGroup.data.rampUp
            })
        })
    },
    clear: () => {
        set((state) => { state.time = 0; })
    },
    targetTime: 0,
    setTargetTime: () => {
        set((state) => { state.targetTime = Date.now() + state.time * MS_IN_SECOND })
    }
}))

const useTestTimeStore = create(store)

export default useTestTimeStore;