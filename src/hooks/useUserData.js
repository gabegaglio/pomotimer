import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

const defaultUserData = {
  timerSettings: {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  preferences: {
    color: '#368CE7',
    backgroundPicture: null,
  },
  tasks: [],
};

const useUserData = () => {
  const [userData, setUserData] = useState(defaultUserData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore data changes
  useEffect(() => {
    let unsubscribe = () => {};

    const setupFirestoreListener = async () => {
      if (user) {
        console.log('Setting up Firestore listener for:', user.email);
        const userDocRef = doc(db, 'users', user.uid);

        try {
          // First, check if the document exists
          const docSnap = await getDoc(userDocRef);

          if (!docSnap.exists()) {
            // Create initial document if it doesn't exist
            console.log('Creating new user document with defaults');
            await setDoc(userDocRef, defaultUserData);
            setUserData(defaultUserData);
          } else {
            // If document exists, ensure it has all required fields
            const existingData = docSnap.data();
            console.log('Existing Firestore data:', existingData);

            const mergedData = {
              timerSettings: {
                ...defaultUserData.timerSettings,
                ...existingData.timerSettings,
              },
              preferences: {
                ...defaultUserData.preferences,
                ...existingData.preferences,
              },
              tasks: Array.isArray(existingData.tasks)
                ? existingData.tasks
                : [],
            };

            console.log('Merged data:', mergedData);
            setUserData(mergedData);

            // Only update Firestore if the data structure needs to be fixed
            if (JSON.stringify(existingData) !== JSON.stringify(mergedData)) {
              await setDoc(userDocRef, mergedData);
            }
          }

          // Subscribe to real-time updates
          unsubscribe = onSnapshot(
            userDocRef,
            (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                console.log('Raw Firestore update:', data);

                // Ensure we always have the required fields with defaults
                const updatedData = {
                  timerSettings: {
                    ...defaultUserData.timerSettings,
                    ...data.timerSettings,
                  },
                  preferences: {
                    ...defaultUserData.preferences,
                    ...data.preferences,
                  },
                  tasks: Array.isArray(data.tasks) ? data.tasks : [],
                };

                console.log('Processed Firestore update:', updatedData);
                setUserData(updatedData);
              }
              setLoading(false);
            },
            (error) => {
              console.error('Error fetching user data:', error);
              setError(error);
              setLoading(false);
            }
          );
        } catch (error) {
          console.error('Error in setupFirestoreListener:', error);
          setError(error);
          setLoading(false);
        }
      } else {
        setUserData(defaultUserData);
        setLoading(false);
      }
    };

    if (isAuthReady) {
      setupFirestoreListener().catch((error) => {
        console.error('Error setting up Firestore listener:', error);
        setError(error);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, [user, isAuthReady]);

  const saveUserData = async (newData) => {
    try {
      if (!isAuthReady) {
        console.log('Waiting for auth to be ready...');
        return;
      }

      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);

      // Get current data from Firestore
      const docSnap = await getDoc(userDocRef);
      const currentData = docSnap.exists() ? docSnap.data() : defaultUserData;

      // Merge the data, ensuring tasks array is preserved
      const mergedData = {
        timerSettings: {
          ...currentData.timerSettings,
          ...(newData.timerSettings || {}),
        },
        preferences: {
          ...currentData.preferences,
          ...(newData.preferences || {}),
        },
        tasks: Array.isArray(newData.tasks)
          ? newData.tasks
          : currentData.tasks || [],
      };

      console.log('Current Firestore data:', currentData);
      console.log('New data to save:', newData);
      console.log('Final merged data:', mergedData);

      await setDoc(userDocRef, mergedData);
    } catch (error) {
      console.error('Error saving user data:', error);
      setError(error);
      throw error;
    }
  };

  const updateTimerSettings = async (settings) => {
    if (!isAuthReady || !user) return;
    try {
      await saveUserData({ timerSettings: settings });
    } catch (error) {
      console.error('Error updating timer settings:', error);
      throw error;
    }
  };

  const updatePreferences = async (preferences) => {
    if (!isAuthReady || !user) return;
    try {
      await saveUserData({ preferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const updateTasks = async (tasks) => {
    if (!isAuthReady || !user) return;
    try {
      console.log('Updating tasks:', tasks);
      // Get current data first
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      const currentData = docSnap.exists() ? docSnap.data() : userData;

      // Only update if tasks have actually changed
      if (JSON.stringify(currentData.tasks) !== JSON.stringify(tasks)) {
        await saveUserData({
          ...currentData,
          tasks: Array.isArray(tasks) ? tasks : [],
        });
      } else {
        console.log('Tasks unchanged, skipping update');
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
      throw error;
    }
  };

  return {
    userData,
    loading,
    error,
    updateTimerSettings,
    updatePreferences,
    updateTasks,
    user,
    isAuthReady,
  };
};

export default useUserData;
