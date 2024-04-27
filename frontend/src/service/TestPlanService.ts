import { INewTestObject } from "../@types/interfaces/INewTestObject";
import { ITestObject } from "../@types/interfaces/ITestObject";
import { ITestPlan } from "../@types/interfaces/ITestPlan";
import { IThreadGroup } from "../@types/interfaces/IThreadGroup";
import { BASE_API_URL, axiosInstance } from "../api/axiosInstance";

export class TestPlanService {

    static async getTestPlan() {
        const response = await axiosInstance.get<ITestPlan>(
            BASE_API_URL + '/test-plan'
        )
        return response.data
    }

    static async getChildrenByParentGuid(parentGuid: string) {
        return await axiosInstance.get<ITestObject[]>(
            BASE_API_URL + '/test-plan/elements',
            {
                params: {
                    parentGuid
                }
            }
        )
    }

    static async addTestPlanElement(newElement: INewTestObject) {
        return await axiosInstance.post<ITestObject>(
            BASE_API_URL + '/test-plan/element',
            newElement
        )
    }

    static async deleteTestPlanElement(parentGuid: string, guid: string) {
        return await axiosInstance.delete<Boolean>(
            BASE_API_URL + '/test-plan/element',
            {
                params: {
                    parentGuid,
                    guid
                }
            }
        )
    }

    static async updateTestPlanElements(updatedElements: ITestObject[]) {
        return await axiosInstance.put<Boolean>(
            BASE_API_URL + '/test-plan/elements',
            updatedElements
        )
    }

    static async updateThreadGroup(updatedThreadGroup: IThreadGroup) {
        return await axiosInstance.put<Boolean>(
            BASE_API_URL + '/test-plan/thread-group',
            updatedThreadGroup
        )
    }

    static async startTest(testPlanGuid: string) {
        return await axiosInstance.get<string[][]>(
            BASE_API_URL + '/test-plan/result',
            {
                params: {
                    guid: testPlanGuid
                }
            }
        )
    }

    static async stopTest() {
        return await axiosInstance.delete<Boolean>(
            BASE_API_URL + '/test-plan/result'
        )
    }

}