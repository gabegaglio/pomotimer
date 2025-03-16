import React, { useState } from 'react';

const Timer = ({ time }) => {    //passes in time
    return (  
        <div className="my-10 w-100 height-auto mx flex justify-center items-center">
            <h1 className="text-white w-full text-7xl md:text-8xl  my-4 bg-white bg-opacity-0 rounded-lg p-5">
                {time}
            </h1>
        </div>
    );
}
 
export default Timer;