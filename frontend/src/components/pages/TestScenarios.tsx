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
import { THREAD_GROUP } from "../../@types/consts/testObjectTypes";
import { OK_RESPONSE_CODE } from "../../api/axiosInstance";

const TestScenarios = () => {
    const [testPlan, setTestPlan] = useState<ITestPlan>()
    const [threadGroups, setThreadGroups] = useState<IThreadGroup[]>([])

    const NEW_THREAD_GROUP_NAME = 'Тестовый сценарий'

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
            setScenarioDashboardItems([])
    }, [selectedThreadGroupGuid])

    const [scenarioDashboardItems, setScenarioDashboardItems] = useState<ITestObject[]>([])

    const addThreadGroup = async () => {
        await TestPlanService.addTestPlanElement({
            parentGuid: testPlan?.guid,
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
            <ScenarioDashboard items={scenarioDashboardItems} />
        </div>
    )
}

export default TestScenarios;