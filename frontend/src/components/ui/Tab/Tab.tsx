import { FC } from 'react';
import styles from './Tab.module.css';

interface ITabProps {
    children?: React.ReactNode;
    mix?: React.HTMLAttributes<string>;
    onClick?: () => void;
}

const Tab: FC<ITabProps> = ({children, mix, onClick}) => {
    return (
        <div className={[styles.tab, mix].join(' ')} onClick={onClick}>
            {children}
        </div>
    )
}

export default Tab;