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

  function handleKeyDown(e: any, i: number) {
    if (e.key === 'Enter') {
      createTodoAtIndex(e, i);
    }
  }

  function createTodoAtIndex(e: any, i: number) {
    const newTodos = [...todos];
    newTodos.splice(i + 1, 0, {
      content: '',
      isCompleted: false,
    });
    setTodos(newTodos);
    setTimeout(() => {
      //document.forms[0].elements[i + 1].focus();
    }, 0);
  }

  return (
    <form className="todo-list">
      <ul>
        {todos.map((todo, i) => (
          <div className="todo">
            <div className="checkbox" />
            <input
               type="text"
               value={todo.content}
               onKeyDown={e => handleKeyDown(e, i)}
             />
          </div>
        ))}
      </ul>
    </form>
  );
}

export default Categories;
