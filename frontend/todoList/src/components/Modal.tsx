import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string | React.ReactNode
}

const Modal : React.FC<ModalProps> = ({isOpen, onClose, onConfirm, message}) => {
    if (!isOpen) return null;

    return (
        <div>
            <div>
                {typeof message === "string" ? (
                    <p>{message}</p>
                ) : (
                    <div>{message}</div>
                )}
                <div>
                    <button onClick={onClose}>Отмена</button>
                    <button onClick={onConfirm}>Подтвердить</button>
                </div>
            </div>
        </div>
    )
}

export default Modal