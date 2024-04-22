import { FC, useState } from 'react'
import { ISSHSettings } from '../../../@types/interfaces/ISSHSettings'
import Input from '../Input/Input'
import styles from './SSHSettings.module.css'

interface ISSHSettingsProps {
    settings: ISSHSettings;
}

const USER_INPUT_PLACEHOLDER = 'Пользователь'
const PASSWORD_INPUT_PLACEHOLDER = 'Пароль'
const SERVER_INPUT_PLACEHOLDER = 'Сервер'
const PORT_INPUT_PLACEHOLDER = 'Порт'
const INTERVAL_INPUT_PLACEHOLDER = 'Интервал обращения к серверу, с.'

const SSHSettings: FC<ISSHSettingsProps> = ({settings}) => {
    const [user, setUser] = useState(settings.user)
    const [password, setPassword] = useState(settings.password)
    const [server, setServer] = useState(settings.server)
    const [port, setPort] = useState(settings.port)
    const [interval, setInterval] = useState(settings.interval)
    const [isConnectionOn, setIsConnectionOn] = useState(settings.isConnectionOn)
    return (
        <div className={styles.sshSettings}>
            <div className={styles.sshSettingsContent}>
                <Input 
                    value={user}
                    onChange={() => {}}
                    placeholder={USER_INPUT_PLACEHOLDER}
                    title={USER_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={password}
                    onChange={() => {}}
                    placeholder={PASSWORD_INPUT_PLACEHOLDER}
                    title={PASSWORD_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={server}
                    onChange={() => {}}
                    placeholder={SERVER_INPUT_PLACEHOLDER}
                    title={SERVER_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={port}
                    onChange={() => {}}
                    placeholder={PORT_INPUT_PLACEHOLDER}
                    title={PORT_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={interval}
                    onChange={(e) => setInterval(e.target.value as any as number)}
                    placeholder={INTERVAL_INPUT_PLACEHOLDER}
                    title={INTERVAL_INPUT_PLACEHOLDER}
                />
            </div>
        </div>
    )
}

export default SSHSettings;