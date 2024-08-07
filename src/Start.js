import React from 'react';

const Start = ({onStart, onPause, onReset}) => {
  return (
    <div className="startContainer">
      <button id='start' className='btn startBtn' onClick={onStart}>start</button>
      <button id='pause' className='btn pauseBtn' onClick={onPause}>pause</button>
      <button id='reset' className='btn resetBtn' onClick={onReset}>reset</button>
    </div>
  );
};

export default Start;
