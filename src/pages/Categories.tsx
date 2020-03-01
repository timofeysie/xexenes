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

  function handleKeyDown(e: any, i: number) {
      console.log(e);
    if (e.key === 'Enter') {
      createCatgoryAtIndex(e, i);
    }
    if (e.key === 'Backspace' && categories[i].content === '') {
        e.preventDefault();
        return removeCatgoryAtIndex(i);
      }
  }

  function createCatgoryAtIndex(e: any, i: number) {
    const newCategories = [...categories];
    newCategories.splice(i + 1, 0, {
      content: '',
        name: '',
        label: '',
        language: 'en', 
        wd: '', 
        wdt: 'P31',
        isCompleted: false
    });
    setCategories(newCategories);
    setTimeout(() => {
        let element = document.forms[0].elements[i + 1] as HTMLElement;
        element.focus();
    }, 0);
  }

  function updateCategoryAtIndex(e: any, i: number) {
    const newCategories = [...categories];
    newCategories[i].content = e.target.value;
    setCategories(newCategories);
  }

  function removeCatgoryAtIndex(i: number) {
    if (i === 0 && categories.length === 1) return;
    setCategories(categories => categories.slice(0, i).concat(categories.slice(i + 1, categories.length)));
    setTimeout(() => {
      let element = document.forms[0].elements[i - 1] as HTMLElement;
      element.focus();
    }, 0);
  }

  function toggleCategoryCompleteAtIndex(index: number) {
    const temporaryCategories = [...categories];
    temporaryCategories[index].isCompleted = !temporaryCategories[index].isCompleted;
    setCategories(temporaryCategories);
  }

  return (
    <form className="category-list">
      <IonList>
        {categories.map((category, i) => (
          <IonItem>
            <IonCheckbox slot="start"
                onClick={() => toggleCategoryCompleteAtIndex(i)}></IonCheckbox>
            <input
               type="text"
               value={category.content}
               onKeyDown={e => handleKeyDown(e, i)}
               onChange={e => updateCategoryAtIndex(e, i)}
             />  
            <IonLabel>
              <h1>Create Idea!</h1>
              <IonNote>Run Idea by Brandy</IonNote>
            </IonLabel>
            <IonBadge color="success" slot="end">
              5 Days
            </IonBadge>
          </IonItem>
        ))}
      </IonList>
    </form>
  );
}

export default Categories;
