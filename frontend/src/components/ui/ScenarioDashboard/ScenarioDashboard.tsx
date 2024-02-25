import { ITestObject } from '../../../@types/interfaces/ITestObject';
import { FC } from 'react';
import styles from './ScenarioDashboard.module.css';

interface IScenarioDashboardProps {
    items?: ITestObject[];
}

const ScenarioDashboard: FC<IScenarioDashboardProps> = ({items}) => {
    return (
        <div className={styles.scenarioDashboard}>
            {items?.map(item =>
                <div>{item?.type}</div>)}
        </div>
    )
}

export default ScenarioDashboard;