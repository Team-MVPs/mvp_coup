import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap';


function Ambassador(roomName, playerID){
	const [cards, setCards] = useState([]);
	const [cardDeck, setCardDeck] = useState([]);

	useEffect(()=>{
		const subscribe = firestore.collection(root).doc(roomName).get().then(async (room)=>{
			let viewCards = [];
			viewCards.push(room.data().cards[0], room.data().cards[1]);
			let allCards = room.data().cards;
			allCards.shift();
			allCards.shift();
			setCardDeck(allCards);

			await firestore.collection(root).doc(roomName).collection("players").doc(playerID).get().then((player)=>{
				if (player.data().cards.length >1){
					viewCards.push(player.data().cards[0], player.data().cards[1]);
				} else{
					viewCards.push(player.data().cards[0]);
				}
			})
		//console.log(viewCards);
		setCards(viewCards);
		})
		return () => subscribe();
	}, []);

	const handleClick = (card) =>{
		console.log("pressed card");
	}

	return (
		<div>
			<ul>
				{cards.map(card =>(
					<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
						<button type="button" className="btn btn-lg btn-primary" key = {card} style = {{width:"20em"}} onClick = {handleClick(card)}>{card} </button>
					</div>))}
			</ul>
		</div>)

}



export default function OtherMoves(props){
	let move = props.move;
	let roomName = props.roomName;
	let playerID = props.playerID;

	if (move === 'Ambassador'){
		return (
			<div>
				{Ambassador(roomName, playerID)}
			</div>)
	}		
}