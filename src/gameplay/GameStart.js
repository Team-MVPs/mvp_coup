import React from 'react';
import {firestore} from '../config/firebase';
import { Modal, Button } from 'react-bootstrap';

var roomName = 'Preet Testing';

function _newPlayers(update_current_players){
  firestore.collection(roomName).onSnapshot((snapshot)=>{
    let newPlayers = [];
    snapshot.docs.forEach((doc)=>{
      let playerName = doc.data().name;
      newPlayers.push(playerName);
    });
    update_current_players(newPlayers);
  });
}

function GameStart(props) {
  _newPlayers(props.updatePlayers);
  const newPlayers = props.newPlayers;
  return (
    <ol>
      {newPlayers.map(name => (
        <li key={name}>{name} has joined the lobby</li>
      ))}
    </ol>
  );
}

export default GameStart;