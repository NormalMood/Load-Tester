import { ITestObject } from "../@types/interfaces/ITestObject";
import { ITestPlan } from "../@types/interfaces/ITestPlan";
import { INewTestObject } from "../@types/interfaces/INewTestObject";
import { BASE_API_URL, axiosInstance } from "../api/axiosInstance";

export class TestPlanService {

    static async getTestPlan() {
        const response = await axiosInstance.get<ITestPlan>(
            BASE_API_URL + '/test-plan'
        )
        return response.data
    }

    static async getChildrenByParentGuid(parentGuid: string) {
        const response = await axiosInstance.get<ITestObject[]>(
            BASE_API_URL + '/test-plan/elements',
            {
                params: {
                    parentGuid
                }
            }
        )
        return response.data
    }

    static async addTestPlanElement(newElement: INewTestObject) {
        return await axiosInstance.post<ITestObject>(
            BASE_API_URL + '/test-plan/element',
            newElement
        )
    }

}