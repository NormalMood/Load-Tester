import { FC } from 'react';
import styles from './ThreadGroupHeader.module.css';

interface IThreadGroupHeaderProps {
    text?: string;
    mix?: React.HTMLAttributes<string>;
}

const ThreadGroupHeader: FC<IThreadGroupHeaderProps> = ({text, mix}) => {
    return (
        <>
            <span className={[styles.threadGroupHeaderText, mix].join(' ')}>
                {text}
            </span>
        </>
    )
}

export default ThreadGroupHeader;