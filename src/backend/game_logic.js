import { firestore, root } from '../config/firebase';
import React from 'react';

export const all_chars = ["Duke", "Assassin", "Contessa", "Captain", "Ambassador"];

const num_of_each_card = 3;

export async function distributeCards(roomName) {
	// helper functions
	function shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	let cards = [];
	all_chars.forEach(char => {
		for (let i = 0; i < num_of_each_card; ++i) {
			cards.push(char);
		}
	});
	shuffle(cards);
	
	const roomRef = firestore.collection(root).doc(roomName);
	const playerCollection = roomRef.collection("players");
	await playerCollection.get().then((players) => {
		// give each player 2 cards and 2 coins
		players.forEach(function(doc) {
			let playerCards = [cards.pop(), cards.pop()];
			playerCollection.doc(doc.id).update({cards: playerCards, coins: 2, inGame: true})
				.then(r => console.log("Successfully distributed cards"))
				.catch(e => console.log(e));
		});
		// put remaining cards in room
		console.log(cards);
		console.log("Cards");
		roomRef.update({cards: cards});
	}).catch((error) => {
		// TODO: report error to user
		console.log("Error getting document:", error);
	});
}

export async function playerStateCallback(roomName, playerId) {
	console.log(roomName, playerId);
	const roomRef = firestore.collection(root).doc(roomName);
	const playerCollection = roomRef.collection("players");
	const playerRef = playerCollection.doc(playerId);
	playerRef.onSnapshot((doc) => {
			console.log("Player State Updated");
			//alert(JSON.stringify(doc.data()));
			}, (error) => console.error(error));
}

