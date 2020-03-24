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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from "@ionic/react";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./NewItem.css";

const Details: React.FC = () => {
  const [todo] = React.useState("");
  const [hasError, setErrors] = useState(false);
  type D = { [i: string]: any };
  const [pageSummary, setPageSummary] = useState<D>({});

  async function fetchData() {
    const base_url = "https://en.wikipedia.org/api/rest_v1/page/summary/";
    const subject = todo !== "" ? todo : "Basic_English";
    const res = await fetch(base_url + subject);
    res
      .json()
      .then(res => setPageSummary(res))
      .catch(err => setErrors(err));
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonRow>
                <IonCol size="auto">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{todo}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <h5>{pageSummary["description"]}</h5>
                      <span>{pageSummary["extract"]}</span>
                      {hasError && (
                        <span>Error: {JSON.stringify(hasError)}</span>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Details;
