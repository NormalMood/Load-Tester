import testResultsStyles from '../../styles/TestResults.module.css'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import useLoadFromServerStore from '../../store/useLoadFromServerStore'
Chart.register(...registerables)
Chart.register(zoomPlugin)

const Server = () => {
    const serverToLoad = useLoadFromServerStore(state => state.serverToLoad)
    return (
        <div className={testResultsStyles.testResultsDashboard}>
            <div className={testResultsStyles.testResultsCharts}>
                {Array.from(serverToLoad).map(([server, load]) => (
                    <>
                        <div className={testResultsStyles.chartContainer}>
                            <Line 
                            data={{
                                labels: load?.timeStamp,
                                datasets: [
                                    {
                                        label: 'Использование оперативной памяти',
                                        data: load?.memory,
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
                                        title: {
                                            display: true,
                                            text: server.split(':')[1], 
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
                        <div className={testResultsStyles.chartContainer}>
                            <Line 
                                data={{
                                    labels: load?.timeStamp,
                                    datasets: [
                                        {
                                            label: 'Нагрузка на процессор',
                                            data: load?.cpu,
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
                                    title: {
                                        display: true,
                                        text: server.split(':')[1], 
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
                    </>
                ))}
            </div>
        </div>
    )
}

export default Server;