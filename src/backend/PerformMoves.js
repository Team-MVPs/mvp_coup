import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { incrementTurn } from './move_logic';


function updateCardDeck(cards, chosenKeys, oldCards){
	for(let i=0; i<cards.length;i++){
		if(!chosenKeys.has(cards[i][1])){
			oldCards.push(cards[i][0]);
		}
	}
	return oldCards;
}

export function generalIncome(roomName, playerID){
	firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
		coins: firebase.firestore.FieldValue.increment(1)
		});
} 

export function Coup(roomName, playerID){
	firestore.collection(root).doc(roomName).collection('players').doc(playerID).get().then((doc)=>{
		let currentCoins = doc.data().coins
		if (currentCoins < 7){
				alert("Not Enough Coins")
		} else {
			firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
				coins: currentCoins - 7
			})			
		}
	//add Coup logic
	})
}

export function foreignAid(roomName, playerID){
	firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
		coins: firebase.firestore.FieldValue.increment(2)
		})
}

export function Duke(roomName, playerID){
	firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
		coins: firebase.firestore.FieldValue.increment(3)
		})
}

export function Ambassador(roomName, playerID){
	const [cards, setCards] = useState([]);
	const [cardDeck, setCardDeck] = useState([]);
	const [isDisabled, setDisabled] = useState(false);

	let chosenCards = [];
	let chosenKeys = new Set();

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
			if(chosenCards.length === 0){
				chosenCards.push(card[0]);
				chosenKeys.add(card[1]);
				if (cards.length === 3){
					setDisabled(true);
					await firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
						cards: chosenCards
					});
					const updatedCards = updateCardDeck(cards, chosenKeys, cardDeck);
					await firestore.collection(root).doc(roomName).update({
						cards: updatedCards
					});
					await incrementTurn(roomName);
				};
			} else{
				if (!chosenKeys.has(card[1])){
					chosenCards.push(card[0]);
					chosenKeys.add(card[1]);
				} else{
					alert("You have already selected that card, pick another one");
					return;
				}
				setDisabled(true);
				await firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
					cards: chosenCards
				});
				const updatedCards = updateCardDeck(cards, chosenKeys, cardDeck);
				await firestore.collection(root).doc(roomName).update({
					cards: updatedCards
				});
				await incrementTurn(roomName);
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

