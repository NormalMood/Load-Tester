import { ITestObject } from '../../../@types/interfaces/ITestObject';
import { FC } from 'react';
import styles from './ScenarioDashboard.module.css';
import HttpSampler from '../HttpSampler/HttpSampler';

interface IScenarioDashboardProps {
    items?: ITestObject[];
}

const ScenarioDashboard: FC<IScenarioDashboardProps> = ({items}) => {
    return (
        <div className={styles.scenarioDashboard}>
            <div className={styles.scenarioObjectsContainer}>
                {items?.map(item =>
                    <HttpSampler httpSampler={item} />)}
            </div>
        </div>
    )
}

export default ScenarioDashboard;