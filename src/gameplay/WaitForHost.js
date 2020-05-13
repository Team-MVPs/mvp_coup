import React, { useContext } from 'react';
import { firestore, root } from '../config/firebase';
import { Redirect } from 'react-router-dom';
import { handleDBException } from "../backend/callbacks";
import { RoomContext } from '../contexts/RoomContext.js';

function WaitForHost(props) {
  const [leave, setLeave] = React.useState(false);
  const [gameStarted, setStart] = React.useState(false);

  const { roomName, setPlayerNames } = useContext(RoomContext);

  React.useEffect(() => {
    const subscribe = firestore.collection(root).doc(roomName).onSnapshot((doc) => {
      if (!doc.exists) {
        return handleDBException();
      }
      if (doc.data().startGame) {
        //console.log("Game started");
        setStart(true);
      }
    });
    return () => subscribe();
  }, []);
  
  const handleLeaveRoom = () => {
    setLeave(true);
  };

  if (leave) {
    firestore.collection(root).doc(roomName).collection("players").doc(props.id).delete().then(() => {
      //console.log('A player left ' + roomName);
    });
    return (<Redirect to="/" />);
  }

  if (gameStarted) {
    for(let i = 0; i < props.playerArray.length; i++){
      if (props.playerArray[i] === props.id) {
        //console.log("Setting player index" + i);
        setPlayerNames(props.playerNames);
        props.setPlayerIndex(i);
        break;
      }
    }
    return (<Redirect to="/start" />);
  } else {
    return (
      <div>
        <div style={{ fontSize: "large", marginBottom: 30 }}>
          <h3>Waiting on Host to Start the Game ...</h3>
        </div>
        <button className="btn btn-lg btn-primary" onClick={handleLeaveRoom}>Leave Room</button>
      </div>
    )
  }
}

export default WaitForHost;
