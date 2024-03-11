import { FC } from 'react';
import styles from './Button.module.css';

interface IButtonProps {
    children: React.ReactNode;
    mix?: React.HTMLAttributes<string> | string;
    onClick?: () => void;
}

const Button: FC<IButtonProps> = ({children, mix, onClick}) => {
    return (
        <button className={[styles.button, mix].join(' ')} onClick={onClick}>{children}</button>
    )
}

export default Button;