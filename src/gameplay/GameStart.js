import React from 'react';
import { firestore, root } from '../config/firebase';
import { Button, Spinner } from 'react-bootstrap';
import CountTesting from "../backend/countTesting.js";
import { startGame } from '../backend/startup';
import { Redirect } from 'react-router-dom';
import WaitForHost from "./WaitForHost.js";

//var testRoom = "New Test";
function GameStart(props) {
  const [players, setPlayers] = React.useState([]);
  const [redirect, setRedirect] = React.useState(false);
  const [isDisabled, setDisabled] = React.useState(true);

  const handleClick = (event) => {
    startGame(props.roomName).then(() => {
      setRedirect(true);
    })
  };

  React.useEffect(() => {
    const unsubscribe = firestore.collection(root).doc(props.roomName).collection("players").onSnapshot((snapshot) => {
      let newPlayers = [];
      snapshot.docs.forEach((doc) => {
        let playerName = doc.data().name;
        newPlayers.push(playerName);
      });
      setPlayers(newPlayers);
    })
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

  function WaitMsg(props) {
    return (
      <div>
        <div align="middle">
          <Spinner animation="border" as="span"/>
          <span className="sr-only">Loading...</span>
        </div>
        <div class="col-xs-6" align="middle">
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
          <div>
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
        <WaitForHost roomName={props.roomName} id = {props.playerID} playerArray = {players}/>
      );
    }
  }

  return (
    <div>
	    <ol className="list-group list-group-flush" style = {{marginBottom: 50, marginTop: 20}}>
	      {players.map(name => (
	        <li className="list-group-item" key={name}>{name} is in the lobby</li>
	      ))}
	    </ol>
      <div align="center"> <h4>Current Room: {props.roomName}</h4> </div>
	    <JoinGame isHost={props.isHost} roomName={props.roomName} playerID = {props.playerID}/>
      {/* <div>
        <CountTesting id={props.playerID} accepted={accepted} />
      </div> */}
    </div>
  );
}



export default GameStart;

