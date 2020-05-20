// @flow 

import React, {useContext, useEffect, useState} from 'react';
import {MoveList} from '../backend/MoveList.js';
import {firestore, root} from '../config/firebase';
import {RegisterMoveCallback, incrementTurn} from "../backend/move_logic";
import {RoomContext} from '../contexts/RoomContext.js';
import {ResponseList, ResponseListForeignAid, ResponseListBlock, ResponseListAssassin, ResponseListDuke, ResponseListCaptain, ResponseListAmbassador} from "../backend/MoveList";
import OtherMoves from '../backend/OtherMoves.js';
import {Button, Spinner} from 'react-bootstrap';
import {LoseCard} from '../backend/PerformMoves.js';
import Redirect from "react-router-dom/es/Redirect";

function PlayerScreen(props) {
	const [isTurn, setIsTurn] = useState(props.playerIndex === 0);
	const [currentTurn, setCurrentTurn] = useState(-1);
	const [move, setMove] = useState("");
	const [currentMove, setCurrentMove] = useState("");
	const [playerChosen, setPlayerChosen] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const [loseACard, setLoseACard] = useState(false);
	const [ambassadorBluff, setAmbassadorBluff] = useState(false);
	const [waitingMessage, setWaitingMessage] = useState("Waiting for others");
	const [outOfGame, setOutOfGame] = useState(false);
	const [winner, setWinner] = useState("");
	const [redirect, setRedirect] = useState(false);
	const {roomName, playerNames, playerNamesMapping} = useContext(RoomContext);

	let totalPlayers = playerNames.length;
	
	useEffect(() => {
        const subscribe = firestore.collection(root).doc(roomName).collection("players").doc(props.playerID).onSnapshot((doc) => {
            if(doc.data().cards.length === 0) {
				setOutOfGame(true);
			}
        });
        return () => subscribe;
	}, []);
	
	useEffect(() => {
		const subscribe = firestore.collection(root).doc(roomName).onSnapshot((doc) => {
			//console.log("Snapshot Triggered");
			//console.log(doc.data().turn);
			//console.log(currentTurn);
			
			if (doc.data().winner) {
				setWinner(doc.data().winner);
			} else if (doc.data().turn !== currentTurn){
				// reset move variable
				setMove("");
				setCurrentMove("");
				setWaitingMessage("Waiting for others");
				setPlayerChosen("");
				setLoseACard(false);
				setConfirmed(false);
				if (doc.data().turn % totalPlayers === props.playerIndex) {
					setIsTurn(true);
				} else {
					setIsTurn(false);
				}
				setCurrentTurn(doc.data().turn);
				RegisterMoveCallback(roomName, doc.data().turn, props.playerID, playerNames[props.playerIndex],setMove, setCurrentMove, setConfirmed, 
									 setWaitingMessage, setPlayerChosen, setLoseACard, setAmbassadorBluff, totalPlayers, playerNames);
			}
		});
		return () => subscribe();
	}, [currentTurn]);

	if (redirect){
		return (<Redirect to="/" />);

	}else if (winner) {
		return (
			<div>
				<h3>{winner} is the winner!</h3>
				<p style={{paddingTop: "1em"}}>Thanks for playing MVP Coup!</p>
				<div style={{paddingBottom: "1em", paddingTop: "1em"}}>
					<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={
						() => setRedirect(true)
					}>New Game</Button>
				</div>
			</div>
		);
	} else if (outOfGame) {
		return (
			<div>
				<h3>You Lost</h3>
			</div>
		);
	}
	else if(move === "bluff"){
		function confirmFunction(){
			return () => {
					incrementTurn(roomName, totalPlayers, playerNames).then(() => {});
				}
			}
		return(
			<div>
				<LoseCard title={waitingMessage} roomName = {roomName} playerID = {props.playerID} turn = {currentTurn} confirmFunction={confirmFunction()}/>
			</div>
		);
	}else if (isTurn) {
		if(confirmed){
			return (
				<div>
				  <div align="middle" style = {{paddingTop:"1em"}}>
					<Spinner animation="border" as="span"/>
				  </div>
				  <div className="col-xs-6" align="middle">
					{waitingMessage}
				  </div>
				</div>
			  );
		}
		if (currentMove !== ""){
			if (!loseACard){
				return(
					<div>
						<OtherMoves move = {currentMove} roomName = {roomName} playerID = {props.playerID} turn = {currentTurn} ambassadorBluff = {ambassadorBluff} totalPlayers={totalPlayers}
						setConfirmed = {setConfirmed} setWaitingMessage={setWaitingMessage} playerNames={playerNames}/>
					</div>)
				} else if (currentMove === "blocked"){
					return (
						<div>
							<h3>{waitingMessage}</h3>
							<ResponseListBlock currentTurn={currentTurn} roomName={roomName} activePlayerID={props.playerID}
										  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
						</div>
					);
				} else {
					return (
						<div>
						  <div align="middle" style = {{paddingTop:"1em"}}>
							<Spinner animation="border" as="span"/>
						  </div>
						  <div className="col-xs-6" align="middle">
							{waitingMessage}
						  </div>
						</div>
					  );
				}
		}else return (
			<div>
				<h3>Make A Move!</h3>
				<MoveList currentTurn={currentTurn} roomName={roomName} activePlayerID={props.playerID}
						  playerName={playerNamesMapping[props.playerID]} setConfirmed={setConfirmed}/>
			</div>
		);
	}else if(confirmed && playerNames[props.playerIndex] !== playerChosen){
		return (
			<div>
			  <div align="middle" style = {{paddingTop:"1em"}}>
				<Spinner animation="border" as="span"/>
			  </div>
			  <div className="col-xs-6" align="middle">
				{waitingMessage}
			  </div>
			</div>
		  );
	} else if (move !== "") {
		if (currentMove !== "AttemptAssassin" && currentMove !== "Coup" && currentMove !== "Captain"){
			if (currentMove === "ForeignAid"){
				return (
					<div>
						<h3>{move}</h3>
						<ResponseListForeignAid currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
									  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
					</div>
				)

			} else if (currentMove === "Duke"){
				return (
					<div>
						<h3>{move}</h3>
						<ResponseListDuke currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
									  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
					</div>
				); 
			}else if (currentMove === "Ambassador"){
				return (
					<div>
						<h3>{move}</h3>
						<ResponseListAmbassador currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
									  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
					</div>
				); 
			}else{
				return (
					<div>
						<h3>{move}</h3>
						<ResponseList currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
									  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
					</div>
				); 
			}
		} else {
			if (playerNames[props.playerIndex] === playerChosen){
				if(!loseACard){
					if (currentMove === "AttemptAssassin" && !confirmed){
						return (
						<div>
								<h3>{move}</h3>
								<ResponseListAssassin currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
											  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
							</div>
						);
					} else if (currentMove === "Captain" && !confirmed){
						return (
							<div>
								<h3>{move}</h3>
								<ResponseListCaptain currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
											  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
							</div>
						);
					} else if (currentMove === "Captain" && confirmed){
						return (
							<div>
							  <div align="middle" style = {{paddingTop:"1em"}}>
								<Spinner animation="border" as="span"/>
							  </div>
							  <div className="col-xs-6" align="middle">
								Waiting for player!
							  </div>
							</div>
						  );
					} else if (currentMove === "AttemptAssassin" && confirmed){
						return (
							<div>
							  <div align="middle" style = {{paddingTop:"1em"}}>
								<Spinner animation="border" as="span"/>
							  </div>
							  <div className="col-xs-6" align="middle">
								Waiting for player!
							  </div>
							</div>
						  );
					}else {
						return (
							<div>
								<h3>{move}</h3>
								<ResponseList currentTurn={currentTurn} roomName={roomName} notActivePlayerID={props.playerID}
											  playerName={playerNamesMapping[props.playerID]} setConfirmed = {setConfirmed} setMove = {setMove}/>
							</div>
						);
					}
				} else {
					function confirmFunction(){
						return () => {
								incrementTurn(roomName, totalPlayers, playerNames).then(() => {});
							}
						}	
					return (
							<div>
								<LoseCard title={waitingMessage} roomName = {roomName} turn = {currentTurn} playerID = {props.playerID} confirmFunction={confirmFunction()}/>
							</div>)
				}

			} else {
				return (
					<div>
					  <div align="middle" style = {{paddingTop:"1em"}}>
						<Spinner animation="border" as="span"/>
					  </div>
					  <div className="col-xs-6" align="middle">
						{waitingMessage}
					  </div>
					</div>
				  );
			}
		}

	} else {
		return (
			<div>
				<h3>{playerNames[currentTurn % totalPlayers]}'s Turn</h3>
			</div>
		);
	}
 
}

export default PlayerScreen;
