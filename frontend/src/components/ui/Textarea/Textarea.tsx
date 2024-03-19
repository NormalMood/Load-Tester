import { FC } from 'react';
import styles from './Textarea.module.css';

interface ITextareaProps {
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    mix?: React.HTMLAttributes<string>;
}

const Textarea: FC<ITextareaProps> = ({value, onChange, placeholder, mix}) => {
    return (
        <textarea value={value} onChange={onChange} className={[styles.textarea, mix].join(' ')} placeholder={placeholder} />
    )
}

export default Textarea;