import garb from './assets/garb.svg';
import pencil from './assets/pencil.svg';
import option from './assets/option.svg';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';



// TaskList takes tasks and displays them
const TaskList = ({ tasks, deleteTask, setTasks}) => {

  const [editTaskID, setEditTaskID] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDesc, setEditTaskDesc] = useState("");

  // sets state for editTaskID, editTaskName, and editTaskDesc
  const handleEditTask = (task) => { // called on click of edit button, passes in entire task
    setEditTaskID(task.id); // sets each property as needed
    setEditTaskName(task.name);
    setEditTaskDesc(task.desc || "");
  };

  const updateTask = (id, updatedTask) => { // on click of save button, id of task and updated task object passed in
    setTasks((prevTasks) => // setTasks taken from TaskManager, prevTasks automatically passed in
      prevTasks.map((task) => // loops through each task until id's are equal
        task.id === id ? { ...task, ...updatedTask } : task // replace the task with the updated task, if not keep task
      )
    );
  };

  const handleSaveTask = (id) => {
    updateTask(id, { name: editTaskName, desc: editTaskDesc }); // calls updateTask function
    setEditTaskID(null);
    // saves the edited task by updating the task's name and description,
    // then resets the editTaskID to null to exit edit mode.
  };
    return (
      <div className="taskDisplayContainer w-full space-y-4 max-h-[400px] overflow-y-auto">
        {tasks.map((task, index) => (
          <div
            className="taskDisplay relative w-full bg-white bg-opacity-20 rounded-lg py-2 flex flex-col items-center justify-right w-full font-normal"
            key={task.id}
          >
            <div className="w-full flex items-right justify-end w-full px-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img
                    src={option}
                    alt="option"
                    className="w-6 h-6 hover:scale-110 transition duration-100 ease-in-out"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEditTask(task)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteTask(task.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {editTaskID === task.id ? (
              <>
                <input
                  className="whitespace-normal break-words w-full text-white text-3xl sm:text-2xl font-normal py-2 px-4 text-left bg-transparent border-none focus:ring-0 focus:outline-none"
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                />
                <textarea
                  className="placeholder:text-white whitespace-normal break-words w-full text-white sm:text-lg font-normal px-4 text-left bg-transparent border-none focus:ring-0 focus:outline-none h-auto min-h-[2.5rem] max-h-[8rem] overflow-y-auto resize-none"
                  rows="1"
                  value={editTaskDesc}
                  placeholder="Add a note!"
                  onChange={(e) => setEditTaskDesc(e.target.value)}
                />
                <button
                  className="w-fit text-white bg-white bg-opacity-20 mt-2 p-2 text-lg text-center rounded-lg focus:outline-none hover:scale-105 transition duration-100 ease-in-out"
                  onClick={() => handleSaveTask(task.id)}
                >
                  {' '}
                  Save
                </button>
              </>
            ) : (
              <>
                <h1 className="whitespace-normal break-words w-full text-white text-lg md:text-2xl font-normal py-2 px-4 text-left">
                  {task.name}
                </h1>
                {task.desc && (
                  <p className="whitespace-normal break-words w-full text-white text-base md:text-lg font-normal py-2 px-4 text-left">
                    {task.desc}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
};

export default TaskList;

