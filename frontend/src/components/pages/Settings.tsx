import scenarioDashboardStyles from '../ui/ScenarioDashboard/ScenarioDashboard.module.css'
import testScenarioStyles from '../../styles/TestScenarios.module.css'
import { useEffect, useState } from 'react'
import styles from '../../styles/Settings.module.css'
import { SSHConnectionService } from '../../service/SSHConnectionService'
import { ISSHSettings } from '../../@types/interfaces/ISSHSettings'
import Button from '../ui/Button/Button'
import SSHSettings from '../ui/SSHSettings/SSHSettings'
import { OK_RESPONSE_CODE } from '../../api/axiosInstance'
import useUpdatedSSHSettingsStore from '../../store/useUpdatedSSHSettingsStore'
import { SETTINGS_SAVED_ANIMATION_TIME } from '../../@types/consts/animationTimes'

const Settings = () => {

    const [sshSettings, setSSHSettings] = useState<ISSHSettings[]>([])

    useEffect(() => {
        SSHConnectionService.getSSHSettings().then(response => {
            setSSHSettings(response)
        })
    }, [])

    const addSSHSettings = async () => {
        await SSHConnectionService.addSSHSettings({
            user: '', 
            password: '', 
            server: '', 
            port: 22, 
            interval: 1, 
            isConnectionOn: false
        } as ISSHSettings).then(response => {
            if (response.status === OK_RESPONSE_CODE) {
                setSSHSettings([...sshSettings, response.data])
            }
        })
    }

    const deleteSSHSettings = async (guid?: string) => {
        if (guid !== undefined) {
            await SSHConnectionService.deleteSSHSettings(guid).then(response => {
                if (response.status === OK_RESPONSE_CODE && response.data) {
                    if (sshSettings.length > 0)
                        setSSHSettings(sshSettings.filter(settings => settings.guid !== guid))
                }
            })
        }
    }

    const [deleteImgVisibility, setDeleteImgVisibility] = useState<any[]>([])

    const changeDeleteImgVisibility = (index: number, display: {display: 'block'} | {display: 'none'}) => {
        const deleteImgVisibilityUpdated = [...deleteImgVisibility]
        deleteImgVisibilityUpdated[index] = display
        setDeleteImgVisibility(deleteImgVisibilityUpdated)
    }

    useEffect(() => {
        setDeleteImgVisibility(new Array(sshSettings?.length).fill({display: 'none'}))
    }, [sshSettings])

    const guidToSSHSettings = useUpdatedSSHSettingsStore(state => state.guidToSSHSettings)
    const clearGuidToSSHSettings = useUpdatedSSHSettingsStore(state => state.clear)

    let [isSettingsSaved, setIsSettingsSaved] = useState(false);
    const getSaveImgStyle = () => {
        if (isSettingsSaved) 
            return [styles.saveImg, styles.saveImgActive].join(' ')
        return styles.saveImg
    }

    const saveSettings = async () => {
        if (guidToSSHSettings.size > 0) {
            const savingResults = new Set<Boolean>()
            const updatedSSHSettings = new Array<ISSHSettings>()
            guidToSSHSettings.forEach(sshSettings => updatedSSHSettings.push(sshSettings))
            for (let i = 0; i < updatedSSHSettings.length; i++) {
                await SSHConnectionService.updateSSHSettings(updatedSSHSettings[i]).then(response => savingResults.add(response.data))
            }
            clearGuidToSSHSettings()
            if (!savingResults.has(false)) {
                setIsSettingsSaved(true)
                setTimeout(() => { setIsSettingsSaved(false) }, SETTINGS_SAVED_ANIMATION_TIME)
            }
        }
    }

    return (
        <div className={styles.settingsDashboard}>
            <div className={styles.settingsWrapper}>
                <div className={styles.saveImgContainer}>
                    <img 
                        className={getSaveImgStyle()} 
                        src='./images/save.svg' 
                        onClick={() => saveSettings()}
                    />
                </div>
                <div className={styles.sshSettingsContainer}>
                    {sshSettings.map((sshSettings, index) => 
                        <>
                            <div 
                                className={scenarioDashboardStyles.deleteImgContainer}
                                onMouseEnter={e => changeDeleteImgVisibility(index, {display: 'block'})}
                                onMouseLeave={e => changeDeleteImgVisibility(index, {display: 'none'})}
                            >
                                <img 
                                    src='./images/delete.svg' 
                                    className={scenarioDashboardStyles.deleteImg} 
                                    style={deleteImgVisibility[index]} 
                                   onClick={() => deleteSSHSettings(sshSettings.guid)}
                                />
                            </div>
                            <div 
                                className={styles.sshSettingsWrapper}
                                onMouseEnter={e => changeDeleteImgVisibility(index, {display: 'block'})}
                                onMouseLeave={e => changeDeleteImgVisibility(index, {display: 'none'})}
                            >
                                <SSHSettings settings={sshSettings} />
                            </div>
                        </>
                    )}
                </div>
                <Button 
                    children={
                        <span>
                            <img 
                                src='./images/plus.svg' 
                                className={testScenarioStyles.accentButtonImg} 
                            />
                            &nbsp;SSH - подключение
                        </span>
                    }  
                    mix={[testScenarioStyles.accentButton, styles.newSSHSettingsButton].join(' ')}
                    onClick={() => addSSHSettings()}
                />
            </div>
        </div>
    )
}

export default Settings;