import CreateTask from './CreateTask';
import TaskList from './TaskList';
import { useState, useEffect } from 'react';
import useUserData from './hooks/useUserData';

const TaskManager = ({ isLoggedIn }) => {
  const [tasks, setTasks] = useState(() => {
    // Initialize tasks from localStorage on component mount
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Error loading initial tasks from localStorage:', error);
      return [];
    }
  });

  const {
    userData,
    updateTasks,
    loading: userDataLoading,
    user,
    isAuthReady,
  } = useUserData();

  // Load tasks from Firebase if logged in
  useEffect(() => {
    if (isLoggedIn && userData?.tasks) {
      console.log('Loading tasks from Firebase:', userData.tasks);
      setTasks(userData.tasks);
    }
  }, [isLoggedIn, userData]);

  // Save tasks to appropriate storage
  useEffect(() => {
    const saveTasks = async () => {
      // Always save to localStorage regardless of login state
      try {
        console.log('Saving tasks to localStorage:', tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }

      // Additionally save to Firebase if logged in
      if (isLoggedIn) {
        try {
          console.log('Saving tasks to Firebase:', tasks);
          await updateTasks(tasks);
        } catch (error) {
          console.error('Error saving tasks to Firebase:', error);
        }
      }
    };

    saveTasks();
  }, [tasks, isLoggedIn, updateTasks]);

  const addTask = (task) => {
    if (!task || !task.id) {
      task = { ...task, id: Date.now().toString() };
    }
    console.log('Adding task:', task);
    setTasks((currentTasks) => [...currentTasks, task]);
  };

  const deleteTask = (id) => {
    console.log('Deleting task:', id);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  if (!isAuthReady || (isLoggedIn && userDataLoading)) {
    return (
      <div className="taskWrap w-3/4 md:w-1/2 flex flex-col items-center justify-center">
        <div className="text-white text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="taskWrap w-3/4 md:w-1/3 flex flex-col items-center justify-center">
      <div className="w-full h-auto flex flex-col items-center justify-center">
        <TaskList tasks={tasks} deleteTask={deleteTask} setTasks={setTasks} />
      </div>
      <div className="taskContainer w-full h-full flex flex-col my-5 items-center justify-center bg-white bg-opacity-20 rounded-lg">
        <CreateTask addTask={addTask} />
      </div>
    </div>
  );
};

export default TaskManager;
