import React from "react";
import { Store } from "../../../store/store";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from "@ionic/react";
import "./ItemList.css";

const ItemList = () => {
  const { state } = React.useContext(Store);
  return (
    <div>
      <ul className="todo_list">
        {state.todos.map((item: any, index: number) => (
          <li
            className="todo_item"
            value={index}
            key={index}
          >
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{item.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="truncate">{item.description}</div>
                <div className="truncate">{item.extract}</div>
              </IonCardContent>
            </IonCard>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
