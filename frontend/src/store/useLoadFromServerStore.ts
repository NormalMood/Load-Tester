import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer'
import { ILoadFromServer } from '../@types/interfaces/ILoadFromServer';
import { getHHMMFromTimeStamp } from '../utils/Utils';

enableMapSet();

interface ILoad {
    timeStamp: string[];
    memory: number[];
    cpu: number[];
}

interface IUseLoadFromServerStore {
    serverToLoad: Map<string, ILoad | undefined>;
    setLoadFromServerResponse: (server: string, loadFromServerResponse: ILoadFromServer) => void;
    clear: () => void;
}

const store = immer<IUseLoadFromServerStore>((set) => ({
    serverToLoad: new Map<string, ILoad | undefined>(),
    setLoadFromServerResponse: (server: string, loadFromServerResponse: ILoadFromServer) => {
        set((state) => { 
            if (loadFromServerResponse.timeStamp !== undefined) {
                const loads = state.serverToLoad.get(server)
                if (loads === undefined) {
                    const load: ILoad = {
                        timeStamp: [getHHMMFromTimeStamp(loadFromServerResponse.timeStamp)],
                        memory: [Number(loadFromServerResponse.memory)],
                        cpu: [Number(loadFromServerResponse.cpu)]
                    }
                    state.serverToLoad.set(server, load)
                }
                else {
                    loads.timeStamp.push(getHHMMFromTimeStamp(loadFromServerResponse.timeStamp))
                    loads.memory.push(Number(loadFromServerResponse.memory))
                    loads.cpu.push(Number(loadFromServerResponse.cpu))
                    state.serverToLoad.set(server, loads)
                }
            }
        })
    },
    clear: () => {
        set((state) => { state.serverToLoad.clear(); })
    }
}))

const useLoadFromServerStore = create(store)

export default useLoadFromServerStore;