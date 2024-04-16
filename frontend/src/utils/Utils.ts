import { IFailedTestRequests } from "../@types/interfaces/IFailedTestRequests";
import { ITestObject } from "../@types/interfaces/ITestObject";
import { ITestResultsTimesObject } from "../@types/interfaces/ITestResultsTimesObject";

export const getObjectsArrayFromMap = (map: Map<string, ITestObject>) => {
    const arr = new Array<ITestObject>()
    map.forEach(elem => arr.push(elem))
    return arr
}

const getHHMMFromTimeStamp = (timeStamp: string) => {
    const date = new Date(parseInt(timeStamp))
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const formattedHours = hours < 10 ? '0' + hours : hours
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const getURLToTestResultsMapFromArray = (testResults: string[][]) => {
    const result = new Map<string, ITestResultsTimesObject>();

    for (let i = 1; i < testResults.length; i++) {
        const [timeStamp, elapsed, success, URL, latency, connect] = testResults[i];
        
        if (!result.has(URL)) {
            result.set(URL, { timeStamp: [], connect: [], latency: [], elapsed: [] });
        }
        
        const value = result.get(URL);

        if (value !== undefined) {
            value.timeStamp.push(getHHMMFromTimeStamp(timeStamp))
            value.connect.push(parseInt(connect));
            value.latency.push(parseInt(latency));
            value.elapsed.push(parseInt(elapsed));
            
            result.set(URL, value);
        }
    }
    
    return result
}

export const getErrorsAndURLObjectFromArray = (testResults: string[][]) => {
    const result: IFailedTestRequests = {
        errors: 0,
        URL: new Set<string>()
    }

    for (let i = 1; i < testResults.length; i++) {
        const [timeStamp, elapsed, success, URL, latency, connect] = testResults[i];
        if (success === "false") {
            result.errors++
            result.URL.add(URL)
        }
    }

    return result
}