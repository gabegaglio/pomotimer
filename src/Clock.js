import React, { useState, useEffect } from 'react';


const Clock = () => {
    const [time, setTime] = useState('');
    const updateClock = () => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2,0);
    const merid = hours === 12 ? "pm" : (hours < 12 ? "am" : "pm");
    hours = hours % 12 || 12;
    hours = hours.toString();
    const minutes = now.getMinutes().toString().padStart(2,0);
    const time = `${hours}:${minutes} ${merid}`;
    setTime(time)
    };

    //updateClock runs every second
    useEffect(() => {
        updateClock();
        const interval = setInterval(updateClock,1000);
        return () => clearInterval(interval); 
    }, []); //[] is dependency array, only runs once on render of DOM
            //value can be put in there so on change of it, it runs again


    return (  
        <div className="clockContainer">
            <header className="clock">{time}</header>
        </div>
        );
    };

export default Clock;