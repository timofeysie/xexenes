import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput, IonItem, IonLabel
} from '@ionic/react';
import React from 'react';
import { Store } from '../store/store';

const NewItem: React.FC = () => {
    const { state, dispatch } = React.useContext(Store);
    const [ todo, setTodo ] = React.useState('');
    //adding todo dispatch action
    const putData = (e: any) => {
        e.preventDefault()
        return dispatch({
          type: 'PUT_DATA',
          payload: todo
        })
    }
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
            <input placeholder="Enter Input" 
                id="todo_input" 
                type="text"       
                onChange={(e)=> setTodo(e.target.value)}></input>
            {/* Causes an "Object is possibly 'null'" error on the event arg */}
            {/* <IonInput placeholder="Enter Input" 
                id="todo_input" 
                type="text"       
                onChange={(e)=> setTodo(e.target.value)}></IonInput> */}
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
      </IonContent>
    </IonPage>
  );
};
export default NewItem;
