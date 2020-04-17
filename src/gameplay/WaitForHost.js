import React from 'react';
import { firestore, root } from '../config/firebase';
import { Redirect } from 'react-router-dom';

function WaitForHost(props) {
  const [leave, setLeave] = React.useState(false);

  const handleLeaveRoom = (event) => {
    setLeave(true);
  };

  const [gameStarted, setStart] = React.useState(false);

  React.useEffect(() => {
    const subscribe = firestore.collection(root).doc(props.roomName).onSnapshot((doc) => {
      if (doc.data().startGame) {
        console.log("Game started");
        setStart(true);
      }
    });
    return () => subscribe();
  }, []);

  if (leave) {
    firestore.collection(root).doc(props.roomName).collection("players").doc(props.id).delete().then(() => {
      console.log('A player left ' + props.roomName);
    });
    return (<Redirect to="/" />);
  }

  if (gameStarted) {
    let i = 0;
    for(i = 0; i < props.playerArray.length; i++){
      if(props.playerArray[i] === props.id) break;
    }
    console.log("Setting player index" + i);
    props.setPlayerNames(props.playerNames);
    props.setPlayerIndex(i);
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
