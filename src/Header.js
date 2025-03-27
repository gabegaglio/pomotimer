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
  updatePreferences,
}) => {
  // Keep local state for the inputs while menu is open
  const [localPomo, setLocalPomo] = useState(pomoInput);
  const [localShort, setLocalShort] = useState(shortInput);
  const [localLong, setLocalLong] = useState(longInput);
  const [localColor, setLocalColor] = useState(color);
  const [localBackground, setLocalBackground] = useState(backgroundPicture);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Handle menu toggle and save changes
  const toggleMenu = () => {
    const newMenuOpen = !menuOpen;
    console.log('Menu state changing to:', newMenuOpen ? 'open' : 'closed');
    console.log('Is logged in:', isLoggedIn);

    if (!newMenuOpen) {
      console.log('Menu closing, current values:', {
        localPomo,
        pomoInput,
        localShort,
        shortInput,
        localLong,
        longInput,
        localColor,
        color,
        localBackground,
        backgroundPicture,
      });

      // Save changes first
      if (isLoggedIn) {
        // Save only changed timer settings
        if (localPomo !== pomoInput) {
          console.log('Pomodoro time changed, saving to Firebase:', {
            pomodoro: localPomo,
          });
          onSaveSettings({
            pomodoro: localPomo,
          });
        }

        if (localShort !== shortInput) {
          console.log('Short break time changed, saving to Firebase:', {
            shortBreak: localShort,
          });
          onSaveSettings({
            shortBreak: localShort,
          });
        }

        if (localLong !== longInput) {
          console.log('Long break time changed, saving to Firebase:', {
            longBreak: localLong,
          });
          onSaveSettings({
            longBreak: localLong,
          });
        }

        if (localColor !== color || localBackground !== backgroundPicture) {
          console.log('Preferences changed, saving to Firebase:', {
            color: localColor,
            backgroundPicture: localBackground,
          });
          updatePreferences({
            color: localColor,
            backgroundPicture: localBackground,
          });
        }
      } else {
        // Save to localStorage if guest user
        console.log('Saving settings to localStorage for guest user');
        localStorage.setItem('pomoInput', localPomo);
        localStorage.setItem('shortInput', localShort);
        localStorage.setItem('longInput', localLong);
        localStorage.setItem('color', localColor);
        if (localBackground) {
          localStorage.setItem('backgroundPicture', localBackground);
        } else {
          localStorage.removeItem('backgroundPicture');
        }
      }

      // Then update parent state
      setPomoInput(localPomo);
      setShortInput(localShort);
      setLongInput(localLong);
      setColor(localColor);
      setBackgroundPicture(localBackground);
    } else {
      // Menu is opening
      // Sync local state with current values
      setLocalPomo(pomoInput);
      setLocalShort(shortInput);
      setLocalLong(longInput);
      setLocalColor(color);
      setLocalBackground(backgroundPicture);
    }

    // Update menu state and apply visual effects
    setMenuOpen(newMenuOpen);

    const contentWrap = document.querySelector('.contentContainer');
    const taskContainer = document.querySelector('.taskContainer');
    const desc = document.querySelector('.desc');
    const logBtn = document.querySelector('.logBtn');
    const settingBtn = document.querySelector('.menuDiv');
    const taskWrap = document.querySelector('.taskWrap');

    if (contentWrap && taskWrap && desc) {
      const blurEffect = newMenuOpen ? 'blur(5px)' : 'none';
      contentWrap.style.filter = blurEffect;
      desc.style.filter = blurEffect;
      taskWrap.style.filter = blurEffect;
      logBtn.style.display = blurEffect === 'blur(5px)' ? 'none' : 'block';
      settingBtn.style.display = blurEffect === 'blur(5px)' ? 'none' : 'flex';
      taskContainer.style.filter = blurEffect;
      taskWrap.style.filter = blurEffect;
    }
  };

  // Handle time changes
  const handleTimeChange = (e, type) => {
    const value = e.target.value;
    console.log('Time change:', { type, value });

    if (value === '') {
      if (type === 'pomo') setLocalPomo('');
      if (type === 'short') setLocalShort('');
      if (type === 'long') setLocalLong('');
      return;
    }

    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 60) {
      if (type === 'pomo') setLocalPomo(num);
      if (type === 'short') setLocalShort(num);
      if (type === 'long') setLocalLong(num);
    }
  };

  // Handle color changes
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    console.log('Color change:', newColor);
    setLocalColor(newColor);
  };

  // Handle background changes
  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const backgroundURL = reader.result;
        console.log('Setting new background');
        setLocalBackground(backgroundURL);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle reset
  const handleReset = () => {
    const defaultSettings = {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
    };
    const defaultPreferences = {
      color: '#368CE7',
      backgroundPicture: null,
    };

    // Update local state
    setLocalPomo(defaultSettings.pomodoro);
    setLocalShort(defaultSettings.shortBreak);
    setLocalLong(defaultSettings.longBreak);
    setLocalColor(defaultPreferences.color);
    setLocalBackground(defaultPreferences.backgroundPicture);

    // Update parent state
    setPomoInput(defaultSettings.pomodoro);
    setShortInput(defaultSettings.shortBreak);
    setLongInput(defaultSettings.longBreak);
    setColor(defaultPreferences.color);
    setBackgroundPicture(defaultPreferences.backgroundPicture);

    if (isLoggedIn) {
      // Save to Firebase if logged in
      onSaveSettings(defaultSettings);
      updatePreferences(defaultPreferences);
    } else {
      // Save to localStorage if guest user
      console.log('Saving default settings to localStorage for guest user');
      localStorage.setItem('pomoInput', defaultSettings.pomodoro);
      localStorage.setItem('shortInput', defaultSettings.shortBreak);
      localStorage.setItem('longInput', defaultSettings.longBreak);
      localStorage.setItem('color', defaultPreferences.color);
      localStorage.removeItem('backgroundPicture');
    }
  }; // end of handleReset

  // handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }; // end of handleSignOut

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
            style={{ backgroundColor: localColor }}
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
              style={{ backgroundColor: localColor }}
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
                  value={localColor}
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
