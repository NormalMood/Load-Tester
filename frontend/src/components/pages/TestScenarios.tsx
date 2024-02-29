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
    }, [selectedThreadGroupGuid])

    const [scenarioDashboardItems, setScenarioDashboardItems] = useState<ITestObject[]>([])
    return (
        <div className={styles.testScenarios}>
            <Sidebar>
                <TestPlanHeader />
                {threadGroups.map(threadGroup =>
                    <Tab 
                        children={
                            <ThreadGroupHeader 
                                text={threadGroup?.data?.name} 
                                mix={selectedThreadGroupGuid === threadGroup.guid && styles.threadGroupTabHeaderActive} 
                            />
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
            </Sidebar>
            <ScenarioDashboard items={scenarioDashboardItems} />
        </div>
    )
}

export default TestScenarios;