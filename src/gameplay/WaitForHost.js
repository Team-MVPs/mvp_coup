import React from 'react';
import { firestore } from '../config/firebase';
import { Redirect } from 'react-router-dom';

function WaitForHost(props){
    const [gameStarted, setStart] = React.useState(false);
    React.useEffect(() => {
        const unsubscribe = firestore.collection("root").doc(props.roomName).onSnapshot((doc) => {
          if(doc.data().startGame){
              console.log("Game started");
              setStart(true);
          }
        })
        return () => unsubscribe();
      }, []);
    
      if(gameStarted){
        return (<Redirect to="/start" />);
      }else{
          return(<div style={{fontSize:"large"}}>Waiting on Host to Start the Game ...</div>)
      }
}

export default WaitForHost;