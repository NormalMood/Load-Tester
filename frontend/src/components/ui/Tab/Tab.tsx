import { FC } from 'react';
import styles from './Tab.module.css';

interface ITabProps {
    text?: string;
    mix?: React.HTMLAttributes<string>;
    onClick?: () => void;
}

const Tab: FC<ITabProps> = ({text, mix, onClick}) => {
    return (
        <div className={[styles.tab, mix].join(' ')} onClick={onClick}>
            {text}
        </div>
    )
}

export default Tab;