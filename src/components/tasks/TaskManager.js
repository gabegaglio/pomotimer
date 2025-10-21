import CreateTask from './CreateTask';
import TaskList from './TaskList';
import { useState, useEffect } from 'react';
import useUserData from '../../hooks/useUserData';

const TaskManager = ({ isLoggedIn, isRunning }) => {
  const {
    userData,
    updateTasks,
    loading: userDataLoading,
    user,
    isAuthReady,
  } = useUserData();

  // Initialize with empty array, will be populated from appropriate source
  const [tasks, setTasks] = useState([]);

  // Load tasks from appropriate source
  useEffect(() => {
    if (!isAuthReady) return; // Don't load until auth is ready

    if (isLoggedIn && userData?.tasks) {
      console.log('Loading tasks from Firebase:', userData.tasks);
      setTasks(userData.tasks);
    } else if (!isLoggedIn) {
      // Load from localStorage for guest users
      try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          console.log('Loading tasks from localStorage:', savedTasks);
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, [isLoggedIn, userData, isAuthReady]);

  const saveTasks = async (newTasks) => {
    // Always save to localStorage regardless of login state
    try {
      console.log('Saving tasks to localStorage:', newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }

    // Additionally save to Firebase if logged in
    if (isLoggedIn) {
      try {
        console.log('Saving tasks to Firebase:', newTasks);
        await updateTasks(newTasks);
      } catch (error) {
        console.error('Error saving tasks to Firebase:', error);
      }
    }
  };

  const addTask = async (task) => {
    if (!task || !task.id) {
      task = { ...task, id: Date.now().toString() };
    }
    console.log('Adding task:', task);
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    await saveTasks(newTasks);
  };

  const deleteTask = async (id) => {
    console.log('Deleting task:', id);
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    await saveTasks(newTasks);
  };

  if (!isAuthReady || (isLoggedIn && userDataLoading)) {
    return (
      <div className="taskWrap w-full flex flex-col items-center justify-center py-4">
        <div className="text-white text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="taskWrap w-full flex flex-col items-center justify-center py-4">
      <div className="w-full max-w-3xl flex flex-col items-center justify-center ">
        <TaskList tasks={tasks} deleteTask={deleteTask} setTasks={setTasks} />
      </div>
      <div className="taskContainer w-full mt-10 max-w-3xl flex flex-col items-center justify-center bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4">
        <CreateTask addTask={addTask} />
      </div>
    </div>
  );
};

export default TaskManager;
