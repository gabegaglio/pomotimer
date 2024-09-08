import React from 'react';
const Pomobtn = ({pomoTime,longTime,shortTime, onClick }) => {
   
//creates the list of buttons
  const buttonList =[
      { name: 'pomodoro', time: pomoTime, id:1 },
      { name: 'short break', time: shortTime, id:2 },
      { name: 'long break', time: longTime, id:3 },
  ];

  //passes/iterates lists into DOM
  return (
    <div className="buttonContainer">
      {buttonList.map((btn) => (
        <button key={btn.id} className="btn" onClick={() => onClick(btn.time)}>
          {btn.name}
        </button>
      ))}
    </div>
  );
}

export default Pomobtn;
