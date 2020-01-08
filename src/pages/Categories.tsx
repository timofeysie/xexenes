import React, { useState } from 'react';
import logo from './logo.svg';
import './Categories.css';

function Categories() {
  const [todos, setTodos] = useState([
    {
      content: 'Pickup dry cleaning',
      isCompleted: true,
    },
    {
      content: 'Get haircut',
      isCompleted: false,
    },
    {
      content: 'Build a todo app in React',
      isCompleted: false,
    }
  ]);

  return (
    <form className="todo-list">
      <ul>
        {todos.map((todo, i) => (
          <div className="todo">
            <div className="checkbox" />
            <input type="text" value={todo.content} />
          </div>
        ))}
      </ul>
    </form>
  );
}

export default App;
