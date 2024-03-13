import Sidebar from "../ui/Sidebar/Sidebar";
import styles from '../../styles/TestScenarios.module.css';
import { useState, useEffect } from 'react';
import TestPlanHeader from "../ui/TestPlanHeader/TestPlanHeader";
import Tab from "../ui/Tab/Tab";
import ThreadGroupHeader from "../ui/ThreadGroupHeader/ThreadGroupHeader";
import ScenarioDashboard from "../ui/ScenarioDashboard/ScenarioDashboard";
import { ITestObject } from "../../@types/interfaces/ITestObject";
import { TestPlanService } from "../../service/TestPlanService";
import { ITestPlan } from "../../@types/interfaces/ITestPlan";
import { IThreadGroup } from "../../@types/interfaces/IThreadGroup";
import Button from "../ui/Button/Button";
import { HTTP_SAMPLER, THREAD_GROUP } from "../../@types/consts/testObjectTypes";
import { OK_RESPONSE_CODE } from "../../api/axiosInstance";
import { INewHttpSampler } from "../../@types/interfaces/INewHttpSampler";
import { NEW_HTTP_SAMPLER_METHOD, NEW_HTTP_SAMPLER_NAME, NEW_THREAD_GROUP_NAME } from "../../@types/consts/defaultNames";

const TestScenarios = () => {
    const [testPlan, setTestPlan] = useState<ITestPlan>()
    const [threadGroups, setThreadGroups] = useState<IThreadGroup[]>([])

    useEffect(() => {
        TestPlanService.getTestPlan().then(response =>
            setTestPlan(response)
        )
    }, [])
    useEffect(() => {
        if (testPlan !== undefined)
            TestPlanService.getChildrenByParentGuid(testPlan?.guid).then(response => 
                setThreadGroups(response)
            )
    }, [testPlan])

    const [selectedThreadGroupGuid, setSelectedThreadGroupGuid] = useState<string | null>(null)

    useEffect(() => {
        if (selectedThreadGroupGuid !== null)
            TestPlanService.getChildrenByParentGuid(selectedThreadGroupGuid).then(response => 
                setScenarioDashboardItems(response)
            )
        else
            setScenarioDashboardItems(null)
    }, [selectedThreadGroupGuid])

    const [scenarioDashboardItems, setScenarioDashboardItems] = useState<ITestObject[] | null>(null)

    const addThreadGroup = async () => {
        await TestPlanService.addTestPlanElement({
            parentGuid: testPlan?.guid as string,
            child: {
                type: THREAD_GROUP,
                data: {
                    name: NEW_THREAD_GROUP_NAME
                }
            }
        }).then(response => {
            if (response.status === OK_RESPONSE_CODE)
                setThreadGroups([...threadGroups, response.data])
        })
    }

    const deleteThreadGroup = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, guid: string) => {
        e.stopPropagation()
        console.log(guid)
        if (testPlan !== undefined)
            await TestPlanService.deleteTestPlanElement(testPlan.guid, guid).then(response => {
                if (response.status === OK_RESPONSE_CODE && response.data) {
                    setThreadGroups(threadGroups.filter(threadGroup => threadGroup.guid !== guid))
                    if (selectedThreadGroupGuid === guid)
                        setSelectedThreadGroupGuid(null)
                }
            })
    }

    const addItem = async (objectType: string) => {
        if (objectType === HTTP_SAMPLER) {
            const newHttpSampler: INewHttpSampler = {
                parentGuid: selectedThreadGroupGuid as string,
                child: {
                    type: HTTP_SAMPLER,
                    data: {
                        method: NEW_HTTP_SAMPLER_METHOD,
                        name: NEW_HTTP_SAMPLER_NAME
                    }
                }
            }
            await TestPlanService.addTestPlanElement(newHttpSampler)
                .then(response => {
                    if (response.status === OK_RESPONSE_CODE) {
                        response.data.parentGuid = selectedThreadGroupGuid as string
                        if (scenarioDashboardItems === null)
                            setScenarioDashboardItems([response.data])
                        else
                            setScenarioDashboardItems([...scenarioDashboardItems, response.data])
                        console.log(response.data)}
                })
        }
    }

    const deleteItem = async (guid: string) => {
        if (selectedThreadGroupGuid !== null)
            await TestPlanService.deleteTestPlanElement(selectedThreadGroupGuid, guid)
                .then(response => {
                    if (response.status === OK_RESPONSE_CODE)
                        if (scenarioDashboardItems)
                            setScenarioDashboardItems(scenarioDashboardItems?.filter(item => item.guid !== guid))
                })
    }

    return (
        <div className={styles.testScenarios}>
            <Sidebar>
                <div className={styles.sidebarContentContainer}>
                    <TestPlanHeader />
                    {threadGroups.map(threadGroup =>
                        <Tab 
                            children={
                                <>
                                    <ThreadGroupHeader 
                                        text={threadGroup?.data?.name} 
                                        mix={selectedThreadGroupGuid === threadGroup.guid && styles.threadGroupTabHeaderActive} 
                                    />
                                    <img 
                                        className={styles.threadGroupDeleteImg} 
                                        src='./images/delete_cross.svg' 
                                        onClick={(e) => deleteThreadGroup(e, threadGroup.guid)}
                                    />
                                </>
                            } 
                            mix={
                                selectedThreadGroupGuid === threadGroup.guid 
                                ? 
                                    [styles.threadGroupTab, styles.threadGroupTabActive].join(' ') 
                                : 
                                    styles.threadGroupTab
                                } 
                            onClick={() => setSelectedThreadGroupGuid(threadGroup.guid)}
                        />)}
                    <Button 
                        children={<span><img src='./images/plus.svg' className={styles.accentButtonImg} />&nbsp;Сценарий</span>}  
                        mix={styles.accentButton}
                        onClick={addThreadGroup}
                    />
                </div>
            </Sidebar>
            <ScenarioDashboard 
                addItemCallback={addItem} 
                deleteItemCallback={deleteItem}
                items={scenarioDashboardItems} 
            />
        </div>
    )
}

export default TestScenarios;