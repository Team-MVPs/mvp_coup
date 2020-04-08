import React from 'react';
import {firestore} from '../config/firebase';
import { Modal, Button } from 'react-bootstrap';
import CountTesting from "../backend/countTesting.js";

var roomName = 'Preet Testing';

function GameStart(props) {
  const [isClicked, setClicked] = React.useState(false);
  const [joinGame, setJoin] = React.useState("Join Game!");
  const [count, setCount] = React.useState(0);
  const handleClick = (event) => {setClicked(true); setJoin("Accepted!"); setCount(count+1)}; 

  const [players, setPlayers] = React.useState([]);
  React.useEffect(() => {
    const subscribe = firestore.collection(roomName).onSnapshot((snapshot)=>{
  	let newPlayers = [];
  	snapshot.docs.forEach((doc)=>{
      let playerName = doc.data().name;
      newPlayers.push(playerName);
    });
    setPlayers(newPlayers);
  	console.log(players);
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
        type="button" className="btn btn-lg btn-primary" disabled = {isClicked} onClick = {handleClick} style ={{marginBottom:10}}>
        {joinGame}
      </button>
      <div>
        <CountTesting countVal = {count}/>
      </div>
	 
	</div>
  );
}

export default GameStart;

