import { FC, useEffect } from 'react';
import styles from './TestPlanHeader.module.css';
import { TestPlanService } from '../../../service/TestPlanService';
import { OK_RESPONSE_CODE } from '../../../api/axiosInstance';
import { getErrorsAndURLObjectFromArray, getURLToTestResultsMapFromArray } from '../../../utils/Utils';
import useTestResultsStore from '../../../store/useTestResultsStore';
import { SSHConnectionService } from '../../../service/SSHConnectionService';
import useLoadFromServerStore from '../../../store/useLoadFromServerStore';
import useTestTimeStore from '../../../store/useTestTimeStore';
import { useNavigate } from 'react-router-dom';
import { TEST_RESULTS_PAGE_PATH } from '../../../@types/consts/pagesPaths';

interface ITestPlanHeaderProps {
    guid?: string;
}

const TestPlanHeader: FC<ITestPlanHeaderProps> = ({guid}) => {
    const MS_IN_SECOND = 1000

    const setURLToTimes = useTestResultsStore(state => state.setURLToTimes)
    const clearURLToTimes = useTestResultsStore(state => state.clearURLToTimes)

    const setFailedRequests = useTestResultsStore(state => state.setFailedRequests)
    const clearFailedRequests = useTestResultsStore(state => state.clearFailedRequests)

    const addLoadFromServerResponse = useLoadFromServerStore(state => state.addLoadFromServerResponse)
    const clearLoadFromServer = useLoadFromServerStore(state => state.clear)

    const updateTestTime = useTestTimeStore(state => state.update)
    const clearTestTime = useTestTimeStore(state => state.clear)
    const setTargetTime = useTestTimeStore(state => state.setTargetTime)

    const makeSequentialRequestsToServer = async () => {
        clearLoadFromServer()
        const sshSettings = await SSHConnectionService.getSSHSettings()
        const openSSHConnectionResponse = await SSHConnectionService.openSSHConnection()
        if (openSSHConnectionResponse.status === OK_RESPONSE_CODE) {
            // if (sshSettings.interval !== undefined) {
            //     await getLoadFromServer(sshSettings.interval)
            //     await SSHConnectionService.closeSSHConnection()
            // }
        }
    }

    const getLoadFromServer = async (interval: number) => {
        if (!isLoadTestingFinished) {
            await new Promise(resolve => setTimeout(resolve, Number(interval) * MS_IN_SECOND))
            await SSHConnectionService.getLoadFromServer().then(response => addLoadFromServerResponse(response))
            await getLoadFromServer(interval)
        }
    }

    let isLoadTestingFinished = true

    const navigate = useNavigate()

    const startTest = async () => {
        if (guid !== undefined) {
            isLoadTestingFinished = false   
            clearTestTime()
            await TestPlanService.getChildrenByParentGuid(guid as string).then(response => updateTestTime(response.data))
            setTargetTime()
            clearURLToTimes()
            clearFailedRequests()
            navigate(TEST_RESULTS_PAGE_PATH)
            await Promise.all([
                TestPlanService.startTest(guid).then(response => {
                    if (response.status === OK_RESPONSE_CODE) {
                        setURLToTimes(getURLToTestResultsMapFromArray(response.data))
                        setFailedRequests(getErrorsAndURLObjectFromArray(response.data))
                        isLoadTestingFinished = true
                    }
                }),
                makeSequentialRequestsToServer()
            ])
        }
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