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
import "./NewItem.css";

const NewItem: React.FC = () => {
  const { state, dispatch } = React.useContext(Store);
  const [todo, setTodo] = React.useState("");
  const [hasError, setErrors] = useState(false);
  type D = { [i: string]: any };
  const [pageSummary, setPageSummary] = useState<D>({});

  const putData = (e: any) => {
    e.preventDefault();
    fetchData();
  };
  const addItem = (e: any) => {
    e.preventDefault();
    return dispatch({
      type: "PUT_DATA",
      payload: pageSummary
    });
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
      .then(res => setPageSummary(res))
      .catch(err => setErrors(err));
  }

  /** Should we be fetching anything on load?  Probably not. */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * This can be used when we want to add the list to the categories page.
   * @param index
   */
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
            <IonCol>
              <IonRow>
                <IonCol>
                  <h3>Search results</h3>
                  <span>{JSON.stringify(pageSummary["extract"])}</span>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {hasError && <span>Error: {JSON.stringify(hasError)}</span>}
                </IonCol>
              </IonRow>
            </IonCol>
            <IonCol>
              <IonRow>
                <IonCol class="ion-padding">
                  <ul className="todo_list">
                    {state.todos.map((item: any, index: number) => (
                      <li
                        className="todo_item"
                        value={index}
                        key={index}
                        // onClick={e => doneTodo(e.target as HTMLElement)}
                      >
                        <div className="truncate">
                          {index + 1} {item.title}
                        </div>
                        <div className="truncate">{item.extract}</div>
                      </li>
                    ))}
                  </ul>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default NewItem;
