import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap';

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
	firestore.collection(root).doc(roomName).collection("players").doc(playerID).get().then((player)=>{
		let numofCards = player.data().cards.length;
		firestore.collection(root).doc(roomName).get().then((room)=>{
			let cardDeck = room.data().cards;
			let exchangeCard1 = cardDeck[0]
			let exchangeCard2 = cardDeck[1]
		})

	})
	return (
		<div>
			<Modal.Dialog>
			  <Modal.Header closeButton>
			    <Modal.Title>Modal title</Modal.Title>
			  </Modal.Header>

			  <Modal.Body>
			    <p>Modal body text goes here.</p>
			  </Modal.Body>

			  <Modal.Footer>
			    <Button variant="secondary">Close</Button>
			    <Button variant="primary">Save changes</Button>
			  </Modal.Footer>
			</Modal.Dialog>
		</div>)
}