import './App.css'
import Card from "./components/Card.tsx";
import EmptyCard from "./components/EmptyCard.tsx";
import {useState} from "react";
import ImportExportMenu from "./components/ImportExportMenu.tsx";
import Modal from "./components/Modal.tsx";
import {Guid} from "js-guid";
import type {TaskObject} from "./data/TaskObject.ts";


function App() {
    const [isImportExportOpen, setIsImportExportOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [textTask, setTextTask] = useState("");
    const [tasks, setTasks] = useState<TaskObject[]>([]);

    const newCard = () => {
        setModal(true);
    }

    const createTask = () => {
        const newTask = {
            id: Guid.newGuid().toString(),
            text: textTask,
            completed: false,
        }
        setModal(false)
        setTextTask("")
        setTasks([...tasks, newTask])
    }

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setTextTask(value);
    }

    const handleImportExportClick = () => {
        setIsImportExportOpen(true);
    }

    const importHook = () => {
        setIsImportExportOpen(false);
        console.log("importHook");
    }

    const exportHook = () => {
        setIsImportExportOpen(false);
        console.log("exportHook");
    }

    const handleClickOutside = () => {
        setIsImportExportOpen(false);
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
            <div onClick={handleClickOutside} className="card-list">
                {tasks.map((task) => (
                    <Card key={task.id} text={task.text}/>
                ))}
                <EmptyCard newCard={newCard}/>
            </div>


            <button className={"button"} onClick={handleImportExportClick}></button>


        </>
    )
}

export default App
