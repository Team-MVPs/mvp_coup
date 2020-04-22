import {firestore, root} from "../config/firebase";
import React, {useEffect, useState} from 'react';
import { incrementTurn } from './move_logic';


function Ambassador(roomName, playerID, setChangeTurn){
	const [cards, setCards] = useState([]);
	const [cardDeck, setCardDeck] = useState([]);
	const [isDisabled, setDisabled] = useState(false);

	let chosenCards = [];
	let chosenKeys = [];

	useEffect(()=>{
		const subscribe = firestore.collection(root).doc(roomName).get().then((room) => {
			let viewCards = [];
			viewCards.push([room.data().cards[0], 1], [room.data().cards[1], 2]);
			let allCards = room.data().cards;
			allCards.shift();
			allCards.shift();
			setCardDeck(allCards);

			firestore.collection(root).doc(roomName).collection("players").doc(playerID).get().then((player)=>{
				if (player.data().cards.length >1){
					viewCards.push([player.data().cards[0], 3], [player.data().cards[1], 4]);
				} else{
					viewCards.push([player.data().cards[0], 3]);
				}
				setCards(viewCards);
			});
		});
		return () => subscribe;
	}, []);

	const handleClick = (card) => {
		return async () => {
			console.log(card);
			if(chosenCards.length === 0){
				chosenCards.push(card[0]);
				chosenKeys.push(card[1]);
			} else{
				if (chosenKeys[0] !== card[1]){
					chosenCards.push(card[0]);
					chosenKeys.push(card[1]);
					

				} else{
					alert("You have already selected that card, pick another one")
				}
				if (chosenCards.length > 1){
					setDisabled(true);
					await firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
						cards: chosenCards
					});
					let oldCards = cardDeck;
					for(let i=0; i<cards.length;i++){
						let found = false;
						for(let j=0; j<chosenKeys.length;j++){
							if (chosenKeys[j] === cards[i][1]){
								found = true;
							}
						}
						if(!found){
							oldCards.push(cards[i][0]);
							console.log('called' + cards[i][0]);
						}
					}
					setCardDeck(oldCards);
					await firestore.collection(root).doc(roomName).update({
						cards: cardDeck
					});
					await incrementTurn(roomName);
				}
			}
					
		}
	}

	return (
		<div>
			<ul>
				{cards.map(card =>(
					<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
						<button type="button" className="btn btn-lg btn-primary" key = {card} style = {{width:"20em"}} 
						onClick = {handleClick(card)} disabled = {isDisabled}>{card[0]} </button>
					</div>))}
			</ul>

		</div>)

}



export default function OtherMoves(props){
	let move = props.move;
	let roomName = props.roomName;
	let playerID = props.playerID;
	const [changeTurn, setChangeTurn] = useState(false);

	if (move === 'Ambassador'){
		return (
			<div>
				{Ambassador(roomName, playerID, setChangeTurn)}
			</div>)
	}		
}
