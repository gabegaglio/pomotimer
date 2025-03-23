import React, { useEffect } from 'react';
import Header from './Header';
import Clock from './Clock';
import Pomobtn from './Pomobtn';
import Timer from './Timer';
import StartPauseReset from './StartPauseReset';
import Description from './Description';
import TaskManager from './TaskManager';
import useHomeFunctions from './hooks/useHomeFunctions';
import useUserData from './hooks/useUserData';

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

  // Save timer settings to Firestore when they change
  useEffect(() => {
    if (isLoggedIn) {
      updateTimerSettings({
        pomodoro: pomoInput,
        shortBreak: shortInput,
        longBreak: longInput,
      });
    }
  }, [isLoggedIn, pomoInput, shortInput, longInput, updateTimerSettings]);

  // Save preferences to Firestore when they change
  useEffect(() => {
    if (isLoggedIn) {
      updatePreferences({
        color,
        backgroundPicture,
      });
    }
  }, [isLoggedIn, color, backgroundPicture, updatePreferences]);

  if (userDataLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <div className="text-white text-xl">Loading your settings...</div>
      </div>
    );
  }

  return (
    <div
      className="App flex flex-col items-center justify-center bg-no-repeat bg-cover bg-fixed"
      style={{
        backgroundColor: color,
        backgroundImage: backgroundPicture
          ? `url(${backgroundPicture})`
          : 'none',
      }}
    >
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
          isLoggedIn={isLoggedIn}
          onSaveSettings={updateTimerSettings}
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
      <TaskManager isLoggedIn={isLoggedIn} />
      <Description />
    </div>
  );
}

export default Home;
