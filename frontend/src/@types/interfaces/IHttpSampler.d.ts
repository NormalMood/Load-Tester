import { ITestObject } from "./ITestObject";

export interface IHttpSampler extends ITestObject {
    data?: {
        name?: string;
        domain?: string;
        method?: string;
    }
}