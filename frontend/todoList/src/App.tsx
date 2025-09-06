import './App.css'
import Card from "./components/Card.tsx";
import EmptyCard from "./components/EmptyCard.tsx";
import {useState, useRef, useEffect} from "react";
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

    const importHook = () => {
        setIsImportExportOpen(false);
        console.log("importHook")
    }

    const exportHook = () => {
        setIsImportExportOpen(false)
        console.log("exportHook")
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

    return (
        <>
            <ImportExportMenu isOpen={isImportExportOpen} importHook={importHook} exportHook={exportHook}/>

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
                    <Card key={task.id} text={task.text} editHook={() => editHandle(task.id)} deleteHook={() => deleteHandle(task.id)}/>
                ))}
                <EmptyCard newCard={newCard}/>
            </div>


            <button className={"floating-button"} onClick={handleImportExportClick} ref={menuButtonRef}><IconUpload /></button>


        </>
    )
}

export default App
