import React from "react";
import Todos from './types/categories'
const initialState: any = {
    todos: []
}

export const Store = React.createContext(initialState);

function reducer(state: Todos, action: any) {
    switch(action.type){

        case 'PUT_DATA':
            let tods: any = state.todos;
            tods.push(action.payload);
            return { ...state, todos: tods }
        
        case 'DONE_TODO':
            let index: any = action.payload;
            console.log(index);
            let tds = state.todos;
            tds.splice(index,1);
            return { ...state, todos: tds }
        
        default:
            return state;
    }
}

export function StoreProvider(props: any) {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const value = {state, dispatch}
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}