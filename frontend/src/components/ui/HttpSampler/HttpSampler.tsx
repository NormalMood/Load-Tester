import { IHttpSampler } from '../../../@types/interfaces/IHttpSampler';
import { FC } from 'react';
import styles from './HttpSampler.module.css';
import { useState } from 'react';
import Tab from '../Tab/Tab';
import Select from '../Select/Select';
import Input from '../Input/Input';
import useUpdatedHttpSamplersStore from '../../../store/useUpdatedHttpSamplersStore';
import Textarea from '../Textarea/Textarea';

interface IHttpSamplerProps {
    httpSampler: IHttpSampler;
}

const NAME_INPUT_PLACEHOLDER = 'Название'
const DOMAIN_INPUT_PLACEHOLDER = 'Домен'
const PATH_INPUT_PLACEHOLDER = 'Путь'
const PORT_INPUT_PLACEHOLDER = 'Порт'
const BODY_JSON_TEXTAREA_PLACEHOLDER = '{ "key": "value" }'

const HttpSampler: FC<IHttpSamplerProps> = ({httpSampler}) => {
    const [isBodyShown, setIsBodyShown] = useState(false)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)
    const selectOptions = ['GET', 'POST', 'PUT', 'DELETE']

    const [name, setName] = useState(httpSampler.data?.name)
    const onNameChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        updateHttpSampler(e.target.value, method, domain, path, port, bodyJson)
    }

    const [method, setMethod] = useState(httpSampler.data?.method)
    const onSelectMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(e.target.value)
        updateHttpSampler(name, e.target.value, domain, path, port, bodyJson)
    }

    const [domain, setDomain] = useState(httpSampler.data?.domain)
    const onDomainChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value)
        updateHttpSampler(name, method, e.target.value, path, port, bodyJson)
    }

    const [path, setPath] = useState(httpSampler.data?.path)
    const onPathChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPath(e.target.value)
        updateHttpSampler(name, method, domain, e.target.value, port, bodyJson)
    }

    const [port, setPort] = useState(httpSampler.data?.port)
    const onPortChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPort(e.target.value as any as number)
        updateHttpSampler(name, method, domain, path, e.target.value as any as number, bodyJson)
    }

    const [bodyJson, setBodyJson] = useState(httpSampler.data?.bodyJson)
    const onBodyJsonChangedHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBodyJson(e.target.value)
        updateHttpSampler(name, method, domain, path, port, e.target.value)
    }

    const setHTTPSampler = useUpdatedHttpSamplersStore(state => state.setHttpSampler)

    const updateHttpSampler = (
        name: string | undefined, 
        method : string | undefined, 
        domain: string | undefined,
        path: string | undefined,
        port: number | undefined,
        bodyJson: string | undefined
    ) => {
        const updatedHTTPSampler: IHttpSampler = {
            parentGuid: httpSampler.parentGuid as string,
            guid: httpSampler.guid as string,
            data: {
                name,
                method,
                domain,
                path,
                port,
                bodyJson
            }
        }
        setHTTPSampler(httpSampler.guid, updatedHTTPSampler)
    }


    const [selectedSubTabIndex, setSelectedSubTabIndex] = useState(0)

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
                    <span>{name}</span>
                    <span><b>{method}</b>&nbsp;/</span>
                </div>
            </div>
            <div className={isBodyShown ? styles.httpSamplerBody : styles.httpSamplerBodyHidden}>
                {/* <div className={styles.tabsContainer}>
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
                </div> */}
                <div className={styles.tabBody}>
                    <div className={styles.tabContent}>
                        {selectedTabIndex === 0 &&
                            <div className={styles.requestTabContent}>
                                <Input 
                                    value={name} 
                                    onChange={onNameChangedHandler}
                                    placeholder={NAME_INPUT_PLACEHOLDER}
                                    title={NAME_INPUT_PLACEHOLDER}
                                />
                                <b>Адрес</b>
                                <div className={styles.methodURLContainer}>
                                    <Select
                                        selectedOption={httpSampler.data?.method}
                                        options={selectOptions} 
                                        onChange={onSelectMethod}
                                        mix={styles.httpSamplerSelect}
                                    />
                                    <div className={styles.URLContainer}>
                                        <Input 
                                            value={domain} 
                                            onChange={onDomainChangedHandler} 
                                            placeholder={DOMAIN_INPUT_PLACEHOLDER} 
                                            title={DOMAIN_INPUT_PLACEHOLDER} 
                                        />
                                        <Input 
                                            value={port}
                                            onChange={onPortChangedHandler}
                                            placeholder={PORT_INPUT_PLACEHOLDER}
                                            title={PORT_INPUT_PLACEHOLDER}
                                            mix={styles.httpSamplerPort}
                                        />
                                        <Input
                                            value={path}
                                            onChange={onPathChangedHandler}
                                            placeholder={PATH_INPUT_PLACEHOLDER}
                                            title={PATH_INPUT_PLACEHOLDER}
                                        />
                                    </div>
                                </div>
                                <div className={styles.tabsContainer}>
                                    <Tab 
                                        children={
                                            <span>Параметры</span>
                                        } 
                                        mix={selectedSubTabIndex === 0 && styles.tabSelected}
                                        onClick={() => setSelectedSubTabIndex(0)}
                                    />
                                    <Tab 
                                        children={
                                            <span>JSON</span>
                                        } 
                                        mix={selectedSubTabIndex === 1 && styles.tabSelected}
                                        onClick={() => setSelectedSubTabIndex(1)}
                                    />
                                </div>
                                {selectedSubTabIndex === 1 &&
                                    <Textarea 
                                        value={bodyJson} 
                                        onChange={onBodyJsonChangedHandler} 
                                        placeholder={BODY_JSON_TEXTAREA_PLACEHOLDER}
                                        mix={styles.httpSamplerJsonTextarea} 
                                    />
                                }
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