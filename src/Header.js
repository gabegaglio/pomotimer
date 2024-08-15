import { useEffect, useState } from 'react';
import Menu from './Menu';

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
}) => {


  useEffect(() => {
    const body = document.querySelector('body');
    const popContent = document.querySelector('.popContent');
    body.style.backgroundColor = color || '#666EE6';
    if (body && popContent) {
     popContent.style.backgroundColor = color || '666EE6';
    }
  },[color]);

  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    const newMenuOpen = !menuOpen;
    setMenuOpen(newMenuOpen);
    
    const contentWrap = document.querySelector('.contentWrap');
    const body = document.querySelector('body');

    if (contentWrap) {
      contentWrap.style.filter = newMenuOpen ? 'blur(5px)' : 'none';
    }
 
    
  };
    

  const handlePomoChange = (e) => {
    setPomoInput(parseInt(e.target.value || 25));
    console.log("pomo input change:", pomoInput);
  };

  const handleShortChange = (e) => {
    setShortInput(parseInt(e.target.value || 5));
    console.log("short input change:", shortInput);
  };

  const handleLongChange = (e) => {
    setLongInput(parseInt(e.target.value || 15));
    console.log("long input change:", longInput);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    console.log("color change:", color);
};

  const handleReset = () => {
    setPomoInput(25);
    setLongInput(15);
    setShortInput(5);
    setBackgroundPicture(null);
  }

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file){
      const reader = new FileReader();
      reader.onload = () => {
        const backgroundURL = reader.result;
        setBackgroundPicture(backgroundURL);
        localStorage.setItem('backgroundPicture', backgroundURL);
        console.log("set background picture");
      };
      reader.readAsDataURL(file);
    }
  }


  return (
    <div className="headerContainer">
      <header className="webName">
        <h1>pomobud</h1>
      </header>

      <div className="menuContainer" onClick={toggleMenu}>
        <Menu />
      </div>
      {menuOpen && ( /* logical &&, if menuOpen is true opens up the menu */
        <div className='popMenu' style={{ backgroundColor: color }}>
          <div className='popContent'>
            <div className='closeButton' onClick={toggleMenu}>
              &times;
            </div>
              <p className="popHeader">Settings</p>
            <div className="wrap">

                <div className="inputContainer">
                    <div className="inputDiv">
                        <label htmlFor="pomoInput">Pomodoro</label>
                        <input
                        className='pomoInput'
                        type='number'
                        placeholder='25'
                        min='1'
                        max='60'
                        value={pomoInput}
                        onChange={handlePomoChange}
                        />
                      </div>
                
                    <div className="inputDiv">
                      <label htmlFor="shortInput">Short Break</label>
                      <input
                        className='shortInput'
                        type='number'
                        placeholder='5'
                        min='1'
                        max='60'
                        value={shortInput}
                        onChange={handleShortChange}
                      />
                    </div>

                    
                    <div className="inputDiv">
                      <label htmlFor="longInput">Long Break</label>
                      <input
                        className='longInput'
                        type='number'
                        placeholder='15'
                        min='1'
                        max='60'
                        value={longInput}
                        onChange={handleLongChange}
                      />
                    </div>

                    <div className="inputDiv">
                      <label htmlFor="colorInput">Background Color</label>
                      <input
                        className='colorInput'
                        type='color'
                        value={color}
                        onChange={handleColorChange}
                      />
                    </div>

                    <div className="inputDiv">
                      
                      <label htmlFor="pictureInput" className="fileInputLabel">Choose Background

                          <input    
                            className="fileInput"
                            type="file"
                            onChange={handleBackgroundChange}
                          />

                      </label>
                    </div>

                    <br></br>

                    <button className='reset' onClick={handleReset}>Reset</button>

                  </div>
              </div>
              

            </div>
          </div>
        )}
      </div>
    );
  };

  export default Header;
