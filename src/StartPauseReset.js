import React from 'react';

const StartPauseReset = ({ onStart, onPause, onReset }) => {
  const buttonList = [
    { name: 'start', id: 'start', function: onStart },
    { name: 'pause', id: 'pause', function: onPause },
    { name: 'reset', id: 'reset', function: onReset },
  ];

  return (
    <div className="grid grid-cols-3 gap-10 mb-10 place-items-center width-80">
      {buttonList.map((btn) => (
        <button
          key={btn.id}
          className="w-full sm:text-2xl md:text-3xl whitespace-nowrap px-4 py-3 md:px-12 md:py-6 md:gap-10 text-white shadow-sm bg-white bg-opacity-20 backdrop-blur-md rounded-lg hover:bg-opacity-5 hover:scale-105 transition duration-100 ease-in-out cursor-pointer flex items-center justify-center"
          onClick={btn.function}
        >
          {btn.name}
        </button>
      ))}
    </div>
  );
};

export default StartPauseReset;
