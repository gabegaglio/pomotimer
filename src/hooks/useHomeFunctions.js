import { useState, useEffect } from 'react';
import ding from '../assets/ding.mp3'; 

const useFunctions = () => {
  // Get values from localStorage or defaults
  const [pomoInput, setPomoInput] = useState(
    localStorage.getItem('pomoInput') || 25
  );
  const [longInput, setLongInput] = useState(
    localStorage.getItem('longInput') || 15
  );
  const [shortInput, setShortInput] = useState(
    localStorage.getItem('shortInput') || 5
  );
  const [color, setColor] = useState(
    localStorage.getItem('color') || '#666EE6'
  );
  const [backgroundPicture, setBackgroundPicture] = useState(
    localStorage.getItem('backgroundPicture') || null
  );

  // Timer state
  const [time, setTime] = useState(pomoInput * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pomoInput', pomoInput);
    localStorage.setItem('longInput', longInput);
    localStorage.setItem('shortInput', shortInput);
    localStorage.setItem('color', color);
    localStorage.setItem('backgroundPicture', backgroundPicture);
  }, [pomoInput, longInput, shortInput, color, backgroundPicture]);

  // Update time when input changes
  useEffect(() => {
    setTime(pomoInput * 60);
  }, [pomoInput]);

  // Apply background image
  useEffect(() => {
    const savedBackground = localStorage.getItem('backgroundPicture');
    document.body.style.backgroundImage = savedBackground
      ? `url(${savedBackground})`
      : 'none';
  }, [backgroundPicture]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (startTimer && time > 0) {
      setIsRunning(true);
      timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (time === 0) {
      setIsRunning(false);
      clearInterval(timer);
      playSound();
    }
    return () => clearInterval(timer);
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
    setTime(pomoInput * 60);
    setStartTimer(false);
  };

  const handleButtonClick = (clickedTime) => {
    const [minutes, seconds] = clickedTime.split(':').map(Number);
    setTime(minutes * 60 + seconds);
    setStartTimer(false);
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

export default useFunctions;
