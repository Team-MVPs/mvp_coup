// @flow

import React from 'react';
import './App.css';
import {firestore} from './config/firebase';

import LoginComponent from "./LoginComponent";
import MainGameScreen from './gameplay/MainScreen.js';


function App() {
  firestore.collection('testing').doc("Aravind")
      .onSnapshot((snapshot) => {
        console.log(snapshot.data());
      }, (error) => console.error(error));

  return (
    <div align="center">
      <LoginComponent />
      <MainGameScreen />
    </div>
  );
}

export default App;
