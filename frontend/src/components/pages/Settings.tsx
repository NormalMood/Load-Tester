import testResultsStyles from '../../styles/TestResults.module.css'
import Input from '../ui/Input/Input'
import scenarioDashboardStyles from '../ui/ScenarioDashboard/ScenarioDashboard.module.css'
import { useEffect, useState } from 'react'
import styles from '../../styles/Settings.module.css'
import { SSHConnectionService } from '../../service/SSHConnectionService'
import { ISSHSettings } from '../../@types/interfaces/ISSHSettings'

const Settings = () => {
    const [user, setUser] = useState<string | undefined>()
    const [password, setPassword] = useState<string | undefined>()
    const [server, setServer] = useState<string | undefined>()
    const [port, setPort] = useState<number | undefined>()
    const [interval, setInterval] = useState<number | undefined>()

    const USER_INPUT_PLACEHOLDER = 'Пользователь'
    const PASSWORD_INPUT_PLACEHOLDER = 'Пароль'
    const SERVER_INPUT_PLACEHOLDER = 'Сервер'
    const PORT_INPUT_PLACEHOLDER = 'Порт'
    const INTERVAL_INPUT_PLACEHOLDER = 'Интервал обращения к серверу, с.'

    useEffect(() => {
        SSHConnectionService.getSSHSettings().then(response => {
            setUser(response.user)
            setPassword(response.password)
            setServer(response.server)
            setPort(response.port)
            setInterval(response.interval)
        })
    }, [])

    const updateSSHSettings = async () => {
        await SSHConnectionService.updateSSHSettings({
            user,
            password,
            server,
            port,
            interval
        } as ISSHSettings)
    }

    return (
        <div className={testResultsStyles.testResultsDashboard}>
            <div className={[scenarioDashboardStyles.imgsSettingsContainer, styles.imgsSettingsContainer].join(' ')}>
                <div className={scenarioDashboardStyles.imgContainer}>
                    <img 
                        src='./images/save.svg' 
                        className={[scenarioDashboardStyles.saveImg, styles.saveImg].join(' ')} 
                        onClick={() => updateSSHSettings()}
                    />
                </div>
                <div className={styles.sshSettingsHeader}>
                    <span>SSH - подключение:</span>
                </div>
                <div>
                    <div className={[scenarioDashboardStyles.settings, styles.settings].join(' ')}>
                        <div className={[scenarioDashboardStyles.settingsContentContainer, styles.settingsContentContainer].join(' ')}>
                            <Input 
                                value={user}
                                onChange={e => setUser(e.target.value)}
                                placeholder={USER_INPUT_PLACEHOLDER}
                                title={USER_INPUT_PLACEHOLDER}
                            />
                            <Input 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                placeholder={PASSWORD_INPUT_PLACEHOLDER} 
                                title={PASSWORD_INPUT_PLACEHOLDER}
                            />
                            <Input 
                                value={server} 
                                onChange={e => setServer(e.target.value)} 
                                placeholder={SERVER_INPUT_PLACEHOLDER} 
                                title={SERVER_INPUT_PLACEHOLDER}
                            />
                            <Input 
                                value={port} 
                                onChange={e => setPort(Number(e.target.value))} 
                                placeholder={PORT_INPUT_PLACEHOLDER}  
                                title={PORT_INPUT_PLACEHOLDER}
                            />
                            <Input 
                                value={interval} 
                                onChange={e => setInterval(Number(e.target.value))} 
                                placeholder={INTERVAL_INPUT_PLACEHOLDER}  
                                title={INTERVAL_INPUT_PLACEHOLDER}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;