import './App.css'
import Card from "./components/Card.tsx";
import EmptyCard from "./components/EmptyCard.tsx";
import {useState, useRef, useEffect, useCallback} from "react";
import ImportExportMenu from "./components/ImportExportMenu.tsx";
import Modal from "./components/Modal.tsx";
import {Guid} from "js-guid";
import type {TaskObject} from "./data/TaskObject.ts";
import {IconUpload} from "@tabler/icons-react";


function App() {
    const [isImportExportOpen, setIsImportExportOpen] = useState(false)
    const [modal, setModal] = useState(false)
    const [textTask, setTextTask] = useState("")
    const [tasks, setTasks] = useState<TaskObject[]>([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editTextTask, setEditTextTask] = useState("")

    const menuButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node

            if (!menuButtonRef.current?.contains(target)) {
                setIsImportExportOpen(false)
            }
        };

        window.addEventListener('click', handleClickOutside)

        return () => {
            window.removeEventListener('click', handleClickOutside)
        };
    }, []);

    const newCard = () => {
        setModal(true)
    }

    const createTask = () => {
        const newTask = {
            id: Guid.newGuid().toString(),
            text: textTask,
            completed: false,
        };

        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks, newTask];
            console.log("Updated tasks:", updatedTasks);
            return updatedTasks;
        });

        setModal(false);
        setTextTask("");
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target
        setTextTask(value);
    }

    const handleChangeEditText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target
        setEditTextTask(value)
    }

    const handleImportExportClick = () => {
        setIsImportExportOpen(true)
    }

    const handleClickOutside = () => {
        setIsImportExportOpen(false)
    }

    const editHandle = (id : string) => {
        setIsEditModalOpen(true)
        localStorage.setItem("taskId", id)
    }

    const editTaskHandle = () => {
        const id = localStorage.getItem("taskId")
        if (!id) return;
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? { ...task, text: editTextTask }
                    : task
            )
        );
        setIsEditModalOpen(false)
        setEditTextTask("")
    }

    const deleteHandle = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const doneHandle = (id: string) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }

    const exportHandle = () => {
        setIsImportExportOpen(false)
        const json = JSON.stringify(tasks, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const link = document.createElement("a");
        link.href = url;
        link.download = "tasks.json"

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url)
    }

    const importHandle = useCallback(() => {
        setIsImportExportOpen(false)
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

        input.addEventListener('change', handleChange, { once: true });
        input.click();
    }, [setTextTask])

    return (
        <>
            <ImportExportMenu isOpen={isImportExportOpen} importHook={importHandle} exportHook={exportHandle}/>
            <Modal isOpen={modal} onClose={() => setModal(false)} onConfirm={createTask} message={
                <label>
                    Текст задачи
                    <input type={"text"} value={textTask} onChange={handleChangeText} required/>
                </label>
            }/>
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onConfirm={editTaskHandle} message={
                <label>
                    Изменить текст задачи
                    <input type={"text"} value={editTextTask} onChange={handleChangeEditText} required/>
                </label>
            }/>
            <div onClick={handleClickOutside} className="card-list">
                {tasks.map((task) => (
                    <Card key={task.id} text={task.text} complete={task.completed} completed={() => doneHandle(task.id)} editHook={() => editHandle(task.id)} deleteHook={() => deleteHandle(task.id)}/>
                ))}
                <EmptyCard newCard={newCard}/>
            </div>
            <button className={"floating-button"} onClick={handleImportExportClick} ref={menuButtonRef}><IconUpload /></button>
        </>
    )
}

export default App
