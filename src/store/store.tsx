import React from "react";
import Categories from './types/categories'
const initialState: any = {
    categories: [
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
    ]
}

export const Store = React.createContext(initialState);

function reducer(state: Categories, action: any) {
    switch(action.type){

        case 'PUT_DATA':
            let categoriesList: any = state.categories;
            categoriesList.push(action.payload);
            return { ...state, categories: categoriesList }
        
        case 'OPEN_CATEGORY':
            let index: any = action.payload;
            console.log(index);
            let tds = state.categories;
            tds.splice(index,1);
            return { ...state, categories: tds }
        
        default:
            return state;
    }
}

export function StoreProvider(props: any) {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const value = {state, dispatch}
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}