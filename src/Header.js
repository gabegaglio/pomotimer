import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from './Settings.js';
import useHeaderChanges from './hooks/useHeaderChanges.js';

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
  isLoggedIn
}) => {
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
    setPomoInput,
    setLongInput,
    setShortInput,
    setBackgroundPicture
  );


  
  const navigate = useNavigate();

  const inputList = [
    { label: 'Pomodoro', value: pomoInput, type: 'pomo' },
    { label: 'Short Break', value: shortInput, type: 'short' },
    { label: 'Long Break', value: longInput, type: 'long' },
  ];


  return (
    <div className="p-2 md:p-5 width-100 flex justify-end ">
      <div className="flex flex-row justify-end items-center z-5000">
        <button
          className="logBtn mx-4 text-white text-md md:text-xl  bg-white bg-opacity-20 hover:bg-opacity-30 hover:scale-105 rounded-lg transition px-2 py-1 duration-100 ease-in-out"
          onClick={isLoggedIn ? undefined : () => navigate('/login')}
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
            {/* Close Button - Now inside popMenu */}
            <button
              className="absolute top-4 right-4 text-4xl font-bold text-gray-300 hover:text-white transition"
              onClick={toggleMenu}
            >
              &times;
            </button>

            {/* Settings Header */}
            <p className="w-fit text-2xl font-semibold rounded-lg py-2 px-6 shadow-md text-center  bg-opacity-20">
              Settings
            </p>

            {/* Inputs Container */}
            <div
              className="flex flex-col items-center w-full mt-4 space-y-6"
              style={{ backgroundColor: color }}
            >
              {/* Time Inputs in a Grid */}

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
              {/* Background Upload */}
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

              {/* Color Picker */}
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

              {/* Reset Button */}
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
