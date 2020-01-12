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
    if (e.key === 'Backspace' && todos[i].content === '') {
        e.preventDefault();
        return removeTodoAtIndex(i);
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
        let element = document.forms[0].elements[i + 1] as HTMLElement;
        element.focus();
    }, 0);
  }

  function updateTodoAtIndex(e: any, i: number) {
    const newTodos = [...todos];
    newTodos[i].content = e.target.value;
    setTodos(newTodos);
  }

  function removeTodoAtIndex(i: number) {
    if (i === 0 && todos.length === 1) return;
    setTodos(todos => todos.slice(0, i).concat(todos.slice(i + 1, todos.length)));
    setTimeout(() => {
      let element = document.forms[0].elements[i - 1] as HTMLElement;
      element.focus();
    }, 0);
  }

  function toggleTodoCompleteAtIndex(index: number) {
    const temporaryTodos = [...todos];
    temporaryTodos[index].isCompleted = !temporaryTodos[index].isCompleted;
    setTodos(temporaryTodos);
  }

  return (
    <form className="todo-list">
      <ul>
        {todos.map((todo, i) => (
          <div className="todo">
            <div className={'checkbox'} 
                onClick={() => toggleTodoCompleteAtIndex(i)}>
                {todo.isCompleted && (
                    <span>&#x2714;</span>
                )}
            </div>
            <input
               type="text"
               value={todo.content}
               onKeyDown={e => handleKeyDown(e, i)}
               onChange={e => updateTodoAtIndex(e, i)}
             />
          </div>
        ))}
      </ul>
    </form>
  );
}

export default Categories;
