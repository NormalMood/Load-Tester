import { Line } from 'react-chartjs-2'
import styles from '../../styles/TestResults.module.css'
import { useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { Chart, registerables } from 'chart.js'
import useTestResultsStore from '../../store/useTestResultsStore'
import zoomPlugin from 'chartjs-plugin-zoom'
import useTestTimeStore from '../../store/useTestTimeStore'
Chart.register(...registerables)
Chart.register(zoomPlugin)

const TestResults = () => {
    
    const targetTime = useTestTimeStore(state => state.targetTime)
    const urlToTimes = useTestResultsStore(state => state.urlToTimes)
    const failedRequests = useTestResultsStore(state => state.failedRequests)
    const [failedURLBodyOpened, setFailedURLBodyOpened] = useState(false)

    const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
      if (!completed) {
        const formattedDays = days < 10 ? `0${days}` : `${days}`
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
        return (
          <div className={styles.countdownContentContainer}>
            <span className={styles.countdownLabel}>
              До завершения тестирования
            </span>
            <div className={styles.countdownCellsContainer}>
              <div className={styles.countdownCellContainer}>
                <span className={styles.countdownCell}>
                  {formattedDays}
                </span>
                <span className={styles.countdownDelimiter}>:</span>
                <span className={styles.countdownCellTitle}>дней</span>
              </div>
              <div className={styles.countdownCellContainer}>
                <span className={styles.countdownCell}>
                  {formattedHours}
                </span>
                <span className={styles.countdownDelimiter}>:</span>
                <span className={styles.countdownCellTitle}>часов</span>
              </div>
              <div className={styles.countdownCellContainer}>
                <span className={styles.countdownCell}>
                  {formattedMinutes}
                </span>
                <span className={styles.countdownDelimiter}>:</span>
                <span className={styles.countdownCellTitle}>минут</span>
              </div>
              <div className={styles.countdownCellContainer}>
                <span className={styles.countdownCell}>
                  {formattedSeconds}
                </span>
                <span className={styles.countdownCellTitle}>секунд</span>
              </div>
            </div>
          </div>
        )
      }}

    return (
        <div className={styles.testResultsDashboard}>
          {urlToTimes.size === 0 &&
            <div className={styles.countdownContainer}>
              <Countdown
                date={targetTime}
                renderer={renderer}
              />
            </div>
          }
          <div className={styles.testResultsCharts}>
            {Array.from(urlToTimes).map(([URL, times]) => (
              <div className={styles.chartContainer}>
                <Line 
                  data={{
                    labels: times.timeStamp,
                    datasets: [
                      {
                        label: 'Установка соединения',
                        data: times.connect,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                      },
                      {
                        label: 'Прием 1-го байта',
                        data: times.latency,
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1,
                      },
                      {
                        label: 'Прием последнего байта',
                        data: times.elapsed,
                        fill: false,
                        borderColor: 'rgb(25, 99, 132)',
                        tension: 0.1,
                      }
                    ],
                  }} 
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'мс'
                        },
                      }
                    },
                    plugins: {
                        title: {
                          display: true,
                          text: URL, 
                        },
                        zoom: {
                          pan: {
                            enabled: true,
                            mode: 'xy',
                            speed: 10
                          },
                          zoom: {
                            wheel: {
                              enabled: true
                            },
                            pinch: {
                              enabled: true
                            },
                            mode: 'xy',
                            speed: 0.1
                          },
                        },
                    },
                  } as any} 
                />
              </div>
            ))}
            {urlToTimes.size > 0 &&
              <div className={styles.failedRequests}>
                <div className={styles.failedRequestsQuantity}>
                  <span>Ошибок:</span>
                  <b className={styles.failedRequestsErrors}>{failedRequests.errors}</b>
                </div>
              </div>
            }
            {failedRequests.errors > 0 &&
              <div className={styles.failedRequests}>
                <div className={styles.failedRequestsHeader}>
                  <img 
                    src='./images/expand_sampler.svg' 
                    className={failedURLBodyOpened ? [styles.expandURLImg, styles.expandURLImgOpened].join(' ') : styles.expandURLImg} 
                    onClick={() => setFailedURLBodyOpened(!failedURLBodyOpened)}
                  />
                  <span>Ошибочные запросы:</span>
                </div>
                {failedURLBodyOpened &&
                  <div className={styles.failedURLContainer}>
                    {Array.from(failedRequests.URL).map((url, index) => 
                      <span>{index + 1}) {url}</span>
                    )}
                  </div>
                }
              </div>
            }
          </div>
        </div>
    )
}

export default TestResults;