import styles from './TestPlanHeader.module.css';

const TestPlanHeader = () => {
    return (
        <div className={styles.testPlanHeader}>
            <span className={styles.testPlanHeaderText}>Тестовый план</span>
        </div>
    )
}

export default TestPlanHeader;