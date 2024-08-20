import CreateTask from "./CreateTask.js";
import TaskList from "./TaskList.js";
import { useState, useEffect} from 'react';


const TaskManager = () => {

    const [tasks, setTasks] = useState(
      JSON.parse(localStorage.getItem('tasks')) || []
    );

    useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (task) => {
      setTasks([...tasks, task]); //... adds old tasks to new task array
    };

    const deleteTask = (id) => {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    };

    return (
        <div className="taskWrap">
            <div className="taskContainer">
                <TaskList tasks={tasks} deleteTask={deleteTask}/>
                <CreateTask addTask={addTask}/>
            </div>
        </div>
    );
}

export default TaskManager;