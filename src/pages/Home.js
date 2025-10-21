import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Clock from '../components/timer/Clock';
import Pomobtn from '../components/timer/Pomobtn';
import Timer from '../components/timer/Timer';
import StartPauseReset from '../components/timer/StartPauseReset';
import Description from '../components/layout/Description';
import TaskManager from '../components/tasks/TaskManager';
import useHomeFunctions from '../hooks/useHomeFunctions';
import useUserData from '../hooks/useUserData';

function Home({ isLoggedIn }) {
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
    isRunning,
  } = useHomeFunctions();

  const {
    userData,
    loading: userDataLoading,
    updateTimerSettings,
    updatePreferences,
  } = useUserData();

  // Load user data when available
  useEffect(() => {
    if (isLoggedIn && userData && !userDataLoading) {
      // Update timer settings
      if (userData.timerSettings) {
        setPomoInput(userData.timerSettings.pomodoro);
        setShortInput(userData.timerSettings.shortBreak);
        setLongInput(userData.timerSettings.longBreak);
      }

      // Update preferences
      if (userData.preferences) {
        setColor(userData.preferences.color);
        if (userData.preferences.backgroundPicture) {
          setBackgroundPicture(userData.preferences.backgroundPicture);
        }
      }
    }
  }, [
    isLoggedIn,
    userData,
    userDataLoading,
    setPomoInput,
    setShortInput,
    setLongInput,
    setColor,
    setBackgroundPicture,
  ]);

  // Only show loading screen for logged-in users
  if (isLoggedIn && userDataLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <div className="text-white text-xl">Loading settings</div>
      </div>
    );
  }

  return (
    <div
      className="App min-h-screen flex flex-col items-center justify-between bg-no-repeat bg-cover bg-fixed"
      style={{
        backgroundColor: color,
        backgroundImage: backgroundPicture
          ? `url(${backgroundPicture})`
          : 'none',
      }}
    >
      <div className="contentWrap w-screen flex-1 flex flex-col">
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
          isLoggedIn={isLoggedIn}
          onSaveSettings={updateTimerSettings}
          updatePreferences={updatePreferences}
        />
        <div className="contentContainer flex-1 flex flex-col justify-center items-center">
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
      <div className="w-3/4 flex flex-col items-center justify-center">
        <TaskManager isLoggedIn={isLoggedIn} isRunning={isRunning} />
      </div>
    </div>
  );
}

export default Home;
