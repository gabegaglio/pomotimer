import React from 'react';
import { Button } from './components/ui/button';
const Pomobtn = ({pomoTime,longTime,shortTime, onClick }) => {
   
//creates the list of buttons
  const buttonList =[
      { name: 'pomodoro', time: pomoTime, id:1 },
      { name: 'short break', time: shortTime, id:2 },
      { name: 'long break', time: longTime, id:3 },
  ];

  //passes/iterates lists into DOM
  return (
    <div className="grid grid-cols-3 gap-5 place-items-center w-fit">
      {buttonList.map((btn) => (
        <button
          key={btn.id}
          className="w-full sm:text-2xl md:text-3xl whitespace-nowrap px-4 py-3 md:px-12 md:py-6 md:gap-10 text-white shadow-sm bg-white bg-opacity-20 rounded-lg hover:bg-opacity-5 hover:scale-105 transition duration-100 ease-in-out cursor-pointer flex items-center justify-center"
          onClick={() => onClick(btn.time)}
        >
          {btn.name}
        </button>
      ))}
    </div>
  );
}

export default Pomobtn;
