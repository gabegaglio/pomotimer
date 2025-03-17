import CreateTask from "./CreateTask.js";
import TaskList from "./TaskList.js";
import { useState, useEffect} from 'react';


const TaskManager = () => {

    const [tasks, setTasks] = useState(
      JSON.parse(localStorage.getItem('tasks')) || []
    ); // if tasks are there it gets them, else it sets an empty array

    useEffect(() => { 
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]); // waits for tasks to be passed in

    const addTask = (task) => {
      setTasks([...tasks, task]); //... adds old tasks + new task to same array
    };

    const deleteTask = (id) => {
      const updatedTasks = tasks.filter((task) => task.id !== id); //filters out deleted task
      setTasks(updatedTasks); //replaces old tasks with new tasks
    };

    

    return (
      <div className="taskWrap w-3/4 md:w-1/2 flex flex-col items-center justify-center">
        <div className="w-full h-auto flex flex-col items-center justify-center">
          {' '}
          <TaskList tasks={tasks} deleteTask={deleteTask} setTasks={setTasks} />
        </div>
        <div className="taskContainer w-full h-full flex flex-col my-5 items-center justify-center bg-white bg-opacity-20 rounded-lg">
          <CreateTask addTask={addTask} />
        </div>
      </div>
    );
}

export default TaskManager;