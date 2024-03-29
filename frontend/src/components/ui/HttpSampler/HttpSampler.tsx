import { IHttpSampler } from '../../../@types/interfaces/IHttpSampler';
import { FC, useEffect } from 'react';
import styles from './HttpSampler.module.css';
import { useState } from 'react';
import Tab from '../Tab/Tab';
import Select from '../Select/Select';
import Input from '../Input/Input';
import useUpdatedHttpSamplersStore from '../../../store/useUpdatedHttpSamplersStore';
import Textarea from '../Textarea/Textarea';
import Button from '../Button/Button';
import testScenarioStyles from '../../../styles/TestScenarios.module.css';

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

    useEffect(() => {
        setName(httpSampler.data?.name)
        setMethod(httpSampler.data?.method)
        setDomain(httpSampler.data?.domain)
        setPath(httpSampler.data?.path)
        setPort(httpSampler.data?.port)
        setBodyJson(httpSampler.data?.bodyJson)
        setHeaderKeys(httpSampler.data?.headerKeys)
        setHeaderValues(httpSampler.data?.headerValues)
        setParamKeys(httpSampler.data?.paramKeys)
        setParamValues(httpSampler.data?.paramValues)
    }, [httpSampler])

    const [name, setName] = useState<string | undefined>()
    const onNameChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        updateHttpSampler(e.target.value, method, domain, path, port, bodyJson, headerKeys, headerValues, paramKeys, paramValues)
    }

    const [method, setMethod] = useState<string | undefined>()
    const onSelectMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMethod(e.target.value)
        updateHttpSampler(name, e.target.value, domain, path, port, bodyJson, headerKeys, headerValues, paramKeys, paramValues)
    }

    const [domain, setDomain] = useState<string | undefined>()
    const onDomainChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value)
        updateHttpSampler(name, method, e.target.value, path, port, bodyJson, headerKeys, headerValues, paramKeys, paramValues)
    }

    const [path, setPath] = useState<string | undefined>()
    const onPathChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPath(e.target.value)
        updateHttpSampler(name, method, domain, e.target.value, port, bodyJson, headerKeys, headerValues, paramKeys, paramValues)
    }

    const [port, setPort] = useState<number | undefined>()
    const onPortChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPort(e.target.value as any as number)
        updateHttpSampler(name, method, domain, path, e.target.value as any as number, bodyJson, headerKeys, headerValues, paramKeys, paramValues)
    }

    const [bodyJson, setBodyJson] = useState<string | undefined>()
    const onBodyJsonChangedHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBodyJson(e.target.value)
        updateHttpSampler(name, method, domain, path, port, e.target.value, headerKeys, headerValues, paramKeys, paramValues)
    }

    const [headerKeys, setHeaderKeys] = useState<string[] | undefined>()
    const [headerValues, setHeaderValues] = useState<string[] | undefined>()
    const addHeader = () => {
        if (headerKeys === undefined && headerValues === undefined) {
            setHeaderKeys([''])
            setHeaderValues([''])
        }
        else {
            setHeaderKeys([...(headerKeys as string[]), ''])
            setHeaderValues([...(headerValues as string[]), ''])
        }
    }
    const onHeaderKeysChangedHandler = (headerKey: string, index: number) => {
        if (headerKeys !== undefined) {
            const headerKeysUpdated = [...headerKeys]
            headerKeysUpdated[index] = headerKey
            setHeaderKeys(headerKeysUpdated)
            updateHttpSampler(name, method, domain, path, port, bodyJson, headerKeysUpdated, headerValues, paramKeys, paramValues)

        }
    }
    const onHeaderValuesChangedHandler = (headerValue: string, index: number) => {
        if (headerValues !== undefined) {
            const headerValuesUpdated = [...headerValues]
            headerValuesUpdated[index] = headerValue
            setHeaderValues(headerValuesUpdated)
            updateHttpSampler(name, method, domain, path, port, bodyJson, headerKeys, headerValuesUpdated, paramKeys, paramValues)
        }
    }


    const [paramKeys, setParamKeys] = useState<string[] | undefined>()
    const [paramValues, setParamValues] = useState<string[] | undefined>()
    const addParameter = () => {
        if (paramKeys === undefined && paramValues === undefined) {
            setParamKeys([''])
            setParamValues([''])
        }
        else {
            setParamKeys([...(paramKeys as string[]), ''])
            setParamValues([...(paramValues as string[]), ''])
        }
    }
    const onParamKeysChangedHandler = (paramKey: string, index: number) => {
        if (paramKeys !== undefined) {
            const paramKeysUpdated = [...paramKeys]
            paramKeysUpdated[index] = paramKey
            setParamKeys(paramKeysUpdated)
            updateHttpSampler(name, method, domain, path, port, bodyJson, headerKeys, headerValues, paramKeysUpdated, paramValues)

        }
    }
    const onParamValuesChangedHandler = (paramValue: string, index: number) => {
        if (paramValues !== undefined) {
            const paramValuesUpdated = [...paramValues]
            paramValuesUpdated[index] = paramValue
            setParamValues(paramValuesUpdated)
            updateHttpSampler(name, method, domain, path, port, bodyJson, headerKeys, headerValues, paramKeys, paramValuesUpdated)
        }
    }


    const setHTTPSampler = useUpdatedHttpSamplersStore(state => state.setHttpSampler)

    const updateHttpSampler = (
        name: string | undefined, 
        method : string | undefined, 
        domain: string | undefined,
        path: string | undefined,
        port: number | undefined,
        bodyJson: string | undefined,
        headerKeys: string[] | undefined,
        headerValues: string[] | undefined,
        paramKeys: string[] | undefined,
        paramValues: string[] | undefined
    ) => {
        const updatedHTTPSampler: IHttpSampler = {
            parentGuid: httpSampler.parentGuid as string,
            guid: httpSampler.guid as string,
            data: {
                name,
                method,
                domain,
                path,
                port: Number(port),
                bodyJson,
                headerKeys,
                headerValues,
                paramKeys,
                paramValues
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
                                <b>Заголовки</b>
                                <div className={styles.headersContainer}>
                                    {headerKeys?.map((headerKey, index) => 
                                        <>
                                            <Input 
                                                value={headerKey} 
                                                onChange={(e) => onHeaderKeysChangedHandler(e.target.value, index)} 
                                                mix={styles.headerKeyInput}
                                            />
                                            <Input 
                                                value={(headerValues as string[]).at(index)} 
                                                onChange={(e) => onHeaderValuesChangedHandler(e.target.value, index)} 
                                                mix={styles.headerValueInput} 
                                            />
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
                                            &nbsp;Добавить
                                        </span>
                                    }  
                                    mix={[testScenarioStyles.accentButton, styles.newHeaderButton].join(' ')}
                                    onClick={() => addHeader()}
                                />
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
                                {selectedSubTabIndex === 0 &&
                                    <>
                                        <div className={styles.paramsContainer}>
                                            {paramKeys?.map((paramKey, index) => 
                                                <>
                                                    <Input 
                                                        value={paramKey} 
                                                        onChange={(e) => onParamKeysChangedHandler(e.target.value, index)} 
                                                        mix={styles.paramKeyInput}
                                                    />
                                                    <Input 
                                                        value={(paramValues as string[]).at(index)} 
                                                        onChange={(e) => onParamValuesChangedHandler(e.target.value, index)} 
                                                        mix={styles.paramValueInput} 
                                                    />
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
                                                    &nbsp;Добавить
                                                </span>
                                            }  
                                            mix={[testScenarioStyles.accentButton, styles.newHeaderButton].join(' ')}
                                            onClick={() => addParameter()}
                                        />
                                    </>
                                }
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