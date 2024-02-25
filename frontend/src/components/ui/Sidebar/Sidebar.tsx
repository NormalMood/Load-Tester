import { FC } from 'react';
import styles from './Sidebar.module.css';

interface ISidebarProps {
    children?: React.ReactNode;
}

const Sidebar: FC<ISidebarProps> = ({children}) => {
    return (
        <div className={styles.sidebar}>
            {children}
        </div>
    )
}

export default Sidebar;