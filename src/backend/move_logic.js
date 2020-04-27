import {firestore, root} from "../config/firebase";
import {handleDBException} from "./callbacks";
import firebase from 'firebase';
import React, {useContext, useEffect, useState} from 'react';
import { generalIncome, Coup, foreignAid, Duke, HasCard, exchangeOneCard } from "./PerformMoves";

export function Move(type, player, to) {
	return {
		type: type,
		player: player,
		to: to
	}
}

let registeredTurn = -1;
// TODO: get actual number of players

export function RegisterMoveCallback(roomName, turn, playerID, playerName, setMove, setCurrentMove, setConfirmed, 
									 setWaitingMessage, setPlayerChosen, setLoseACard) {
	firestore.collection(root).doc(roomName).collection("players").get().then((snap)=>{
		const numPlayers = snap.docs.length;
		var alreadyInvoked = false;
		var bluffDecided = false;
		var takeCoins = false;
		if (turn >= 0 && turn !== registeredTurn) {
			firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).onSnapshot(
				async (doc) => {
					let makeMove = false;
					let incrementTurnFromPlayer = true;
					if (doc.exists) {
						let move = doc.data().move.type;
						const playerName = doc.data().playerName;
						var targetPlayer = doc.data().move.to;
						if (doc.data().playerID !== playerID) {
							if(!alreadyInvoked && move !== "general_income" && move !== 'coup'){
								setMove(`${playerName} performed ${move}`);
								alreadyInvoked = true;
								if (move === 'assassinate'){
									setCurrentMove("AttemptAssassin");
									setWaitingMessage("Waiting for assassin to strike! Quick, try and hide!");																		
								}

							} else {
								if (move === 'coup'){
									setMove(`${playerName} performed ${move}`);
									setCurrentMove("Coup");
									setWaitingMessage("A Coup has been launched! Start Praying!")
									if (targetPlayer !== null){
										setPlayerChosen(targetPlayer);
										setLoseACard(true);
									}								
								} else if (move === 'assassinate'){
									if (targetPlayer !== null){
										setPlayerChosen(targetPlayer);
									}
									if (doc.data().confirmations === 1){
										setLoseACard(true);
										if (targetPlayer === playerName){
											setWaitingMessage("You have been Assassinated! Choose one card to lose!")
										} else{
											setWaitingMessage("The Assassin has struck! " + targetPlayer + " will loose a card!");
										}
									}
								}						

								if(doc.data().bluffLoser !== undefined && !bluffDecided){
									bluffDecided = true;
									if(doc.data().bluffLoser.playerID == playerID){
										setWaitingMessage("Unsuccessful Bluff. Pick 1 card to loose");
										setMove("bluff");
									}else{
										const bluffer = doc.data().bluffs[0].playerName;
										const loser = doc.data().bluffLoser.playerName;
										if(doc.data().bluffs[0].playerID === playerID){
											setWaitingMessage("Successful Bluff!" + loser + " is loosing a card.")
										}else{
											setWaitingMessage(bluffer + " bluffed " + playerName + " 's move." + loser + " is loosing a card");
										}
										setConfirmed(true);
										setMove("");
									}
								}
							}
						} else {
							if(doc.data().bluffs.length != 0 && !bluffDecided){
								await HasCard(roomName, playerID, move).then((result) => {
									bluffDecided = true;
									console.log("Bluff Result " + result);
									if(result){
										const bluffer = doc.data().bluffs[0].playerName;
										setWaitingMessage(bluffer + " bluffed " + "your move." + bluffer + " is loosing a card");
										firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
											bluffLoser : doc.data().bluffs[0]
										});
										makeMove = true;
										console.log("got here");
										console.log(makeMove);
										incrementTurnFromPlayer = false;
										setConfirmed(true);
									}else{
										move="";
										firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
											bluffLoser : {playerID: playerID, playerName: playerName}
										}).then(() => {
											setConfirmed(false);
											setMove("bluff");
											setWaitingMessage(doc.data().bluffs[0].playerName + " called Bluff. Pick 1 card to loose");
										})
									}
								})
							}
							
							if (move === "general_income"){
								setConfirmed(false);
								generalIncome(roomName,playerID);
								incrementTurn(roomName).then(() => console.log("turn incremented"));
							} else if (move === 'coup'){
								setConfirmed(false);
								if (!takeCoins){
									firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
										coins: firebase.firestore.FieldValue.increment(-7)
									});
									takeCoins = true;
								}	
								setCurrentMove('Coup')
								if (targetPlayer !== null){
									setLoseACard(true);
									setWaitingMessage('You have launched a Coup! '+ targetPlayer + ' will now lose a card!')
								}								
							} else if (move === 'exchange_cards'){
								if (doc.data().confirmations+1 === numPlayers || makeMove){
									if(!makeMove) setConfirmed(false);
									setCurrentMove("Ambassador");
								}
							} else if (move === 'assassinate'){
								if (!takeCoins){
									firestore.collection(root).doc(roomName).collection("players").doc(playerID).update({
										coins: firebase.firestore.FieldValue.increment(-3)
									});
									takeCoins = true;
								}								
								setCurrentMove("AttemptAssassin");
								if(doc.data().confirmations === 1){
									setLoseACard(true);
									setWaitingMessage("Your Assassin has struck! " + targetPlayer + ' will loose a card!')
								}
							} else {
								console.log(makeMove);
								console.log(move);
								if (doc.data().confirmations+1 === numPlayers || makeMove) {
										if(!makeMove) setConfirmed(false);
										switch (move) {
											case "foreign_aid":
												foreignAid(roomName, playerID);
												break;
											case "duke":
												// duke
												console.log("calling duke");
												Duke(roomName, playerID);
												break;
											case "steal":
												// somehow figure out how to get the `to`
												move.to = "Vandit";
												break;
											default:
												alert("Invalid move type");
												break;
										}
										if(incrementTurnFromPlayer){
											incrementTurn(roomName).then(() => console.log("turn incremented"));
										}
								}	
							}
							if(bluffDecided && move !== ""){
								exchangeOneCard(roomName, playerID, move);
							}
						}	
				};
			registeredTurn = turn;
		})
	}})
}

