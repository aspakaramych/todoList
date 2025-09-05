import React from "react";
import {IconPlus} from "@tabler/icons-react"
import style from "./EmptyCardStyle.module.css"

interface EmptyCardProps {
    newCard: () => void
}

const EmptyCard : React.FC<EmptyCardProps> = ({newCard}) => {
    return (
        <div onClick={newCard} className={style.card}>
            <IconPlus/>
        </div>
    )
}

export default EmptyCard