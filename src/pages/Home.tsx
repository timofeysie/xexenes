import { IonContent, IonHeader } from '@ionic/react';
import { IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonList, IonItem, IonCheckbox } from '@ionic/react';
import { IonLabel, IonNote, IonBadge } from '@ionic/react';
import { IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { getPlatforms } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { add } from 'ionicons/icons';
import React from 'react';
import Categories from './Categories';

const Home: React.FC<RouteComponentProps> = (props) => {
  // console.log('Platforms',getPlatforms()); // "tablet", "desktop"
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Categories />
        <IonList>
          <IonItem>
            <IonCheckbox slot="start" />
            <IonLabel>
              <h1>Create Idea!</h1>
              <IonNote>Run Idea by Brandy</IonNote>
            </IonLabel>
            <IonBadge color="success" slot="end">
              5 Days
            </IonBadge>
          </IonItem>
        </IonList>
        <IonFab vertical="bottom"
          horizontal="end"
          slot="fixed">
          <IonFabButton onClick={() => props.history.push('/new')}>
           <IonIcon icon={add} />
         </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
