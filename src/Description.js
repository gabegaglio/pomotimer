import React from 'react';

const Description = ({ mode }) => {
  const descriptions = {
    pomodoro: "Time to focus! Let's get some work done.",
    shortBreak: "Take a short break. You've earned it!",
    longBreak: 'Time for a longer break. Recharge and come back stronger!',
  };

  return (
    <div className="desc text-white text-opacity-90 text-lg mt-4">
      {descriptions[mode] || "Let's get started!"}
    </div>
  );
};

export default Description;
