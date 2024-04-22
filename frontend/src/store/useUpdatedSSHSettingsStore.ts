import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer'
import { ISSHSettings } from '../@types/interfaces/ISSHSettings';

enableMapSet();

interface IUseUpdatedSSHSettingsStore {
    guidToSSHSettings: Map<string, ISSHSettings>;
    setSSHSettings: (guid: string, sshSettings: ISSHSettings) => void;
    clear: () => void;
}

const store = immer<IUseUpdatedSSHSettingsStore>((set) => ({
    guidToSSHSettings: new Map(),
    setSSHSettings: (guid: string, sshSettings: ISSHSettings) => {
        set((state) => { state.guidToSSHSettings.set(guid, sshSettings) })
    },
    clear: () => {
        set((state) => { state.guidToSSHSettings.clear() })
    }
}))

const useUpdatedSSHSettingsStore = create(store)

export default useUpdatedSSHSettingsStore;