import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CreateTask = ({ addTask }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTask = {
      id: uuidv4(),
      name: name.trim(),
      desc: desc.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    setName('');
    setDesc('');
  };

  return (
    <div className="createTask w-full h-auto flex flex-col items-center justify-center py-2 px-4">
      <form
        className="taskForm w-full flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          className="taskNameInput py-2 w-full text-white text-left text-lg bg-white bg-opacity-0 rounded-lg focus:outline-none focus:bg-none placeholder-white"
          type="text"
          placeholder="What're you up to?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="taskDescInput pt-4 w-full text-white text-left text-lg bg-white bg-opacity-0 rounded-lg focus:outline-none focus:bg-none placeholder-white"
          type="text"
          placeholder="Add a note!"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="addTaskDiv flex flex-col items-center justify-center w-full border-t border-white mb-2">
          <button className="addTaskBtn w-fit text-white bg-white bg-opacity-20 mt-2 p-2 text-lg text-center rounded-lg focus:outline-none hover:scale-105 transition duration-100 ease-in-out">
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
