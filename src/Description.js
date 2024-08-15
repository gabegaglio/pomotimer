const Description = () => {
  return (
    <div className="desc">
      <h1>How To Use Pomodoro</h1>
      <ol>
        <li>Select a task you want to work on.</li>
        <li>Start the timer for 25 minutes or of your choosing.</li>
        <li>
          Focus until the time runs out, be sure to avoid any distractions.
        </li>
        <li>When the timer runs out, take a short break for 5 minutes.</li>
        <li>After the break, restart the timer and repeat.</li>
        <li>
          After four Pomodoro cycles, take a long break of 15 minutes or more.
        </li>
      </ol>
      <h2>
        Made by <a target="_blank" href="https://github.com/gabegaglio">gabegaglio</a>
      </h2>
    </div>
  );
};

export default Description;
