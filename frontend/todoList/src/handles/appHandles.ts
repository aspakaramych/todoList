import {Guid} from "js-guid";
import type {Dispatch, SetStateAction} from "react";
import type {TaskObject} from "../data/TaskObject.ts";

interface HandlersProps {
    setModal: Dispatch<SetStateAction<boolean>>;
    setTextTask: Dispatch<SetStateAction<string>>;
    setTasks: Dispatch<SetStateAction<TaskObject[]>>;
    setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
    setEditTextTask: Dispatch<SetStateAction<string>>;
    textTask: string;
    editTextTask: string;
}

export const appHandlers = ({
                                setModal,
                                setTextTask,
                                setTasks,
                                setIsEditModalOpen,
                                setEditTextTask,
                                textTask,
                                editTextTask,
                            }: HandlersProps) => {

    const newCard = () => {
        setModal(true);
    };

    const createTask = () => {
        const newTask = {
            id: Guid.newGuid().toString(),
            text: textTask,
            completed: false,
        };

        setTasks(prev => {
            const updated = [...prev, newTask];
            console.log("Updated tasks:", updated);
            return updated;
        });

        setModal(false);
        setTextTask("");
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextTask(e.target.value);
    };

    const handleChangeEditText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTextTask(e.target.value);
    };

    const editHandle = (id: string) => {
        setIsEditModalOpen(true);
        localStorage.setItem("taskId", id);
    };

    const editTaskHandle = () => {
        const id = localStorage.getItem("taskId");
        if (!id) return;

        setTasks(prev =>
            prev.map(task =>
                task.id === id ? {...task, text: editTextTask} : task
            )
        );

        setIsEditModalOpen(false);
        setEditTextTask("");
    };

    const deleteHandle = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };

    const doneHandle = (id: string) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? {...task, completed: !task.completed} : task
            )
        );
    };

    return {
        newCard,
        createTask,
        handleChangeText,
        handleChangeEditText,
        editHandle,
        editTaskHandle,
        deleteHandle,
        doneHandle,
    };
};