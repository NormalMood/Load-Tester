import { ITestObject } from '../../../@types/interfaces/ITestObject';
import { FC, useState, useRef, useEffect } from 'react';
import styles from './ScenarioDashboard.module.css';
import HttpSampler from '../HttpSampler/HttpSampler';
import Button from '../Button/Button';
import testScenarioStyles from '../../../styles/TestScenarios.module.css';
import Popup from '../Popup/Popup';
import { HTTP_SAMPLER } from '../../../@types/consts/testObjectTypes';
import useUpdatedHttpSamplersStore from '../../../store/useUpdatedHttpSamplersStore';
import { TestPlanService } from '../../../service/TestPlanService';
import { getObjectsArrayFromMap } from '../../../utils/Utils';
import { OK_RESPONSE_CODE } from '../../../api/axiosInstance';
import { IThreadGroup } from '../../../@types/interfaces/IThreadGroup';
import Input from '../Input/Input';
import useUpdatedThreadGroupsStore from '../../../store/useUpdatedThreadGroupsStore';
import { SETTINGS_SAVED_ANIMATION_TIME } from '../../../@types/consts/animationTimes';

interface IScenarioDashboardProps {
    selectedThreadGroup?: IThreadGroup | null;
    items?: ITestObject[] | null;
    addItemCallback: (objectType: string) => void;
    deleteItemCallback: (guid: string) => void;
    changeThreadGroupNameOnUpdateCallback: (guid: string, name: string) => void;
}

const THREAD_GROUP_NAME_INPUT_PLACEHOLDER = 'Имя сценария'
const THREADS_INPUT_PLACEHOLDER = 'Кол-во пользователей'
const RAMPUP_INPUT_PLACEHOLDER = 'Время роста нагрузки (сек.)'
const LOOPS_INPUT_PLACEHOLDER = 'Кол-во повторов'

