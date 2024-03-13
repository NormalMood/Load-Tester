import { ITestObject } from '../../../@types/interfaces/ITestObject';
import { FC, useState, useRef, useEffect } from 'react';
import styles from './ScenarioDashboard.module.css';
import HttpSampler from '../HttpSampler/HttpSampler';
import Button from '../Button/Button';
import testScenarioStyles from '../../../styles/TestScenarios.module.css';
import Popup from '../Popup/Popup';
import { HTTP_SAMPLER } from '../../../@types/consts/testObjectTypes';
import useUpdatedObjectsStore from '../../../store/useUpdatedObjectsStore';
import { TestPlanService } from '../../../service/TestPlanService';
import { getObjectsArrayFromMap } from '../../../utils/Utils';
import { OK_RESPONSE_CODE } from '../../../api/axiosInstance';

interface IScenarioDashboardProps {
    items?: ITestObject[] | null;
    addItemCallback: (objectType: string) => void;
    deleteItemCallback: (guid: string) => void;
}

const ScenarioDashboard: FC<IScenarioDashboardProps> = ({items, addItemCallback, deleteItemCallback}) => {
    const [isObjectsOptionVisible, setIsObjectsOptionVisible] = useState(false)
    const objectsOptionRef = useRef<any>()
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

    const [deleteImgVisibility, setDeleteImgVisibility] = useState<any[]>([])

    const changeDeleteImgVisibility = (index: number, display: {display: 'block'} | {display: 'none'}) => {
        const deleteImgVisibilityUpdated = [...deleteImgVisibility]
        deleteImgVisibilityUpdated[index] = display
        setDeleteImgVisibility(deleteImgVisibilityUpdated)
    }
    

    useEffect(() => {
        setDeleteImgVisibility(new Array(items?.length).fill({display: 'none'}))
    }, [items])

    const guidToObject = useUpdatedObjectsStore(state => state.guidToObject)
    const clearMap = useUpdatedObjectsStore(state => state.clear)

    const saveObjects = async () => {
        console.log(getObjectsArrayFromMap(guidToObject))
        if (guidToObject.size > 0)
            await TestPlanService.updateTestPlanElements(getObjectsArrayFromMap(guidToObject)).then(response => {
                if (response.status === OK_RESPONSE_CODE)
                    clearMap()
            })
    }

    return (
        <div className={styles.scenarioDashboard}>
            {items !== null &&
                <div className={styles.saveImgContainer}>
                    <img 
                        src='./images/save.svg' 
                        className={styles.saveImg} 
                        onClick={() => saveObjects()}
                    />
                </div>
            }
            <div className={styles.scenarioObjectsContainer}>
                {items?.map((item, index) =>
                    <>
                        <div 
                            className={styles.deleteImgContainer}
                            onMouseEnter={e => changeDeleteImgVisibility(index, {display: 'block'})}
                            onMouseLeave={e => changeDeleteImgVisibility(index, {display: 'none'})}
                        >
                            <img 
                                src='./images/delete.svg' 
                                className={styles.deleteImg} style={deleteImgVisibility[index]} 
                                onClick={() => deleteItemCallback(item.guid)}
                            />
                        </div>
                        <div 
                            className={styles.scenarioObjectContainer}
                            onMouseEnter={e => changeDeleteImgVisibility(index, {display: 'block'})}
                            onMouseLeave={e => changeDeleteImgVisibility(index, {display: 'none'})}
                        >
                            <HttpSampler 
                                httpSampler={item} 
                            />
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
                <Popup 
                    ref={objectsOptionRef}
                    className={isObjectsOptionVisible? styles.objectsOptionPopup : styles.objectsOptionPopupHidden}
                >
                    <div 
                        className={styles.optionContainer}
                        onClick={() => { addItemCallback(HTTP_SAMPLER); setIsObjectsOptionVisible(false); }}
                    >
                        <img src='./images/request.svg' className={styles.requestImg} />
                        <span>&nbsp;&nbsp;Запрос</span>
                    </div>
                </Popup>
            </div>
        </div>
    )
}

export default ScenarioDashboard;