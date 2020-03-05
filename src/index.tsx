import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StoreProvider } from "./store/store";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgtcYbls-vXOipP9bbfY5YKi-gOcaekBA",
  authDomain: "quipu-a1093.firebaseapp.com",
  databaseURL: "https://quipu-a1093.firebaseio.com",
  projectId: "quipu-a1093",
  storageBucket: "quipu-a1093.appspot.com",
  messagingSenderId: "638620214720",
  appId: "1:638620214720:web:c3806f6c24c4d372809425"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<StoreProvider><App /></StoreProvider>, document.getElementById('root'));

serviceWorker.register();
