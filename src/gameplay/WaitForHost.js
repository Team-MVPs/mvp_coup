import React from 'react';
import { firestore } from '../config/firebase';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';


function WaitForHost(props){
    const [leave, setLeave] = React.useState(false);

    const handleLeaveRoom = (event) =>{
      setLeave(true);
    }

    const [gameStarted, setStart] = React.useState(false);
    React.useEffect(() => {
        const subscribe = firestore.collection("root").doc(props.roomName).onSnapshot((doc) => {
          if(doc.data().startGame){
              console.log("Game started");
              setStart(true);
          }
        })
        return () => subscribe();
      }, []);
      
      if(leave){
        firestore.collection("root").doc(props.roomName).collection("players").doc(props.id).delete().then(()=>{
        console.log('A player left ' + props.roomName);
        })
        return (<Redirect to ="/" />);
      }


      if(gameStarted){
        return (<Redirect to="/start" />);
      }else{
          return(
            <div>
              <div style={{fontSize:"large", marginBottom: 30}}>
                <h3>Waiting on Host to Start the Game ...</h3>
              </div>
              <button className="btn btn-lg btn-primary" onClick = {handleLeaveRoom}>Leave Room</button>
            </div>
            )
      }
}

export default WaitForHost;