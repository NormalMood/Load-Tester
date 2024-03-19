import { FC } from 'react';
import styles from './TestPlanHeader.module.css';
import { TestPlanService } from '../../../service/TestPlanService';

interface ITestPlanHeaderProps {
    guid?: string;
}

const TestPlanHeader: FC<ITestPlanHeaderProps> = ({guid}) => {
    const startTest = async () => {
        if (guid !== undefined) 
            await TestPlanService.startTest(guid)
    }
    return (
        <div className={styles.testPlanHeader}>
            <span className={styles.testPlanHeaderText}>Тестовый план</span>
            <div 
                className={styles.startButtonContainer}
                onClick={() => startTest()}
            >
                <img src='./images/start.svg' className={styles.startButton} />
            </div>
        </div>
    )
}

export default TestPlanHeader;