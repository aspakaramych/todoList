import {useCallback, useEffect, useRef, useState} from "react";
import type {TaskObject} from "../data/TaskObject";
import {exportTasks, importTasks} from "../utils/exportImportUtils";

export const useAppLogic = () => {
    const [isImportExportOpen, setIsImportExportOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [textTask, setTextTask] = useState("");
    const [tasks, setTasks] = useState<TaskObject[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTextTask, setEditTextTask] = useState("");

    const menuButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (!menuButtonRef.current?.contains(target)) {
                setIsImportExportOpen(false);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleImport = useCallback(() => {
        importTasks(setTasks, setIsImportExportOpen);
    }, [setTasks]);

    const handleExport = useCallback(() => {
        setIsImportExportOpen(false);
        exportTasks(tasks);
    }, [tasks]);

    return {
        isImportExportOpen,
        setIsImportExportOpen,
        modal,
        setModal,
        textTask,
        setTextTask,
        tasks,
        setTasks,
        isEditModalOpen,
        setIsEditModalOpen,
        editTextTask,
        setEditTextTask,
        menuButtonRef,
        handleImport,
        handleExport,
    };
};