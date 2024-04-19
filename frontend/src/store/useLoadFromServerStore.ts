import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer'
import { ILoadFromServer } from '../@types/interfaces/ILoadFromServer';

enableMapSet();

interface IUseLoadFromServerStore {
    loadFromServer: ILoadFromServer[];
    addLoadFromServerResponse: (loadFromServerResponse: ILoadFromServer) => void;
    clear: () => void;
}

const store = immer<IUseLoadFromServerStore>((set) => ({
    loadFromServer: [],
    addLoadFromServerResponse: (loadFromServerResponse: ILoadFromServer) => {
        set((state) => { state.loadFromServer.push(loadFromServerResponse) })
    },
    clear: () => {
        set((state) => { state.loadFromServer = [] })
    }
}))

const useLoadFromServerStore = create(store)

export default useLoadFromServerStore;