import React from 'react';
import {firestore} from '../config/firebase';
import { Modal, Button } from 'react-bootstrap';

var roomName = 'Preet Testing';
var newPlayers = ['A','B'];


function GameStart(props) {
  firestore.collection(roomName).onSnapshot((snapshot)=>{
  	//let newPlayers = [];
  	snapshot.docs.forEach((doc)=>{
  		let playerName = doc.data().name;
  		newPlayers.push(playerName);
  	});
  	console.log(newPlayers);
  })

  return (
    <ol>
      {newPlayers.map(name => (
        <li key={name}>{name} has joined the lobby</li>
      ))}
    </ol>
  );
}

export default GameStart;