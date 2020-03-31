import React from "react";
import { Store } from "../../store/store";
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
        {state.categories.map((item: any, index: number) => (
          <li className="todo_item" value={index} key={index}>
            <IonCard>
              <IonCardHeader>
                {item.title && (
                  <IonCardTitle>
                    {item.title}{" "}
                    <span className="truncate h5-font ion-text-right">{item.description}</span>
                  </IonCardTitle>
                )}
                {item.label && (
                  <IonCardTitle>
                    {item.label}{" "}
                    <span className="truncate h5-font ion-text-right">{item.description}</span>
                  </IonCardTitle>
                )}
              </IonCardHeader>
              <IonCardContent>
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
