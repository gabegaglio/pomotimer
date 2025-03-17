import React from 'react';
import Header from './Header.js';
import Clock from './Clock.js';
import Pomobtn from './Pomobtn.js';
import Timer from './Timer.js';
import StartPauseReset from './StartPauseReset.js';
import Description from './Description.js';
import TaskManager from './TaskManager.js';
import useFunctions from './hooks/useHomeFunctions.js';
import useFetch from './hooks/useFetch.js';
import Quotes from './Quotes.js';

function Home() {
  const {
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
    formatTime,
    handleStart,
    handlePause,
    handleReset,
    handleButtonClick,
  } = useFunctions();

  return (
    <div className="App flex flex-col items-center justify-center bg-no-repeat bg-cover bg-fixed">
      <div className="contentWrap w-screen mb-5">
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
          isLoggedIn={false}
        />
        <div className="contentContainer w-full h-4/5 flex flex-col justify-center items-center">
          <Clock />
          <Pomobtn
            pomoTime={`${pomoInput}:00`}
            longTime={`${longInput}:00`}
            shortTime={`${shortInput}:00`}
            onClick={handleButtonClick}
          />
          <Timer time={formatTime(time)} />
          <StartPauseReset
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>
      </div>
      <TaskManager />
      <Description />
    </div>
  );
}

export default Home;
