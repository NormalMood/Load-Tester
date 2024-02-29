import { ITestObject } from "./ITestObject";

export interface INewTestObject {
    parentGuid?: string;
    child: {
        type: string;
        data?: {
            name?: string;
        }
    }
}