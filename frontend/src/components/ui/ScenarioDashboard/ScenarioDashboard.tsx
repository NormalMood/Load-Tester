import { ITestObject } from '../../../@types/interfaces/ITestObject';
import { FC, useState, useRef, useEffect } from 'react';
import styles from './ScenarioDashboard.module.css';
import HttpSampler from '../HttpSampler/HttpSampler';
import Button from '../Button/Button';
import testScenarioStyles from '../../../styles/TestScenarios.module.css';

interface IScenarioDashboardProps {
    items?: ITestObject[] | null;
}

const ScenarioDashboard: FC<IScenarioDashboardProps> = ({items}) => {
    const [isObjectsOptionVisible, setIsObjectsOptionVisible] = useState(false)
    const objectsOptionRef = useRef<HTMLDivElement>(null)
    const handleClickOutside = (e: any) => {
        if (objectsOptionRef.current && !objectsOptionRef.current.contains(e.target))
            setIsObjectsOptionVisible(false)
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [])

    return (
        <div className={styles.scenarioDashboard}>
            <div className={styles.scenarioObjectsContainer}>
                {items?.map(item =>
                    <>
                        <div className={styles.scenarioObjectContainer}>
                            <HttpSampler httpSampler={item} />
                        </div>
                    </>
                )}
                {items !== null &&
                    <Button 
                        children={
                            <span>
                                <img 
                                    src='./images/plus.svg' 
                                    className={testScenarioStyles.accentButtonImg} 
                                />
                                &nbsp;Элемент сценария
                            </span>
                        }  
                        mix={[testScenarioStyles.accentButton, styles.newObjectButton].join(' ')}
                        onClick={() => setIsObjectsOptionVisible(true)}
                    />
                }
                <div 
                    ref={objectsOptionRef} 
                    className={isObjectsOptionVisible? styles.objectsOptionPopup : styles.objectsOptionPopupHidden}
                >
                    <div 
                        className={styles.optionContainer}
                        onClick={() => setIsObjectsOptionVisible(false)}
                    >
                        <img src='./images/request.svg' className={styles.requestImg} />
                        <span>&nbsp;&nbsp;Запрос</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScenarioDashboard;