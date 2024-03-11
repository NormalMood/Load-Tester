import { FC } from 'react';
import styles from './Select.module.css';

interface ISelectProps {
    selectedOption?: string;
    options: string[];
    mix?: React.HTMLAttributes<string>;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<ISelectProps> = ({selectedOption, options, mix, onChange}) => {
    return (
        <select className={[styles.select, mix].join(' ')} onChange={onChange}>
            {options.map(option =>
                <option selected={selectedOption === option}>{option}</option>
            )}
        </select>
    )
}

export default Select;