const ScenarioDashboard: FC<IScenarioDashboardProps> = ({selectedThreadGroup, items, addItemCallback, deleteItemCallback, changeThreadGroupNameOnUpdateCallback}) => {
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


    const [isUpdatedHttpSamplersSaved, setIsUpdatedHttpSamplersSaved] = useState(false)
    const [isUpdatedThreadGroupSaved, setIsUpdatedThreadGroupSaved] = useState(false)
    const getSaveImgStyle = () => {
        if (isUpdatedHttpSamplersSaved || isUpdatedThreadGroupSaved) 
            return [styles.saveImg, styles.saveImgActive].join(' ')
        return styles.saveImg
    }
    

    const guidToHttpSampler = useUpdatedHttpSamplersStore(state => state.guidToHttpSampler)
    const clearGuidToHttpSampler = useUpdatedHttpSamplersStore(state => state.clear)

    const saveObjects = async () => {
        console.log(getObjectsArrayFromMap(guidToHttpSampler))
        if (guidToHttpSampler.size > 0)
            await TestPlanService.updateTestPlanElements(getObjectsArrayFromMap(guidToHttpSampler)).then(response => {
                if (response.status === OK_RESPONSE_CODE && response.data) {
                    clearGuidToHttpSampler()
                    setIsUpdatedHttpSamplersSaved(true)
                    setTimeout(() => { setIsUpdatedHttpSamplersSaved(false) }, SETTINGS_SAVED_ANIMATION_TIME)
                }
            })
        if (updatedThreadGroup !== null) {
            await TestPlanService.updateThreadGroup(updatedThreadGroup).then(response => {
                if (response.status === OK_RESPONSE_CODE && response.data) {
                    changeThreadGroupNameOnUpdateCallback(updatedThreadGroup.guid, updatedThreadGroup.data?.name as any as string)
                    clearUpdatedThreadGroup()
                    setIsUpdatedThreadGroupSaved(true)
                    setTimeout(() => { setIsUpdatedThreadGroupSaved(false) }, SETTINGS_SAVED_ANIMATION_TIME)
                }
            })
        }
    }

    const [threadGroupName, setThreadGroupName] = useState<string | undefined>()
    const [threads, setThreads] = useState<number | undefined>()
    const [rampUp, setRampUp] = useState<number | undefined>()
    const [loops, setLoops] = useState<number | undefined>()

    useEffect(() => {
        setThreadGroupName(selectedThreadGroup?.data?.name)
        setThreads(selectedThreadGroup?.data?.threads)
        setRampUp(selectedThreadGroup?.data?.rampUp)
        setLoops(selectedThreadGroup?.data?.loops)
        clearUpdatedThreadGroup()
    }, [selectedThreadGroup])

    const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false)




    const updatedThreadGroup = useUpdatedThreadGroupsStore(state => state.threadGroup)
    const setUpdatedThreadGroup = useUpdatedThreadGroupsStore(state => state.setThreadGroup)
    const clearUpdatedThreadGroup = useUpdatedThreadGroupsStore(state => state.clear)

    const onThreadGroupNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThreadGroupName(e.target.value)
        updateThreadGroup(e.target.value, threads, rampUp, loops)
    }

    const onThreadsChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThreads(e.target.value as any as number)
        updateThreadGroup(threadGroupName as string, e.target.value as any as number, rampUp, loops)
    }

    const onRampUpChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRampUp(e.target.value as any as number)
        updateThreadGroup(threadGroupName as string, threads, e.target.value as any as number, loops)
    }

    const onLoopsChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoops(e.target.value as any as number)
        updateThreadGroup(threadGroupName as string, threads, rampUp, e.target.value as any as number)
    }

    const updateThreadGroup = (name: string, threads: number = 1, rampUp: number = 1, loops: number = 1) => {
        const updatedThreadGroup: IThreadGroup = {
            parentGuid: selectedThreadGroup?.parentGuid,
            guid: selectedThreadGroup?.guid as string,
            data: {
                name,
                threads: Number(threads),
                rampUp: Number(rampUp),
                loops: Number(loops)
            }
        }
        setUpdatedThreadGroup(updatedThreadGroup)
    }

    useEffect(() => {
        setDeleteImgVisibility(new Array(items?.length).fill({display: 'none'}))
    }, [items])

    return (
        <div className={styles.scenarioDashboard}>
            {items !== null &&
                <div className={styles.imgsSettingsContainer}>
                    <div className={styles.imgContainer}>
                        <img 
                            src='./images/settings.svg'
                            className={styles.settingsImg}
                            onClick={() => setIsSettingsPanelVisible(!isSettingsPanelVisible)}
                        />
                        <img 
                            src='./images/save.svg' 
                            className={getSaveImgStyle()} 
                            onClick={() => saveObjects()}
                        />
                    </div>
                    <div className={isSettingsPanelVisible ? styles.settingsContainer : styles.settingsHidden}>
                        <div className={styles.settings}>
                            <div className={styles.settingsContentContainer}>
                                <Input 
                                    value={threadGroupName}
                                    onChange={onThreadGroupNameChangeHandler}
                                    placeholder={THREAD_GROUP_NAME_INPUT_PLACEHOLDER}
                                    title={THREAD_GROUP_NAME_INPUT_PLACEHOLDER}
                                />
                                <Input 
                                    value={threads} 
                                    onChange={onThreadsChangeHandler} 
                                    placeholder={THREADS_INPUT_PLACEHOLDER} 
                                    title={THREADS_INPUT_PLACEHOLDER}
                                />
                                <Input 
                                    value={rampUp} 
                                    onChange={onRampUpChangeHandler} 
                                    placeholder={RAMPUP_INPUT_PLACEHOLDER} 
                                    title={RAMPUP_INPUT_PLACEHOLDER}
                                />
                                <Input 
                                    value={loops} 
                                    onChange={onLoopsChangeHandler} 
                                    placeholder={LOOPS_INPUT_PLACEHOLDER}  
                                    title={LOOPS_INPUT_PLACEHOLDER}
                                />
                            </div>
                        </div>
                    </div>
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
                                &nbsp;Запрос
                            </span>
                        }  
                        mix={[testScenarioStyles.accentButton, styles.newObjectButton].join(' ')}
                        onClick={() => addItemCallback(HTTP_SAMPLER)/*() => setIsObjectsOptionVisible(true)*/}
                    />
                }
                {/* <Popup 
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
                </Popup> */}
            </div>
        </div>
    )
}

export default ScenarioDashboard;