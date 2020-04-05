// @flow

import React from 'react';
import './App.css';
import {firestore} from './config/firebase';
// import Duke from './character_cards.js';
import LoginComponent from "./LoginComponent";


function App() {
  firestore.collection('testing').doc("Aravind")
      .onSnapshot((snapshot) => {
        console.log(snapshot.data());
      }, (error) => console.error(error));

  return (
      <LoginComponent />
  );
}

export default App;
