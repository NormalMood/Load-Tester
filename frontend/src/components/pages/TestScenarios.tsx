import Sidebar from "../ui/Sidebar/Sidebar";
import styles from '../../styles/TestScenarios.module.css';
import { useState } from 'react';
import TestPlanHeader from "../ui/TestPlanHeader/TestPlanHeader";
import Tab from "../ui/Tab/Tab";
import ThreadGroupHeader from "../ui/ThreadGroupHeader/ThreadGroupHeader";
import ScenarioDashboard from "../ui/ScenarioDashboard/ScenarioDashboard";
import { ITestObject } from "../../@types/interfaces/ITestObject";

const TestScenarios = () => {
    const [testPlan, setTestPlan] = useState({
        guid: 'test-plan-guid',
        type: 'testPlan'
    })
    const [threadGroups, setThreadGroups] = useState([
        {
            data: {
                name: 'Тестовый сценарий 1'
            }
        },
        {
            data: {
                name: 'Тестовый сценарий 1'
            }
        },
        {
            data: {
                name: 'Тестовый сценарий 1'
            }
        },
        {
            data: {
                name: 'Тестовый сценарий 1'
            }
        }
    ])
    const [selectedTabIndex, setSelectedTabIndex] = useState<number | null>(null)
    const [scenarioDashboardItems, setScenarioDashboardItems] = useState<ITestObject[]>([
        {
            guid: 'http-sampler-1',
            type: 'httpSampler'
        },
        {
            guid: 'http-sampler-2',
            type: 'httpSampler'
        },
        {
            guid: 'while-controller-1',
            type: 'whileController'
        }
    ])
    return (
        <div className={styles.testScenarios}>
            <Sidebar>
                <TestPlanHeader />
                {threadGroups.map((threadGroup, index) =>
                    <Tab 
                        children={
                            <ThreadGroupHeader 
                                text={threadGroup?.data?.name} 
                                mix={selectedTabIndex === index && styles.threadGroupTabHeaderActive} 
                            />
                        } 
                        mix={
                            selectedTabIndex === index 
                            ? 
                                [styles.threadGroupTab, styles.threadGroupTabActive].join(' ') 
                            : 
                                styles.threadGroupTab
                            } 
                        onClick={() => setSelectedTabIndex(index)}
                    />)}
            </Sidebar>
            <ScenarioDashboard items={scenarioDashboardItems} />
        </div>
    )
}

export default TestScenarios;