import type {TaskObject} from "../data/TaskObject.ts";
import React from "react";

export const exportTasks = (tasks: TaskObject[]) => {
    const json = JSON.stringify(tasks, null, 2);
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks.json";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importTasks = (
    setTasks: React.Dispatch<React.SetStateAction<TaskObject[]>>,
    setIsImportExportOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsImportExportOpen(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    const handleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result;
                if (typeof result !== 'string') {
                    throw new Error('Неверный формат файла');
                }

                const json: TaskObject[] = JSON.parse(result);
                setTasks(json);
                console.log('Импортированный JSON:', json);
            } catch (error) {
                alert('Неверный формат JSON файла');
            }
        };

        reader.onerror = () => {
            alert('Ошибка чтения файла');
        };

        reader.readAsText(file);
    };

    input.addEventListener('change', handleChange, {once: true});
    input.click();
};