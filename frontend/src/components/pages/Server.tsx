import testResultsStyles from '../../styles/TestResults.module.css'
import { Line } from 'react-chartjs-2'
import styles from '../../styles/TestResults.module.css'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import useLoadFromServerStore from '../../store/useLoadFromServerStore'
Chart.register(...registerables)
Chart.register(zoomPlugin)

const Server = () => {
    const timeStamp = useLoadFromServerStore(state => state.timeStamp)
    const memory = useLoadFromServerStore(state => state.memory)
    const cpu = useLoadFromServerStore(state => state.cpu)
    return (
        <div className={testResultsStyles.testResultsDashboard}>
            <div className={testResultsStyles.testResultsCharts}>
                {memory.length > 0 &&
                    <div className={testResultsStyles.chartContainer}>
                        <Line 
                        data={{
                            labels: timeStamp,
                            datasets: [
                                {
                                    label: 'Использование оперативной памяти',
                                    data: memory,
                                    fill: false,
                                    borderColor: 'rgb(75, 192, 192)',
                                    tension: 0.1,
                                }
                            ]
                        }} 
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Кб'
                                    },
                                }
                            },
                            plugins: {
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
                }
                {cpu.length > 0 &&
                    <div className={testResultsStyles.chartContainer}>
                        <Line 
                            data={{
                                labels: timeStamp,
                                datasets: [
                                    {
                                        label: 'Нагрузка на процессор',
                                        data: cpu,
                                        fill: false,
                                        borderColor: 'rgb(25, 99, 132)',
                                        tension: 0.1,
                                    }
                                ]
                            }} 
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                        text: '%'
                                    },
                                }
                            },
                            plugins: {
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
                }
            </div>
        </div>
    )
}

export default Server;