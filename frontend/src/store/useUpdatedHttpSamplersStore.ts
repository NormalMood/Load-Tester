import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer'
import { IHttpSampler } from '../@types/interfaces/IHttpSampler';

enableMapSet();

interface IUseUpdatedHttpSamplersStore {
    guidToHttpSampler: Map<string, IHttpSampler>;
    setHttpSampler: (guid: string, httpSampler: IHttpSampler) => void;
    clear: () => void;
}

const store = immer<IUseUpdatedHttpSamplersStore>((set) => ({
    guidToHttpSampler: new Map(),
    setHttpSampler: (guid: string, httpSampler: IHttpSampler) => {
        set((state) => { state.guidToHttpSampler.set(guid, httpSampler) })
    },
    clear: () => {
        set((state) => { state.guidToHttpSampler.clear() })
    }
}))

const useUpdatedHttpSamplersStore = create(store)

export default useUpdatedHttpSamplersStore;