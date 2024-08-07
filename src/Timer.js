import React, { useState } from 'react';

const Timer = ({ time }) => {    //passes in time
    return (  
        <div className="timerContainer">
            <header className="timer">
                {time}
            </header>
        </div>
    );
}
 
export default Timer;