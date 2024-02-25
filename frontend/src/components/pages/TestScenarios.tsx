import Sidebar from "../ui/Sidebar/Sidebar";
import styles from '../../styles/TestScenarios.module.css';
import { useState } from 'react';
import TestPlanHeader from "../ui/TestPlanHeader/TestPlanHeader";
import Tab from "../ui/Tab/Tab";
import ThreadGroupHeader from "../ui/ThreadGroupHeader/ThreadGroupHeader";

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
        </div>
    )
}

export default TestScenarios;