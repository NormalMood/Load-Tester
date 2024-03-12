import { FC, forwardRef } from 'react';
import styles from './Popup.module.css';

interface IPopupProps {
    ref?: React.RefObject<HTMLDivElement>;
    children?: React.ReactNode;
    mix?: React.HTMLAttributes<string>
}

type PopupProps = React.ComponentPropsWithoutRef<'div'>

const Popup = forwardRef<HTMLDivElement, PopupProps>((props, ref) => {
    return (
        <div ref={ref} className={[styles.popup, props.className].join(' ')}>
            {props.children}
        </div>
    )
})

export default Popup;