import { INewTestObject } from "./INewTestObject";

export interface INewHttpSampler extends INewTestObject {
    parentGuid: string;
    child: {
        type: string;
        data?: {
            name?: string;
            method?: string;
            domain?: string;
            path?: string;
            port?: number;
        }
    }
}