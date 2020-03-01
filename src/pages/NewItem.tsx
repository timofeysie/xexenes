import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonLabel
} from "@ionic/react";
import React from "react";
import { Store } from "../store/store";
import { useState } from "react";
import { useEffect } from "react";

const NewItem: React.FC = () => {
  const { state, dispatch } = React.useContext(Store);
  const [todo, setTodo] = React.useState("");
  const [hasError, setErrors] = useState(false);
  const [pageSummary, setPageSummary] = useState({});

  const putData = (e: any) => {
    e.preventDefault();
    // return dispatch({
    //   type: 'PUT_DATA',
    //   payload: todo
    // })
    console.log("using", todo);
    fetchData();
  };
  const addItem = (e: any) => {
    e.preventDefault();
    /** TODO:  Add page summary to the list.
     * The todo list needs to be converted into a list of items that can include
     * the page summary, the wikidata query and the Wikipedia list if available.
     * Current state:
     * const pageSummary: {}
Argument of type '{}' is not assignable to parameter of type 'SetStateAction<string>'.
  Type '{}' is not assignable to type '(prevState: string) => string'.
    Type '{}' provides no match for the signature '(prevState: string): string'.ts(2345)
     */
    //setTodo(pageSummary);
  };
  const updateTodo = (e: any) => {
    setTodo(e);
  };

  async function fetchData() {
    const base_url = "https://en.wikipedia.org/api/rest_v1/page/summary/";
    const subject = todo !== "" ? todo : "Basic_English";
    const res = await fetch(base_url + subject);
    res
      .json()
      .then(res => setPageSummary(res.extract))
      .catch(err => setErrors(err));
  }

  useEffect(() => {
    console.log("todo", todo);
    fetchData();
  }, []);
  const doneTodo = (index: any) => {
    console.log("index", index);
    return dispatch({
      type: "DONE_TODO",
      payload: index.value
    });
  };
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
            <input
              placeholder="Enter Input"
              id="todo_input"
              type="text"
              onChange={e => {
                updateTodo((e.target as HTMLInputElement).value);
              }}
            ></input>
            <button id="submit_button" type="submit" onClick={e => putData(e)}>
              Search
            </button>
            <button id="submit_button" type="submit" onClick={e => addItem(e)}>
              Add
            </button>
          </IonItem>
        </form>
        <IonGrid>
          <IonRow>
            <IonCol class="ion-padding">
              <h1>List</h1>
              <ul className="todo_list">
                {state.todos.map((item: any, index: number) => (
                  <li
                    className="todo_item"
                    value={index}
                    key={index}
                    onClick={e => doneTodo(e.target as HTMLElement)}
                  >
                    <h3>{item}</h3>
                  </li>
                ))}
              </ul>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <h3>Summary</h3>
              <span>{JSON.stringify(pageSummary)}</span>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <span>Has error: {JSON.stringify(hasError)}</span>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default NewItem;
