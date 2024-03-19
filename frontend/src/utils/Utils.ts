import { ITestObject } from "../@types/interfaces/ITestObject";

export const getObjectsArrayFromMap = (map: Map<string, ITestObject>) => {
    const arr = new Array<ITestObject>()
    map.forEach(elem => arr.push(elem))
    return arr
}
