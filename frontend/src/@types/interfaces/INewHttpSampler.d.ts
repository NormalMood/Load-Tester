import { INewTestObject } from "./INewTestObject";

export interface INewHttpSampler extends INewTestObject {
    parentGuid: string;
    child: {
        type: string;
        data?: {
            method?: string;
            domain?: string;
            name?: string;
        }
    }
}