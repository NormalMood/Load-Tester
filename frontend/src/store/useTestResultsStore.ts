import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer'
import { ITestResultsTimesObject } from '../@types/interfaces/ITestResultsTimesObject';
import { IFailedTestRequests } from '../@types/interfaces/IFailedTestRequests';

enableMapSet();

interface IUseTestResultsStore {
    urlToTimes: Map<string, ITestResultsTimesObject>;
    setURLToTimes: (urlToTimes: Map<string, ITestResultsTimesObject>) => void;
    clearURLToTimes: () => void;

    failedRequests: IFailedTestRequests;
    setFailedRequests: (failedRequests: IFailedTestRequests) => void;
    clearFailedRequests: () => void;
}

const store = immer<IUseTestResultsStore>((set) => ({
    urlToTimes: new Map(),
    setURLToTimes: (urlToTimes: Map<string, ITestResultsTimesObject>) => {
        set((state) => { state.urlToTimes = urlToTimes })
    },
    clearURLToTimes: () => {
        set((state) => { state.urlToTimes.clear() })
    },

    failedRequests: { errors: 0, URL: new Set<string>() },
    setFailedRequests: (failedRequests: IFailedTestRequests) => {
        set((state) => { state.failedRequests = failedRequests })
    },
    clearFailedRequests: () => {
        set((state) => { state.failedRequests = { errors: 0, URL: new Set<string>() } })
    }
}))

const useTestResultsStore = create(store)

export default useTestResultsStore;