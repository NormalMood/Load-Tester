import { FC, useEffect, useState } from 'react'
import { ISSHSettings } from '../../../@types/interfaces/ISSHSettings'
import Input from '../Input/Input'
import styles from './SSHSettings.module.css'
import useUpdatedSSHSettingsStore from '../../../store/useUpdatedSSHSettingsStore';

interface ISSHSettingsProps {
    settings: ISSHSettings;
}

const USER_INPUT_PLACEHOLDER = 'Пользователь'
const PASSWORD_INPUT_PLACEHOLDER = 'Пароль'
const SERVER_INPUT_PLACEHOLDER = 'Сервер'
const PORT_INPUT_PLACEHOLDER = 'Порт'
const INTERVAL_INPUT_PLACEHOLDER = 'Интервал обращения к серверу, с.'

const SSHSettings: FC<ISSHSettingsProps> = ({settings}) => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [server, setServer] = useState('')
    const [port, setPort] = useState(0)
    const [interval, setInterval] = useState(0)
    const [isConnectionOn, setIsConnectionOn] = useState(false)

    useEffect(() => {
        setUser(settings.user)
        setPassword(settings.password)
        setServer(settings.server)
        setPort(settings.port)
        setInterval(settings.interval)
        setIsConnectionOn(settings.isConnectionOn)
    }, [settings])

    const setSSHSettings = useUpdatedSSHSettingsStore(state => state.setSSHSettings)

    const onUserChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value)
        updateSSHSettings(e.target.value, password, server, port, interval, isConnectionOn)
    }

    const onPasswordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        updateSSHSettings(user, e.target.value, server, port, interval, isConnectionOn)
    }

    const onServerChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServer(e.target.value)
        updateSSHSettings(user, password, e.target.value, port, interval, isConnectionOn)
    }

    const onPortChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPort(e.target.value as unknown as number)
        updateSSHSettings(user, password, server, e.target.value, interval, isConnectionOn)
    }

    const onIntervalChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInterval(e.target.value as unknown as number)
        updateSSHSettings(user, password, server, port, e.target.value, isConnectionOn)
    }

    const onIsConnectionOnClick = () => {
        setIsConnectionOn(!isConnectionOn)
        updateSSHSettings(user, password, server, port, interval, !isConnectionOn)
    }

    const updateSSHSettings = (
        user: string, 
        password: string, 
        server: string, 
        port: string | number, 
        interval: string | number, 
        isConnectionOn: boolean
    ) => {
        setSSHSettings(
            settings.guid as string, 
            {
                guid: settings.guid,
                user,
                password,
                server,
                port: Number(port),
                interval: Number(interval),
                isConnectionOn
            } as ISSHSettings)
    }

    return (
        <div className={styles.sshSettings}>
            <div className={styles.sshSettingsContent}>
                <Input 
                    value={user}
                    onChange={onUserChangeHandler}
                    placeholder={USER_INPUT_PLACEHOLDER}
                    title={USER_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={password}
                    onChange={onPasswordChangeHandler}
                    placeholder={PASSWORD_INPUT_PLACEHOLDER}
                    title={PASSWORD_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={server}
                    onChange={onServerChangeHandler}
                    placeholder={SERVER_INPUT_PLACEHOLDER}
                    title={SERVER_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={port}
                    onChange={onPortChangeHandler}
                    placeholder={PORT_INPUT_PLACEHOLDER}
                    title={PORT_INPUT_PLACEHOLDER}
                />
                <Input 
                    value={interval}
                    onChange={onIntervalChangeHandler}
                    placeholder={INTERVAL_INPUT_PLACEHOLDER}
                    title={INTERVAL_INPUT_PLACEHOLDER}
                />
                <div>
                    <label className={styles.sshSettingsCheckboxLabel}>
                        <input 
                            type='checkbox' 
                            className={styles.sshSettingsCheckbox} 
                            checked={isConnectionOn} 
                            onClick={() => onIsConnectionOnClick()}
                        />
                        <span>Подключиться</span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default SSHSettings;