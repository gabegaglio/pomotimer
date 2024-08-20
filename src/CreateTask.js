
import { useState } from "react";

const CreateTask = ({ addTask }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = Date.now() + Math.floor(Math.random() * 10000); // Generate unique ID
    const task = { name, desc, id }; // Create task object
    console.log('Created Task:', name, id);
    addTask(task); // Pass the new task to the parent component
    setName(''); 
    setDesc('');
  };

  //BUGS: When task is created it is not displayed

  return (
    <div className="createTask">
      <form className="taskForm" onSubmit={handleSubmit}>
        <input
          className="taskNameInput"
          type="text"
          placeholder="What're you up to?"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state on input change
          required
        />
        <textarea
          className="taskDescInput"
          type="text"
          placeholder="Add a note!"
          value={desc}
          onChange={(e) => setDesc(e.target.value)} // Update desc state on input change
        />
        <div className="addTaskDiv">
          <button className="addTaskBtn">Add Task</button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
