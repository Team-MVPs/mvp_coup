// @flow
import React from 'react';
import Character from '../characters/Character.js';
import OtherPlayerInfo from '../components/OtherPlayerInfoComponent.js';
import {firestore} from '../config/firebase';
import {playerStateCallback} from '../backend/game_logic.js'


/*const all_chars = ["Duke", "Assassin", "Contessa", "Captain", "Ambassador"];

const chars = all_chars.map((name, inx) => (
    <Character name={name} key={inx} show_card={true}/>
));*/

var root = "root";

function UserDetails(props) {
	  const [cards,setCards] = React.useState([]);
	  		
	  		React.useEffect(()=>{
	  		const unsubscribe = firestore.collection(root).doc(props.roomName).collection("players").doc(props.playerID).onSnapshot((doc)=>{
	  			console.log(doc.data().cards)
	  			console.log("data");
	  			console.log(doc.data());
	  			setCards(doc.data().cards)
	  		});
	  		return () => unsubscribe;
	  	}, [])

  



    return(
    	<div align = "center">
    		<h3>Player Information</h3>
    		<div align = "left" style ={{border: "1px solid", height:160}}>
    			<h4>Your Cards:</h4>
    			<br></br>
    			Card1:{cards[0]}
    			<br></br>
    			Card2: {cards[1]}
    		</div>
    		<div align = "left" style ={{border:"1px solid"}}>
    			<h4>Other Player Information</h4>
    			<OtherPlayerInfo/>
    		</div>
    		
    	</div>)
}

export default UserDetails;