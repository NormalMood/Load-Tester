import { ITestObject } from "./ITestObject";

export interface IThreadGroup extends ITestObject {
    data?: {
        name?: string;
        threads?: number;
        rampUp?: number;
        loops?: number;
    }
}