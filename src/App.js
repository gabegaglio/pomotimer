import Header from './Header.js';
import Clock from './Clock.js';
import Pomobtn from './Pomobtn.js';
import Timer from './Timer.js';
import Start from './Start.js';
import Description from './Description.js';
import React, { useState, useEffect } from 'react';

function App() {
  //CODE FOR INPUTS/SETTINGS--------------------------------------------------
  //gets values based on local storage or defaults
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

  //waits on new inputted values to set local storage
  useEffect(() => {
    localStorage.setItem('pomoInput', pomoInput);
    localStorage.setItem('longInput', longInput);
    localStorage.setItem('shortInput', shortInput);
    localStorage.setItem('color', color);
    localStorage.setItem('backgroundPicture', backgroundPicture);
  }, [pomoInput, longInput, shortInput, color, backgroundPicture]);

  useEffect(() => {
    const savedBackground = localStorage.getItem('backgroundPicture');
    if (savedBackground) {
      document.querySelector(
        'body'
      ).style.backgroundImage = `url(${savedBackground})`;
      console.log('set saved background image');
    } else {
      document.querySelector('body').style.backgroundImage = `none`;
    }
  }, [backgroundPicture]);

  //CODE FOR TIMER------------------------------------------------------------
  const [selectedTime, setSelectedTime] = useState({ pomoInput }, ':00');

  const initialMinutes = pomoInput;
  const initialSeconds = initialMinutes * 60;
  const [time, setTime] = useState(initialSeconds);

  //turns on and off timer
  const [isRunning, setIsRunning] = useState(false);

  //to make sure timer only starts when start button clicked
  const [startTimer, setStartTimer] = useState(false);

  useEffect(() => {
    let timer;
    //startTimer condition
    if (startTimer && time > 0) {
      //sets isRunning to true
      setIsRunning(true);
      timer = setInterval(() => {
        // arrow function expression, returns the result of the expression on the right side
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [startTimer, time]);
  //waits for time value and for startTime to be true

  const handleStart = () => {
    setStartTimer(true);
  };

  const handlePause = () => {
    setStartTimer(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialSeconds);
    setStartTimer(false);
  };

  const handleButtonClick = (clickedTime) => {
    const [minutes, seconds] = clickedTime.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    setTime(totalSeconds);
    //stop timer when button is changed, ie pomo to short break
    setStartTimer(false);
  };

  const formatTime = (timeInSeconds) => {
    //converts to minutes
    const minutes = Math.floor(timeInSeconds / 60).toString();
    //takes left over secONDS
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    // Check if minutes is more than 0 to avoid padding with '0'
    const formattedMinutes = minutes > 0 ? minutes : '0';

    return `${formattedMinutes}:${seconds}`;
  };

  return (
    <div className="App">
      <div className="contentWrap">
        <Header
          pomoInput={pomoInput}
          setPomoInput={setPomoInput}
          longInput={longInput}
          setLongInput={setLongInput}
          shortInput={shortInput}
          setShortInput={setShortInput}
          color={color}
          setColor={setColor}
          backgroundPicture={backgroundPicture}
          setBackgroundPicture={setBackgroundPicture}
        />

        <div className="contentContainer">
          <Clock />

          <Pomobtn
            /*creates props to be passed in with onClick function*/
            pomoTime={`${pomoInput}:00`}
            longTime={`${longInput}:00`}
            shortTime={`${shortInput}:00`}
            onClick={handleButtonClick}
          />

          <Timer time={formatTime(time)} />

          <Start
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
