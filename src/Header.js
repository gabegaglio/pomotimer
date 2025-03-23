import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import useHeaderChanges from './hooks/useHeaderChanges';
import Settings from './Settings.js';

const Header = ({
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
  isLoggedIn,
  onSaveSettings,
}) => {
  // Keep local state for the inputs while menu is open
  const [localPomo, setLocalPomo] = useState(pomoInput);
  const [localShort, setLocalShort] = useState(shortInput);
  const [localLong, setLocalLong] = useState(longInput);

  const navigate = useNavigate();
  const {
    menuOpen,
    toggleMenu,
    handleTimeChange,
    handleColorChange,
    handleReset,
    handleBackgroundChange,
  } = useHeaderChanges(
    color,
    setColor,
    setLocalPomo,
    setLocalLong,
    setLocalShort,
    setBackgroundPicture,
    () => {
      // When menu closes, update parent state and save settings
      if (isLoggedIn) {
        setPomoInput(localPomo);
        setShortInput(localShort);
        setLongInput(localLong);
        onSaveSettings({
          pomodoro: localPomo,
          shortBreak: localShort,
          longBreak: localLong,
        });
      }
    }
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const inputList = [
    { label: 'Pomodoro', value: localPomo, type: 'pomo' },
    { label: 'Short Break', value: localShort, type: 'short' },
    { label: 'Long Break', value: localLong, type: 'long' },
  ];

  return (
    <div className="p-2 md:p-5 width-100 flex justify-end">
      <div className="flex flex-row justify-end items-center z-5000">
        <button
          className="logBtn mx-4 text-white text-md md:text-xl bg-white bg-opacity-20 hover:bg-opacity-30 hover:scale-105 rounded-lg transition px-2 py-1 duration-100 ease-in-out"
          onClick={isLoggedIn ? handleSignOut : () => navigate('/login')}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
        <Settings onClick={toggleMenu} />
      </div>

      {menuOpen && (
        <div className="fixed bg-opacity-50 inset-0 flex items-center justify-center z-50">
          <div
            className="text-white rounded-lg shadow-lg p-6 w-fit h-auto flex flex-col items-center relative"
            style={{ backgroundColor: color }}
          >
            <button
              className="absolute top-4 right-4 text-4xl font-bold text-gray-300 hover:text-white transition"
              onClick={toggleMenu}
            >
              &times;
            </button>

            <p className="w-fit text-2xl font-semibold rounded-lg py-2 px-6 shadow-md text-center bg-opacity-20">
              Settings
            </p>

            <div
              className="flex flex-col items-center w-full mt-4 space-y-6"
              style={{ backgroundColor: color }}
            >
              <div className="grid grid-rows-3 sm:grid-cols-3 sm:grid-rows-1 w-full h-auto gap-4">
                {inputList.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <label className="text-md overflow-wrap rounded-t-lg font-medium bg-white bg-opacity-20 py-2 px-4 shadow-md text-center w-full">
                      {item.label}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={item.value}
                      onChange={(e) => handleTimeChange(e, item.type)}
                      className="w-full p-2 text-md text-center rounded-b-lg bg-white bg-opacity-10 border-none outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center w-full">
                <label className="block text-lg font-medium bg-white bg-opacity-20 rounded-md py-2 px-4 shadow-md text-center w-full cursor-pointer hover:bg-opacity-30">
                  Choose Background Picture
                  <input
                    id="pictureInput"
                    type="file"
                    onChange={handleBackgroundChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-col items-center w-full">
                <label
                  htmlFor="colorInput"
                  className="block text-lg font-medium bg-white bg-opacity-20 rounded-md py-2 px-4 shadow-md text-center w-full cursor-pointer hover:bg-opacity-30"
                >
                  Background Color
                </label>
                <input
                  id="colorInput"
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="cursor-pointer w-0 h-0 text-md text-center bg-black border-black outline-none"
                />
              </div>

              <button
                className="block text-lg font-medium bg-white bg-opacity-20 rounded-md py-2 px-4 shadow-md text-center w-full cursor-pointer hover:bg-opacity-30"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
