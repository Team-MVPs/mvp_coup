// @flow

import React from 'react';
import './App.css';
import LoginComponent from "./LoginComponent";
import MainGameScreen from './gameplay/MainScreen.js';


function App() {
  return (
    <div align="center">
      <LoginComponent />
      <MainGameScreen />
    </div>
  );
}

export default App;
