import { useState, useEffect } from 'react';

const useHeaderChanges = (
  color,
  setColor,
  setPomoInput,
  setLongInput,
  setShortInput,
  setBackgroundPicture,
  onMenuClose
) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');
    const popContent = document.querySelector('.popContent');
    body.style.backgroundColor = color || '#666EE6';
    if (body && popContent) {
      popContent.style.backgroundColor = color || '#666EE6';
    }
  }, [color]);

  const toggleMenu = () => {
    const newMenuOpen = !menuOpen;

    if (!newMenuOpen && onMenuClose) {
      onMenuClose(); // Call the callback when menu is closing
    }

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

  const handleTimeChange = (e, type) => {
    const value = e.target.value;

    // Allow empty input for backspacing
    if (value === '') {
      if (type === 'pomo') setPomoInput('');
      if (type === 'short') setShortInput('');
      if (type === 'long') setLongInput('');
      return;
    }

    // Only update if it's a valid number between 1 and 60
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 60) {
      if (type === 'pomo') setPomoInput(num);
      if (type === 'short') setShortInput(num);
      if (type === 'long') setLongInput(num);
    }
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    console.log('color change:', e.target.value);
  };

  const handleReset = () => {
    setPomoInput(25);
    setLongInput(15);
    setShortInput(5);
    setBackgroundPicture(null);
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const backgroundURL = reader.result;
        setBackgroundPicture(backgroundURL);
        localStorage.setItem('backgroundPicture', backgroundURL);
        console.log('set background picture');
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    menuOpen,
    toggleMenu,
    handleTimeChange,
    handleColorChange,
    handleReset,
    handleBackgroundChange,
  };
};

export default useHeaderChanges;
