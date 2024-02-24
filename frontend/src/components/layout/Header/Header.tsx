import { Outlet } from  'react-router-dom';
import { FC } from 'react';
import styles from './Header.module.css'

interface IHeaderProps {
    children?: React.ReactNode;
}

const Header: FC<IHeaderProps> = ({children}) => {
    return (
        <header className={styles.header}>
            {children}
        </header>
    )
}

export default Header;