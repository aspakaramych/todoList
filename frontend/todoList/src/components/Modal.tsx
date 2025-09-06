import React from "react";
import style from './ModalStyle.module.css'


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string | React.ReactNode
}

const Modal : React.FC<ModalProps> = ({isOpen, onClose, onConfirm, message}) => {
    if (!isOpen) return null;

    return (
        <div className={style.overlay}>
            <div className={style.content}>
                {typeof message === "string" ? (
                    <p>{message}</p>
                ) : (
                    <div className={style.form}>{message}</div>
                )}
                <div className={style.button}>
                    <button onClick={onClose}>Отмена</button>
                    <button onClick={onConfirm}>Подтвердить</button>
                </div>
            </div>
        </div>
    )
}

export default Modal