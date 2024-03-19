import { ITestObject } from "./ITestObject";

export interface IHttpSampler extends ITestObject {
    data?: {
        name?: string;
        method?: string;
        domain?: string;
        path?: string;
        port?: number;
        bodyJson?: string;
        headerKeys?: string[];
        headerValues?: string[];
    }
}