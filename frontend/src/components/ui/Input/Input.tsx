import { FC } from 'react';
import styles from './Input.module.css';

interface IInputProps {
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    mix?: React.HTMLAttributes<string>;
    title?: string;
}

const Input: FC<IInputProps> = ({value, onChange, placeholder, mix, title}) => {
    return (
        <input title={title} value={value} onChange={onChange} className={[styles.input, mix].join(' ')} placeholder={placeholder} />
    )
}

export default Input;