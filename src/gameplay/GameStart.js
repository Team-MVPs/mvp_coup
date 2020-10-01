import React, { useContext } from 'react';
import { firestore, root } from '../config/firebase';
import { Spinner } from 'react-bootstrap';
import { startGame } from '../backend/startup';
import { Redirect } from 'react-router-dom';
import WaitForHost from "./WaitForHost.js";
import { RoomContext } from '../contexts/RoomContext.js';

function GameStart(props) {
  const [players, setPlayers] = React.useState([]);
  const [playerIDs, setPlayerIDs] = React.useState([]);
  const [redirect, setRedirect] = React.useState(false);
  const [isDisabled, setDisabled] = React.useState(true);

  const { roomName, setPlayerNames } = useContext(RoomContext);
  
  const handleClick = () => {
    startGame(roomName).then(() => {
      setPlayerNames(players);
      let i = 0;
      for(let i = 0; i < playerIDs.length; i++){
        if(playerIDs[i] === props.playerID) {
          props.setPlayerIndex(i);
          break;
        }
      }
      setRedirect(true);
    })
  };

  React.useEffect(() => {
    const unsubscribe = firestore.collection(root).doc(roomName).collection("players").onSnapshot((snapshot) => {
      let newPlayers = [];
      let newIDs = [];
      snapshot.docs.forEach((doc) => {
        let playerName = doc.data().name;
        newPlayers.push(playerName);
        newIDs.push(doc.id);
      });
      setPlayers(newPlayers);
      setPlayerIDs(newIDs);
    });
    return () => unsubscribe();
  }, []);

  
  if (players.length>=2 && isDisabled){
    setDisabled(false);
  }else if(players.length<2 && !isDisabled){
    setDisabled(true);
  }

  if(redirect){
    return (<Redirect to="/start" />);
  }

  function WaitMsg() {
    return (
      <div>
        <div align="middle" style = {{paddingTop:"1em"}}>
          <Spinner animation="border" as="span"/>
          <span className="sr-only">Loading...</span>
        </div>
        <div className="col-xs-6" align="middle">
          <i>Waiting for 2 or more players to begin the game</i>
        </div>
      </div>
    );
  }

  function JoinGame(props) {
    if (props.isHost) {
      let waitingMsg = null;
      if (isDisabled) {
        waitingMsg = <WaitMsg />
      }
      return (
          <div style = {{paddingTop: "1em"}}>
            <button
              type="button" className="btn btn-lg btn-primary" onClick={handleClick} style={{ marginBottom: 10 }} disabled = {isDisabled}>
              Start Game!
            </button>
            {waitingMsg}
          </div>
        );
    } else {
      console.log(props.playerID);
      return (
        <WaitForHost id = {props.playerID} playerArray = {playerIDs} playerNames = {players} setPlayerIndex = {props.setPlayerIndex}/>
      );
    }
  }

  let noteMsg = "";
  if (players.length > 6 && players.length <= 10){
    noteMsg = "NOTE: Your room size is 6+ players, there will be 5 of each card type in the deck"
  }else if(players.length > 10){
    noteMsg = "NOTE: Your room size is 10+ players, there will be 6 of each card type in the deck"
  }

  return (
    <div>
	    <ol className="list-group list-group-flush" style = {{marginBottom: 50, marginTop: 20}}>
	      {players.map(name => (
	        <li className="list-group-item" key={name}>{name} is in the lobby</li>
	      ))}
	    </ol>
      <div align="center"> <h4>Current Room: {roomName}</h4> </div>
	    <JoinGame isHost={props.isHost} roomName={roomName} playerID = {props.playerID} setPlayerIndex = {props.setPlayerIndex}/>
      <div style ={{ paddingTop: "2em", fontWeight: 500}}>
        {noteMsg}
      </div>
    </div>
  );
}



export default GameStart;

