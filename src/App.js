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


  const [playerID, setPlayerID] = React.useState("");
  const [playerNames, setPlayerNames] = React.useState([]);
  const [playerIndex, setPlayerIndex] = React.useState(-1);
  const [isHost, setHost]  = React.useState(false);
  const [roomName, setRoomName] = React.useState("");

  function showPopup(title, content) {
    setPopupTitle(title);
    setPopupContent(content);
    setPopupShow(true);
  }
  console.log("Player Index: " + playerIndex);
  console.log(playerNames);
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <div align="center" style={{ position: "absolute", top: "0", bottom: "0", left: "0", right: "0", margin: "auto" }}>
              <LoginComponent setPlayerID={setPlayerID} setHost={setHost} setRoomName={setRoomName} />
            </div>
          </Route>
          <Route exact path="/start">
            <div align="center">
              <MainGameScreen playerID={playerID} isHost={isHost} roomName={roomName} playerIndex={playerIndex} playerNames = {playerNames}/>
            </div>
          </Route>
          <Route exact path="/GameStart">
            <div align="center">
              <GameStart playerID={playerID} isHost={isHost} roomName={roomName} setPlayerIndex={setPlayerIndex} setPlayerNames = {setPlayerNames}/>
            </div>
          </Route>
        </Switch>
        <Popup
          show={popupShow}
          title={popupTitle}
          content={popupContent}
          onHide={() => {
            console.log("Hiding Now");
            setPopupShow(false)
          }
          }
        />
      </div>
    </Router>
  );
}

export default App;
