import React from 'react';
import {firestore} from '../config/firebase';
import { Modal, Button } from 'react-bootstrap';
import CountTesting from "../backend/countTesting.js";

var roomName = 'Preet Testing';

function GameStart(props) {
  const [isClicked, setClicked] = React.useState(false);
  const [joinGame, setJoin] = React.useState("Join Game!");
  const [accepted, setAccept] = React.useState(false);
//  const [currentState, setCurrentState] = React.useState(" has joined the lobby");
  const handleClick = (event) => {setClicked(true); setJoin("Accepted!"); setAccept(true)}; 

  const [players, setPlayers] = React.useState([]);
  React.useEffect(() => {
    const subscribe = firestore.collection(roomName).onSnapshot((snapshot)=>{
  	let newPlayers = [];
  	snapshot.docs.forEach((doc)=>{
      let playerName = doc.data().name;
      newPlayers.push(playerName);
    });
      setPlayers(newPlayers);

  })
  return () => subscribe();
},[]);

  return (
  	<div>
	    <ol className="list-group list-group-flush" style = {{marginBottom: 50, marginTop: 20}}>
	      {players.map(name => (
	        <li className="list-group-item" key={name}>{name} has joined the lobby</li>
	      ))}
	    </ol>
	    <button 
        type="button" className="btn btn-lg btn-primary" disabled = {isClicked} onClick = {handleClick} style ={{marginBottom:50}}>
        {joinGame}
      </button>
      <div>
         <CountTesting id = {props.playerID} accepted = {accepted}/>
      </div>
	 
	</div>
  );
}



export default GameStart;

