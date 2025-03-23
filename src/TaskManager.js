import CreateTask from './CreateTask';
import TaskList from './TaskList';
import { useState, useEffect, useCallback } from 'react';
import useUserData from './hooks/useUserData';

const TaskManager = ({ isLoggedIn }) => {
  const [tasks, setTasks] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    userData,
    updateTasks,
    loading: userDataLoading,
    user,
    isAuthReady,
  } = useUserData();

  // Load initial tasks
  useEffect(() => {
    if (!isAuthReady) {
      console.log('Waiting for auth to be ready...');
      return;
    }

    console.log(
      'Loading tasks. IsLoggedIn:',
      isLoggedIn,
      'User:',
      user?.email,
      'AuthReady:',
      isAuthReady
    );
    console.log('UserData:', userData);

    if (isLoggedIn && user && userData) {
      // Load from Firestore
      if (Array.isArray(userData.tasks)) {
        console.log('Setting tasks from Firestore:', userData.tasks);
        setTasks(userData.tasks);
      } else {
        console.log('No valid tasks found in Firestore, using empty array');
        setTasks([]);
      }
    } else {
      // Load from localStorage
      try {
        const localTasks = localStorage.getItem('tasks');
        if (localTasks) {
          const parsedTasks = JSON.parse(localTasks);
          if (Array.isArray(parsedTasks)) {
            console.log('Setting tasks from localStorage:', parsedTasks);
            setTasks(parsedTasks);
          } else {
            console.log('Invalid tasks in localStorage, using empty array');
            setTasks([]);
          }
        } else {
          console.log('No tasks in localStorage, using empty array');
          setTasks([]);
        }
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        setTasks([]);
      }
    }
    setIsInitialized(true);
  }, [isLoggedIn, userData, user, isAuthReady]);

  // Save tasks when they change
  const saveTasksToStorage = useCallback(
    async (tasksToSave) => {
      if (!isInitialized || !isAuthReady) {
        console.log('Not saving tasks - not yet initialized or auth not ready');
        return;
      }

      if (!Array.isArray(tasksToSave)) {
        console.error('Invalid tasks array:', tasksToSave);
        return;
      }

      console.log(
        'Saving tasks. IsLoggedIn:',
        isLoggedIn,
        'User:',
        user?.email,
        'Tasks:',
        tasksToSave
      );

      if (isLoggedIn && user) {
        // Save to Firestore
        try {
          await updateTasks(tasksToSave);
        } catch (error) {
          console.error('Error saving tasks to Firestore:', error);
        }
      } else {
        // Save to localStorage
        try {
          localStorage.setItem('tasks', JSON.stringify(tasksToSave));
        } catch (error) {
          console.error('Error saving tasks to localStorage:', error);
        }
      }
    },
    [isLoggedIn, user, isAuthReady, isInitialized, updateTasks]
  );

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks, saveTasksToStorage]);

  const addTask = (task) => {
    console.log('Adding task:', task);
    if (!task || !task.id) {
      task = { ...task, id: Date.now().toString() };
    }
    setTasks((currentTasks) => {
      const newTasks = Array.isArray(currentTasks)
        ? [...currentTasks, task]
        : [task];
      console.log('New tasks array after addition:', newTasks);
      return newTasks;
    });
  };

  const deleteTask = (id) => {
    console.log('Deleting task:', id);
    setTasks((currentTasks) => {
      const updatedTasks = Array.isArray(currentTasks)
        ? currentTasks.filter((task) => task.id !== id)
        : [];
      console.log('New tasks array after deletion:', updatedTasks);
      return updatedTasks;
    });
  };

  if (!isAuthReady || userDataLoading) {
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
