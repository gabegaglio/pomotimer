import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState('');
  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, 0);
    const merid = hours === 12 ? 'pm' : hours < 12 ? 'am' : 'pm';
    hours = hours % 12 || 12;
    hours = hours.toString();
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const time = `${hours}:${minutes} ${merid}`;
    setTime(time);
  };

  useEffect(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mb-10 flex justify-center items-center bg-white bg-opacity-20">
      <header className="text-white text-7xl md:text-8xl my-4">{time}</header>
    </div>
  );
};

export default Clock;
