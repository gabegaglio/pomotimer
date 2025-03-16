import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useHeaderChanges = (
  color,
  setColor,
  setPomoInput,
  setLongInput,
  setShortInput,
  setBackgroundPicture
) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');
    const popContent = document.querySelector('.popContent');
    body.style.backgroundColor = color || '#666EE6';
    if (body && popContent) {
      popContent.style.backgroundColor = color || '#666EE6';
    }
  }, [color]);

  const toggleMenu = () => {
    const newMenuOpen = !menuOpen; // sets newMenu to opposite of if menu is open
    
    setMenuOpen(newMenuOpen);

    const contentWrap = document.querySelector('.contentContainer');
    const taskContainer = document.querySelector('.taskContainer');
    const desc = document.querySelector('.desc');
    const logBtn = document.querySelector('.logBtn');
    const settingBtn = document.querySelector('.menuDiv');
    const taskWrap = document.querySelector('.taskWrap');
    
    if (contentWrap && taskWrap && desc) { // check if elements exist then blur
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
    const newValue = e.target.value;

    if (newValue === "") {
      if (type === "pomo") setPomoInput("");
      if (type === "short") setShortInput("");
      if (type === "long") setLongInput("");
    } else {
      const num = parseInt(newValue, 10);
      if (!isNaN(num)) {
        if (type === "pomo") setPomoInput(num);
        if (type === "short") setShortInput(num);
        if (type === "long") setLongInput(num);
      }
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
    isLogged
  };
};

export default useHeaderChanges;
