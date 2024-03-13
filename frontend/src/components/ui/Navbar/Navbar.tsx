import { TEST_PAGE_PATH, TEST_RESULTS_PAGE_PATH } from '../../../@types/consts/pagesPaths';
import Tab from '../Tab/Tab';
import styles from './Navbar.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const PathToTabIndexMap = new Map<string, number>([
        [ TEST_PAGE_PATH, 0 ],
        [ TEST_RESULTS_PAGE_PATH, 1 ]
    ])
    const [selectedTabIndex, setSelectedTabIndex] = useState(PathToTabIndexMap.get(window.location.pathname))
    const navigate = useNavigate()
    return (
        <nav className={styles.navbar}>
            <Tab 
                children={'Тест'} 
                mix={(selectedTabIndex === 0 || window.location.pathname === TEST_PAGE_PATH) ? [styles.navbarTab, styles.navbarTabActive].join(' ') : styles.navbarTab} 
                onClick={() => { setSelectedTabIndex(0); navigate(TEST_PAGE_PATH); }} 
            />
            <Tab 
                children={'Итог'} 
                mix={(selectedTabIndex === 1 || window.location.pathname === TEST_RESULTS_PAGE_PATH) ? [styles.navbarTab, styles.navbarTabActive].join(' ') : styles.navbarTab} 
                onClick={() => { setSelectedTabIndex(1); navigate(TEST_RESULTS_PAGE_PATH); }} 
            />
        </nav>
    )
}

export default Navbar;