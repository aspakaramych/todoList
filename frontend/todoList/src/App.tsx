import './App.css'
import Card from "./components/Card.tsx";
import EmptyCard from "./components/EmptyCard.tsx";
import ImportExportMenu from "./components/ImportExportMenu.tsx";
import Modal from "./components/Modal.tsx";
import {IconUpload} from "@tabler/icons-react";
import {useAppLogic} from './hooks/appLogicHook.ts';
import {appHandlers} from './handles/appHandles.ts';


function App() {
    const logic = useAppLogic();

    const handlers = appHandlers({
        setModal: logic.setModal,
        setTextTask: logic.setTextTask,
        setTasks: logic.setTasks,
        setIsEditModalOpen: logic.setIsEditModalOpen,
        setEditTextTask: logic.setEditTextTask,
        textTask: logic.textTask,
        editTextTask: logic.editTextTask,
    });

    const handleClickOutside = () => {
        logic.setIsImportExportOpen(false);
    };

    return (
        <>
            <ImportExportMenu isOpen={logic.isImportExportOpen} importHook={logic.handleImport}
                              exportHook={logic.handleExport}/>
            <Modal isOpen={logic.modal} onClose={() => logic.setModal(false)} onConfirm={handlers.createTask} message={
                <label>
                    Текст задачи
                    <input type={"text"} value={logic.textTask} onChange={handlers.handleChangeText} required/>
                </label>
            }/>
            <Modal isOpen={logic.isEditModalOpen} onClose={() => logic.setIsEditModalOpen(false)}
                   onConfirm={handlers.editTaskHandle} message={
                <label>
                    Изменить текст задачи
                    <input type={"text"} value={logic.editTextTask} onChange={handlers.handleChangeEditText} required/>
                </label>
            }/>
            <div onClick={handleClickOutside} className="card-list">
                {logic.tasks.map((task) => (
                    <Card key={task.id} text={task.text} complete={task.completed}
                          completed={() => handlers.doneHandle(task.id)} editHook={() => handlers.editHandle(task.id)}
                          deleteHook={() => handlers.deleteHandle(task.id)}/>
                ))}
                <EmptyCard newCard={handlers.newCard}/>
            </div>
            <button className={"floating-button"} onClick={() => logic.setIsImportExportOpen(true)}
                    ref={logic.menuButtonRef}><IconUpload/></button>
        </>
    )
}

export default App
