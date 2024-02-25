import { ITestObject } from "./ITestObject";

export interface IThreadGroup extends ITestObject {
    data?: {
        name?: string;
    }
}