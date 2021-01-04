import React, { useEffect, useState } from 'react';
import './App.css';
import { uuid } from 'uuidv4';
import { FiTrash } from 'react-icons/fi'

interface Task {
  id: string;
  description: string;
  done: boolean;
  createdAt: string;
}

function App() {
  const [taskDraft, setTaskDraft] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (localStorage) {
      const taksString = localStorage.getItem('tasks');
      if (taksString) {
        setTasks(JSON.parse(taksString));
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage) {
      const tasksString = JSON.stringify(tasks);
      localStorage.setItem('tasks', tasksString);
    }
  }, [tasks]);

  function handleAddTask() {
    setErrorMessage('');

    if (!taskDraft.trim()) {
      setErrorMessage('Fill the task description.');
      return;
    }

    let newTask : Task = {
      id: uuid(),
      description: taskDraft,
      done: false,
      createdAt: new Date().toLocaleString()
    };

    setTasks([...tasks, newTask]);
    setTaskDraft('');
  }

  function handleRemoveTask(id: string) {
    setTasks(tasks.filter(f => f.id !== id));
  }

  function handleMarkTaskAdDone(id: string) {
    let newTasks = tasks.map(task => {
      if (task.id !== id) {
        return task;
      }

      return {
        ...task,
        done: !task.done
      };
    });

    setTasks(newTasks);
  }

  function handleClearTaskList() {
    setTasks([]);
  }

  return (
    <div className="container">
      <h1 className="title">REACT TODO APP</h1>
      <form onSubmit={e => { e.preventDefault(); handleAddTask() }}>
        <div className="new-task-box">
            <input
              type="text"
              value={taskDraft}
              onChange={e => setTaskDraft(e.target.value)}
            ></input>
            <button type="button" onClick={handleAddTask}>ADD</button>
          
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>

      <div className="tasks-box">
        {tasks.map(task => {
          return <div className="task-box">
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={e => handleMarkTaskAdDone(task.id)}
                />
                <p className={task.done ? 'done-task' : ''}>{task.description}</p>
              </label>
            </div>
            {/* <p>{task.createdAt}</p> */}
            <button
              className="remove-button"
              type="button"
              onClick={() => handleRemoveTask(task.id)}
            >
              <FiTrash />
            </button>
          </div>
        })}

        <div className="clear-button-box">
          <button
            type="button"
            disabled={tasks.length === 0}
            onClick={handleClearTaskList}
          >Clear</button>
        </div>
      </div>
    </div>
  );
}

export default App;
