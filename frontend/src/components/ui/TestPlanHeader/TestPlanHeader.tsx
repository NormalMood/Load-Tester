import { FC } from 'react';
import styles from './TestPlanHeader.module.css';
import { TestPlanService } from '../../../service/TestPlanService';
import { BASE_API_URL, OK_RESPONSE_CODE, axiosInstance } from '../../../api/axiosInstance';
import { getErrorsAndURLObjectFromArray, getURLToTestResultsMapFromArray } from '../../../utils/Utils';
import useTestResultsStore from '../../../store/useTestResultsStore';
import { ITestPlan } from '../../../@types/interfaces/ITestPlan';

interface ITestPlanHeaderProps {
    guid?: string;
}

const TestPlanHeader: FC<ITestPlanHeaderProps> = ({guid}) => {
    const setURLToTimes = useTestResultsStore(state => state.setURLToTimes)
    const clearURLToTimes = useTestResultsStore(state => state.clearURLToTimes)

    const setFailedRequests = useTestResultsStore(state => state.setFailedRequests)
    const clearFailedRequests = useTestResultsStore(state => state.clearFailedRequests)

    async function makeSequentialRequests(count: number) {
        if (count > 0) {
          // Ожидание 2 секунд перед выполнением запроса
          await new Promise(resolve => setTimeout(resolve, 2000));
  
          // Выполнение запроса axios.get('url2')
          axiosInstance.get<ITestPlan>(
                    BASE_API_URL + '/test-plan'
                ).then(response => console.log(response.data))
  
          // Обработка данных из дополнительного запроса (additionalResponse.data)
  
          // Вызов рекурсивной функции для следующего запроса
          await makeSequentialRequests(count - 1);
        }
      }
      async function test() {
        axiosInstance.get<string[][]>(
            BASE_API_URL + '/test-plan/result',
            {
                params: {
                    guid: guid
                }
            }
        ).then(response => console.log(response.data))
      }

    const startTest = async () => {
        if (guid !== undefined) {
            clearURLToTimes()
            clearFailedRequests()
            // await Promise.all([
            //     makeSequentialRequests(30), 
            //     test()
            // ])
            
            await TestPlanService.startTest(guid).then(response => {
                if (response.status === OK_RESPONSE_CODE) {
                    setURLToTimes(getURLToTestResultsMapFromArray(response.data))
                    setFailedRequests(getErrorsAndURLObjectFromArray(response.data))
                }
            })
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