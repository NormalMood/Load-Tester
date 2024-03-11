import { IHttpSampler } from '../../../@types/interfaces/IHttpSampler';
import { FC } from 'react';
import styles from './HttpSampler.module.css';
import { useState } from 'react';
import Tab from '../Tab/Tab';
import Select from '../Select/Select';
import Input from '../Input/Input';

interface IHttpSamplerProps {
    httpSampler: IHttpSampler;
}

const HttpSampler: FC<IHttpSamplerProps> = ({httpSampler}) => {
    const [isBodyShown, setIsBodyShown] = useState(false)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)
    const selectOptions = ['GET', 'POST', 'PUT', 'DELETE']

    const [method, setMethod] = useState(httpSampler.data?.method)
    const onSelectMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(e.target.value)
    }

    const [URL, setURL] = useState(httpSampler.data?.domain)
    const onURLChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setURL(e.target.value)
    }

    return (
        <div className={styles.httpSampler}>
            <div className={styles.httpSamplerHeader}>
                <div className={styles.expandSamplerImgContainer}>
                    <img 
                        className={isBodyShown? [styles.expandSamplerImg, styles.expandSamplerImgOpened].join(' ') : styles.expandSamplerImg} 
                        src='./images/expand_sampler.svg' 
                        onClick={() => setIsBodyShown(!isBodyShown)} 
                    />
                </div>
                <div className={styles.httpSamplerHeaderContentContainer}>
                    <span>{httpSampler.data?.name}</span>
                    <span><b>{method}</b>&nbsp;/</span>
                </div>
            </div>
            <div className={isBodyShown ? styles.httpSamplerBody : styles.httpSamplerBodyHidden}>
                <div className={styles.tabsContainer}>
                    <Tab 
                        children={
                            <span>Запрос</span>
                        } 
                        mix={selectedTabIndex === 0 && styles.tabSelected}
                        onClick={() => setSelectedTabIndex(0)}
                    />
                    <Tab
                        children={
                            <span>Ответ</span>
                        }
                        mix={selectedTabIndex === 1 && styles.tabSelected}
                        onClick={() => setSelectedTabIndex(1)}
                    />
                    <Tab
                        children={
                            <span>Тестирование</span>
                        }
                        mix={selectedTabIndex === 2 && styles.tabSelected}
                        onClick={() => setSelectedTabIndex(2)}
                    />
                </div>
                <div className={styles.tabBody}>
                    <div className={styles.tabContent}>
                        {selectedTabIndex === 0 &&
                            <div className={styles.requestTabContent}>
                                <b>Адрес</b>
                                <div className={styles.methodURLContainer}>
                                    <Select
                                        selectedOption={httpSampler.data?.method}
                                        options={selectOptions} 
                                        onChange={onSelectMethod}
                                    />
                                    <Input value={URL} onChange={onURLChangeHandler} placeholder={'URL'} />
                                </div>
                            </div>
                        }
                        {selectedTabIndex === 1 &&
                            <span>Response</span>
                        }
                        {selectedTabIndex === 2 &&
                            <span>Test</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HttpSampler;