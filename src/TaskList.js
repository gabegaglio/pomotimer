import trashcan from './assets/trashcan.svg';
// TaskList takes tasks and displays them
const TaskList = ({tasks, deleteTask}) => {

    //BUGS:all tasks are deleted when clicked

    return (
      <div className="taskDisplayContainer">
        {tasks.map((task) => (
          <div className="taskDisplay" key={task.id}>
            <button onClick={() => deleteTask(task.id)}>
              <img id="trashcan" src={trashcan} alt="delete task" />
            </button>
            <h1>{task.name}</h1>
            {task.desc && <p>{task.desc}</p>}
          </div>
        ))}
      </div>
    );
};

export default TaskList;

