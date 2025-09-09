import style from './CardStyle.module.css'
import {IconEdit, IconTrash, IconCheck} from "@tabler/icons-react"
import React from "react";

interface CardProps {
    text: string
    complete: boolean,
    completed: () => void
    editHook: () => void
    deleteHook: () => void
}

const Card : React.FC<CardProps> = ({text, complete, completed, editHook, deleteHook}) => {
    return (
        <div className={style.card}>
            <div className={style.text}>
                {complete ? 'Выполнено' : 'Не выполнено'}
            </div>
            <p className={style.title}>{text}</p>
            <div className={style.footer}>
                <button className={style.button} onClick={completed}><IconCheck /></button>
                <button className={style.button} onClick={editHook}><IconEdit /></button>
                <button className={style.button} onClick={deleteHook}><IconTrash /></button>
            </div>
        </div>
    )
}

export default Card