import React, { useState } from 'react';
import './Categories.css';
import { IonList, IonItem, IonBadge } from '@ionic/react';
 
const Categories: React.FC = () => {
  // stock categories.  will be replaced with user generated ones
  const [categories] = useState([
    {
        content: 'fallacies',
        name: 'fallacies', 
        label: 'List of Fallacies', 
        language: 'en', 
        wd: 'Q186150', 
        wdt: 'P31',
        isCompleted: true 
    },
    {
        content: 'cognitive bias',
        name: 'cognitive_bias',
        label: 'Cognitive Bias',
        language: 'en',
        wd: 'Q1127759',
        wdt: 'P31',
        isCompleted: false
    }
  ]);

  return (
    <form className="category-list">
      <IonList>
        {categories.map((category, index) => (
        <IonItem key={index} routerLink="/details/{category.name}">
            <p>{category.content} - {index+category.wd}</p>
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
