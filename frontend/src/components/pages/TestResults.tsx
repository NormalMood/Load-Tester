import { Line } from 'react-chartjs-2'
import styles from '../../styles/TestResults.module.css'
import { useState } from 'react'
import { Chart, registerables } from 'chart.js'
import useTestResultsStore from '../../store/useTestResultsStore'
import zoomPlugin from 'chartjs-plugin-zoom'
Chart.register(...registerables)
Chart.register(zoomPlugin)

const TestResults = () => {
    const urlToTimes = useTestResultsStore(state => state.urlToTimes)
    const failedRequests = useTestResultsStore(state => state.failedRequests)
    const [failedURLBodyOpened, setFailedURLBodyOpened] = useState(false)
    return (
        <div className={styles.testResultsDashboard}>
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