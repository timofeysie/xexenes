import React, { useContext} from 'react';
import './Categories.css';
import { IonList, IonItem, IonBadge } from '@ionic/react';
import { Link as RouterLink } from 'react-router-dom';
import { Store } from "../store/store";
 
const Categories: React.FC = () => {
  const { state } = useContext(Store);
  return (
    <form className="category-list">
      <IonList>
        {state.categories.map((category: any, index: any) => (
        <IonItem key={index}>
            <RouterLink to={'/details/'+category.name}>{category.content}</RouterLink>
            <IonBadge color="success" slot="end">
              {category.wd}
            </IonBadge>
          </IonItem>
        ))}
      </IonList>
    </form>
  );
}

export default Categories;
