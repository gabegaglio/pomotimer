import { useState, useEffect } from 'react';
import ding from '../assets/ding.mp3';

const useHomeFunctions = () => {
  // Get values from localStorage or defaults
  const [pomoInput, setPomoInput] = useState(() => {
    const saved = localStorage.getItem('pomoInput');
    return saved ? parseInt(saved, 10) : 25;
  });

  const [longInput, setLongInput] = useState(() => {
    const saved = localStorage.getItem('longInput');
    return saved ? parseInt(saved, 10) : 15;
  });

  const [shortInput, setShortInput] = useState(() => {
    const saved = localStorage.getItem('shortInput');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [color, setColor] = useState(() => {
    return localStorage.getItem('color') || '#368CE7';
  });

  const [backgroundPicture, setBackgroundPicture] = useState(() => {
    return localStorage.getItem('backgroundPicture') || null;
  });

  // Timer state
  const [time, setTime] = useState(() => pomoInput * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [selectedMode, setSelectedMode] = useState('pomodoro'); // Track which mode is selected: 'pomodoro', 'short', or 'long'

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomoInput', pomoInput);
    localStorage.setItem('longInput', longInput);
    localStorage.setItem('shortInput', shortInput);
    localStorage.setItem('color', color);
    localStorage.setItem('backgroundPicture', backgroundPicture);
  }, [pomoInput, longInput, shortInput, color, backgroundPicture]);

  // Update time when input changes (if timer is not running)
  useEffect(() => {
    if (!isRunning) {
      // Update time based on the currently selected mode
      if (selectedMode === 'pomodoro') {
        setTime(pomoInput * 60);
      } else if (selectedMode === 'short') {
        setTime(shortInput * 60);
      } else if (selectedMode === 'long') {
        setTime(longInput * 60);
      }
    }
  }, [pomoInput, shortInput, longInput, isRunning, selectedMode]);

  // Apply background image
  useEffect(() => {
    const savedBackground = localStorage.getItem('backgroundPicture');
    document.body.style.backgroundImage = savedBackground
      ? `url(${savedBackground})`
      : 'none';
  }, [backgroundPicture]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (startTimer && time > 0) {
      setIsRunning(true);
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            playSound();
            setStartTimer(false);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (time === 0) {
      setStartTimer(false);
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [startTimer, time]);

  const playSound = () => {
    const audio = new Audio(ding);
    audio.play();
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString();
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    document.title =
      minutes === '0' && seconds === '00'
        ? 'Times Up!'
        : `${minutes}:${seconds}`;
    return `${minutes}:${seconds}`;
  };

  const handleStart = () => setStartTimer(true);
  const handlePause = () => setStartTimer(false);
  const handleReset = () => {
    setIsRunning(false);
    setStartTimer(false);
    // Reset to the time based on currently selected mode
    if (selectedMode === 'pomodoro') {
      setTime(pomoInput * 60);
    } else if (selectedMode === 'short') {
      setTime(shortInput * 60);
    } else if (selectedMode === 'long') {
      setTime(longInput * 60);
    }
  };

  const handleButtonClick = (clickedTime) => {
    const [minutes, seconds] = clickedTime.split(':').map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    setTime(timeInSeconds);
    setStartTimer(false);

    // Determine which mode was clicked based on the time
    if (timeInSeconds === pomoInput * 60) {
      setSelectedMode('pomodoro');
    } else if (timeInSeconds === shortInput * 60) {
      setSelectedMode('short');
    } else if (timeInSeconds === longInput * 60) {
      setSelectedMode('long');
    }
  };

  return {
    pomoInput,
    setPomoInput,
    longInput,
    setLongInput,
    shortInput,
    setShortInput,
    color,
    setColor,
    backgroundPicture,
    setBackgroundPicture,
    time,
    setTime,
    isRunning,
    setIsRunning,
    startTimer,
    setStartTimer,
    formatTime,
    handleStart,
    handlePause,
    handleReset,
    handleButtonClick,
  };
};

export default useHomeFunctions;
