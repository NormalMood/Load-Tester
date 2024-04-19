import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer'
import { ILoadFromServer } from '../@types/interfaces/ILoadFromServer';
import { getHHMMFromTimeStamp } from '../utils/Utils';

enableMapSet();

interface IUseLoadFromServerStore {
    timeStamp: string[];
    memory: number[];
    cpu: number[];
    addLoadFromServerResponse: (loadFromServerResponse: ILoadFromServer) => void;
    clear: () => void;
}

const store = immer<IUseLoadFromServerStore>((set) => ({
    timeStamp: [],
    memory: [],
    cpu: [],
    addLoadFromServerResponse: (loadFromServerResponse: ILoadFromServer) => {
        set((state) => { 
            state.timeStamp.push(getHHMMFromTimeStamp(loadFromServerResponse.timeStamp));
            state.memory.push(Number(loadFromServerResponse.memory));
            state.cpu.push(Number(loadFromServerResponse.cpu));
        })
    },
    clear: () => {
        set((state) => { state.timeStamp = []; state.memory = []; state.cpu = []; })
    }
}))

const useLoadFromServerStore = create(store)

export default useLoadFromServerStore;