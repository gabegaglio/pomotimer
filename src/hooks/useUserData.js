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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setUser(user);
      setIsAuthReady(true);
      if (!user) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore data changes
  useEffect(() => {
    let unsubscribe = () => {};

    const setupFirestoreListener = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      console.log('Setting up Firestore listener for user:', user.uid);
      setLoading(true);

      const userDocRef = doc(db, 'users', user.uid);

      try {
        // First, check if the document exists
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          console.log('Creating new user document');
          // Create initial document for new users
          const initialData = {
            email: user.email,
            timerSettings: defaultUserData.timerSettings,
            preferences: defaultUserData.preferences,
            tasks: [],
            createdAt: new Date().toISOString(),
          };

          await setDoc(userDocRef, initialData);
          setUserData(initialData);
          setLoading(false);
        } else {
          console.log('User document exists, merging data');
          const existingData = docSnap.data();
          // Merge with defaults and set immediately
          const mergedData = {
            email: user.email,
            timerSettings: {
              ...defaultUserData.timerSettings,
              ...(existingData.timerSettings || {}),
            },
            preferences: {
              ...defaultUserData.preferences,
              ...(existingData.preferences || {}),
            },
            tasks: Array.isArray(existingData.tasks) ? existingData.tasks : [],
            createdAt: existingData.createdAt || new Date().toISOString(),
          };

          setUserData(mergedData);
          setLoading(false);

          // Set up real-time listener
          unsubscribe = onSnapshot(
            userDocRef,
            (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                console.log('Real-time update received:', data);
                setUserData((prevData) => ({
                  email: user.email,
                  timerSettings: {
                    ...defaultUserData.timerSettings,
                    ...prevData.timerSettings,
                    ...(data.timerSettings || {}),
                  },
                  preferences: {
                    ...defaultUserData.preferences,
                    ...prevData.preferences,
                    ...(data.preferences || {}),
                  },
                  tasks: Array.isArray(data.tasks)
                    ? data.tasks
                    : prevData.tasks,
                  createdAt: data.createdAt || prevData.createdAt,
                }));
              }
            },
            (error) => {
              console.error('Error in Firestore listener:', error);
              setError(error);
              setLoading(false);
            }
          );
        }
      } catch (error) {
        console.error('Error in setupFirestoreListener:', error);
        setError(error);
        setLoading(false);
      }
    };

    if (isAuthReady) {
      setupFirestoreListener();
    }

    return () => unsubscribe();
  }, [user, isAuthReady]);

  const saveUserData = async (newData) => {
    try {
      if (!isAuthReady || !user) {
        console.log('Not saving - auth not ready or no user');
        return;
      }

      console.log('Saving user data:', newData);
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      const currentData = docSnap.exists() ? docSnap.data() : defaultUserData;
      console.log('Current data from Firestore:', currentData);

      // Create a new object with only the fields that are being updated
      const updateData = {};
      let hasChanges = false;

      if (newData.timerSettings) {
        const currentSettings =
          currentData.timerSettings || defaultUserData.timerSettings;
        const newSettings = {
          ...currentSettings,
          ...newData.timerSettings,
        };

        // Only update if values actually changed
        if (JSON.stringify(currentSettings) !== JSON.stringify(newSettings)) {
          console.log('Timer settings changed:', newSettings);
          updateData.timerSettings = newSettings;
          hasChanges = true;
        }
      }

      if (newData.preferences) {
        const currentPrefs =
          currentData.preferences || defaultUserData.preferences;
        const newPrefs = {
          ...currentPrefs,
          ...newData.preferences,
        };

        // Only update if values actually changed
        if (JSON.stringify(currentPrefs) !== JSON.stringify(newPrefs)) {
          updateData.preferences = newPrefs;
          hasChanges = true;
        }
      }

      if (newData.tasks !== undefined) {
        const currentTasks = currentData.tasks || [];
        // Only update if tasks actually changed
        if (JSON.stringify(currentTasks) !== JSON.stringify(newData.tasks)) {
          updateData.tasks = newData.tasks;
          hasChanges = true;
        }
      }

      // Only save to Firestore if there are actual changes
      if (hasChanges) {
        const mergedData = {
          ...currentData,
          ...updateData,
        };
        console.log('Saving changes to Firestore:', updateData);
        await setDoc(userDocRef, mergedData);
        return mergedData;
      } else {
        console.log('No changes detected, skipping Firestore update');
        return currentData;
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      setError(error);
      throw error;
    }
  };

  const updateTimerSettings = async (settings) => {
    if (!isAuthReady || !user) {
      console.log('Not updating timer settings - auth not ready or no user');
      return;
    }
    try {
      console.log('Updating timer settings:', settings);
      const result = await saveUserData({ timerSettings: settings });
      console.log('Timer settings updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating timer settings:', error);
      throw error;
    }
  };

  const updatePreferences = async (preferences) => {
    if (!isAuthReady || !user) return;
    try {
      return await saveUserData({ preferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const updateTasks = async (tasks) => {
    if (!isAuthReady || !user) return;
    try {
      return await saveUserData({ tasks });
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
