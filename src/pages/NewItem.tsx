import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput, IonItem, IonLabel
} from '@ionic/react';
import React from 'react';
import { Store } from '../store/store';
import { useState } from 'react';
import { useEffect } from "react";

const NewItem: React.FC = () => {
    const { state, dispatch } = React.useContext(Store);
    const [ todo, setTodo ] = React.useState('');
    const [ hasError, setErrors] = useState(false);
    const [ pageSummary, setPageSummary] = useState({});
    //adding todo dispatch action
    const putData = (e: any) => {
        e.preventDefault()
        return dispatch({
          type: 'PUT_DATA',
          payload: todo
        })
    }
    const updateTodo = (e: any) => {
     console.log('updated',e);
    }
    async function fetchData() {
        const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Basic_English');
        res
          .json()
          .then(res => setPageSummary(res))
          .catch(err => setErrors(err));
    }
    
    useEffect(() => {
      console.log('todo',todo);
        fetchData();
    }, [todo]);
    //deleting todo dispatch action
    const doneTodo = (index: any) => {
        console.log('index', index);
        return dispatch({
          type: 'DONE_TODO',
          payload: index.value
        })
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>New Item</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <form id="form">
        <IonItem>
            <IonLabel>Floating Label</IonLabel>
            <IonInput placeholder="Enter Input" 
                id="todo_input" 
                type="text"       
                onChange={(e)=> updateTodo(((e.target as HTMLInputElement).value))}></IonInput>
            <button
                id="submit_button" 
                type="submit" 
                onClick={(e) => putData(e)}>Add</button>
            {/* Causes a page refresh */}
            {/* <IonButton 
                id="submit_button" 
                type="submit" 
                onClick={(e) => putData(e)}>Add</IonButton> */}
        </IonItem>
      </form>
      <h1>List</h1>
      <ul className="todo_list">
        {state.todos.map((item: any,index: number)=>(
            <li className="todo_item" 
                value={index} 
                key={index}
                onClick={(e) => doneTodo(e.target as HTMLElement)}>
                <h3>{item}</h3>
            </li>
        ))}
      </ul>
      <div>
        <span>{JSON.stringify(pageSummary)}</span>
        <hr />
        <span>Has error: {JSON.stringify(hasError)}</span>
      </div>
      </IonContent>
    </IonPage>
  );
};
export default NewItem;