export async function updateTurnInDB(roomName, turn, playerName, playerID, move) {
	await firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).set({
		turn: turn,
		playerName: playerName,
		playerID: playerID,
		move: move,
		confirmations: 0,
		blocks: [],
		bluffs: []
	}).then(() => {
		console.log("Added turn to db");
	}).catch(() => handleDBException());
}

function move(type) {
	return (roomName, turn, playerName, activePlayerID, setConfirmed) => {
		return () => {
			const move = Move(type, playerName, null, "");
			updateTurnInDB(roomName, turn, playerName, activePlayerID, move).then(() =>{
				if(setConfirmed !== null) setConfirmed(true);
			});	
		}
	}
}

export const all_moves = {
	"Take General Income": move("general_income"),
	"Take Foreign Aid": move("foreign_aid"),
	"Take 3 as Duke": move("duke"),
	"Exchange your cards as Ambassador": move("exchange_cards"),
	"Steal 2 from a player as Captain": move("steal"),
	"Assassinate someone you dislike!": move("assassinate"),
	"Coup a scrub": move("coup")
};

function respond(type) {
	return function (roomName, turn, playerName, playerID, setConfirmed, setMove) {
		return () => {
			switch (type) {
				case "confirm":
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						confirmations: firebase.firestore.FieldValue.increment(1)
					}).then(() => {
						console.log("incremented confirmations");
						setConfirmed(true);
						//setMove("");
						});
					break;
				case "call_bluff":
					firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
						bluffs: firebase.firestore.FieldValue.arrayUnion({playerID: playerID, playerName: playerName}),
					}).then(() => {
						setConfirmed(true);
						//setMove("");
						console.log("incremented confirmations");
					});
					break;
				case "block":
					// duke
					break;
				default:
					alert("Invalid response");
					break;
			}
		}
	}
}

export const responses = {
	"Confirm": respond("confirm"),
	"Call Bluff": respond("call_bluff"),
	"Block": respond("block"),
};

export async function incrementTurn(roomName) {
	await firestore.collection(root).doc(roomName).update({
		turn: firebase.firestore.FieldValue.increment(1)
	}).then(() => console.log("incremented turn"));
}

export async function confirmTurn(roomName, turn, setConfirmed, setWaitingMessage, setMove){
	console.log("Incrementing Confiramtions");
	if(setConfirmed !== null) setConfirmed(true);
	if(setWaitingMessage !== null) setWaitingMessage("Waiting for others");
	if(setMove !== null) setMove("");
	await firestore.collection(root).doc(roomName).collection("turns").doc(turn.toString()).update({
		confirmations: firebase.firestore.FieldValue.increment(1)
	});
}