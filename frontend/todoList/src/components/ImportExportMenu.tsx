import React from "react";

interface MenuProps {
    isOpen: boolean,
    importHook: () => void,
    exportHook: () => void
}

const ImportExportMenu : React.FC<MenuProps> = ({isOpen, importHook, exportHook}) => {
    if (!isOpen) return null
    return (
        <div>
            <button onClick={importHook}>Import</button>
            <button onClick={exportHook }>Export</button>
        </div>
    )
}

export default ImportExportMenu