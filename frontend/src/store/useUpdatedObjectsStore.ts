import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ITestObject } from '../@types/interfaces/ITestObject';
import { enableMapSet } from 'immer'

enableMapSet();

interface IUseUpdatedObjectsStore {
    guidToObject: Map<string, ITestObject>;
    setObject: (guid: string, object: ITestObject) => void;
    clear: () => void;
}

const store = immer<IUseUpdatedObjectsStore>((set) => ({
    guidToObject: new Map(),
    setObject: (guid: string, object: ITestObject) => {
        set((state) => { state.guidToObject.set(guid, object) })
    },
    clear: () => {
        set((state) => { state.guidToObject.clear() })
    }
}))

const useUpdatedObjectsStore = create(store)

export default useUpdatedObjectsStore;