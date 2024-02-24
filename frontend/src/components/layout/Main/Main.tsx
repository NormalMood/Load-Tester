import { Outlet } from 'react-router-dom';
import styles from './Main.module.css';

const Main = () => {
    return (
        <main className={styles.main}>
            <Outlet />
        </main>
    )
}

export default Main;