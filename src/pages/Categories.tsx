import React, { useState } from 'react';
import './Categories.css';
import { IonList, IonItem, IonCheckbox } from '@ionic/react';
import { IonLabel, IonNote, IonBadge } from '@ionic/react';

function Categories() {
  const [categories, setCategories] = useState([
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

  function selectCategory(i: number) {
    const newCategories = [...categories];
    //newCategories[i].content = e.target.value;
    //setCategories(newCategories);
  }

  return (
    <form className="category-list">
      <IonList>
        {categories.map((category, index) => (
        <IonItem key="{index}" onClick={() => selectCategory(index)}>
            <p>{category.content}</p>
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
