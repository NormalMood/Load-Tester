import { FC } from 'react';
import styles from './Sidebar.module.css';

interface ISidebarProps {
    children?: React.ReactNode;
    mix?: React.HTMLAttributes<string>;
}

const Sidebar: FC<ISidebarProps> = ({children, mix}) => {
    return (
        <div className={[styles.sidebar, mix].join(' ')}>
            {children}
        </div>
    )
}

export default Sidebar;