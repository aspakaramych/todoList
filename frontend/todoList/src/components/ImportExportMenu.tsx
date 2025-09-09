import React from "react";
import styles from "./ImportExportMenu.module.css"

interface MenuProps {
    isOpen: boolean,
    importHook: () => void,
    exportHook: () => void
}

const ImportExportMenu : React.FC<MenuProps> = ({isOpen, importHook, exportHook}) => {
    if (!isOpen) return null
    return (
        <div className={styles.menu}>
            <button onClick={importHook}>Импорт</button>
            <button onClick={exportHook}>Экспорт</button>
        </div>
    )
}

export default ImportExportMenu