import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';
import { Modal, Button, Col, Row, Container } from 'react-bootstrap';
import { incrementTurn } from './move_logic';
import PlayCard from '../components/PlayCard.js';
import '../styles/Card.css';

function updateCardDeck(cards, chosenKeys, oldCards){
	for(let i=0; i<cards.length;i++){
		if(!chosenKeys.has(cards[i][1])){
			oldCards.push(cards[i][0]);
		}
	}
	return oldCards;
}

export async function hasCard(roomName, playerID, move){
	let result = false;
	await firestore.collection(root).doc(roomName).collection("players").doc(playerID).get().then((player)=>{
		let cardSet = new Set();
		player.data().cards.forEach(card => cardSet.add(card));
		console.log(cardSet);
		console.log("Checking: " + move);
		switch (move) {
			case "foreign_aid":
			case "duke":
				result = cardSet.has("Duke");
				break;
			case "exchange_cards":
				result = cardSet.has("Ambassador");
				break;
			case "assassinate":
				result = cardSet.has("Assassin");
				break;
			case "steal":
				result = cardSet.has("Captain");
				break;
			default:
				alert("Invalid move type");
				break;
		}
	});
	console.log("Result: " + result);
	return result;
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
	const [cardsToChoose, setCardsToChoose] = useState(0);
	const [chosenKeys, setChosenKeys] = useState(new Set());
	//let chosenKeys = new Set();

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
					setCardsToChoose(2);
					viewCards.push([player.data().cards[0], 3], [player.data().cards[1], 4]);
				} else{
					setCardsToChoose(1);
					viewCards.push([player.data().cards[0], 3]);
				}
				setCards(viewCards);
			});
		});
		return () => subscribe;
	}, []);

	const handleClick = () => {
		return async () => {
			setDisabled(true);
			let chosenCards = [];
			cards.forEach(card => {
				if(chosenKeys.has(card[1])) chosenCards.push(card[0]);
			});

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

	const selectCard = (card) => {
		return async() =>{
			if(chosenKeys.has(card[1])){
				chosenKeys.delete(card[1]);
			}else{
				if(chosenKeys.size === cardsToChoose){
					const iterator1 = chosenKeys.values();
					chosenKeys.delete(iterator1.next().value);
				}
				chosenKeys.add(card[1]);
			}
			setChosenKeys(new Set(chosenKeys));
		}
	}

	return (
		<div>
		<h3 style={{paddingBottom: "5%"}}>Choose {cardsToChoose}</h3>
		<Container style={{paddingBottom: "5%"}}>
			<Row>
				{cards.map(card =>{
					return(
					<Col>
						<div className={chosenKeys.has(card[1]) ? "Selected" : "Highlight"} onClick = {selectCard(card)} style={{display:"inline-block"}}>
							<PlayCard cardName={card[0]} />
						</div>
					</Col>
					);
					})}
			</Row>
		</Container>
		<button type="button" className="btn btn-lg btn-success" style = {{width:"20em"}} 
					 	disabled = {isDisabled || cardsToChoose!==chosenKeys.size} 	onClick = {handleClick()}>Confirm</button>
		</div>
		)
}

