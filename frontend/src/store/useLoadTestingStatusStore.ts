import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface IUseLoadTestingStatusStore {
    isFinished: boolean;
    setIsFinished: (isFinished: boolean) => void;
}

const store = immer<IUseLoadTestingStatusStore>((set) => ({
    isFinished: true,
    setIsFinished: (isFinished: boolean) => {
        set((state) => { 
            state.isFinished = isFinished
        })
    }
}))

const useLoadTestingStatusStore = create(store)

export default useLoadTestingStatusStore;