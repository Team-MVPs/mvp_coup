// @flow

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import './App.css';

import LoginComponent from "./components/LoginComponent";
import MainGameScreen from './gameplay/MainScreen.js';
import Popup from "./components/PopupComponent";
import GameStart from './gameplay/GameStart.js'


function App() {
  const [popupShow, setPopupShow] = React.useState(false);
  const [popupTitle, setPopupTitle] = React.useState("Sample Title");
  const [popupContent, setPopupContent] = React.useState("Sample Content");


  const [playerID, setPlayerID] = React.useState(-1);


  function showPopup(title, content){
    setPopupTitle(title);
    setPopupContent(content);
    setPopupShow(true);
  }
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <div align="center">
              <LoginComponent setPlayerID={setPlayerID}/>
            </div>
          </Route>
          <Route exact path="/start">
            <div align="center">
              <MainGameScreen popupCallback={showPopup} />
            </div>
          </Route>
          <Route exact path="/GameStart">
            <div align="center">
              <GameStart playerID={playerID}/>
            </div>
          </Route>
        </Switch>
        <Popup
          show={popupShow}
          title={popupTitle}
          content={popupContent}
          onHide={() => {
            console.log("Hiding Now");
            setPopupShow(false)}
          }
        />
      </div>
    </Router>
  );
}

export default App;
