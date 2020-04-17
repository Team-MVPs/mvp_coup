import React from 'react';
import { firestore, root } from '../config/firebase';
import { Button } from 'react-bootstrap';
import {incrementTurn} from './game_logic.js'

export const all_moves = ["Take General Income", 
						  "Take Foreign Aid", 
						  "Take 3 as Duke", 
						  "Exchange your cards as Ambassador", 
						  "Steal 2 from a player as Captain",
						  "Assassinate someone you dislike!",
						  "Coup a scrub"];

function showMoveList(props){

	const handleClick = (event) => {
		incrementTurn(props.roomName, props.currentTurn);
	  };
	  
	return (<div>
				{all_moves.map(move => (
					<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
						<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={handleClick}>{move}</Button>
					</div>
					))}
			</div>)
}

export default showMoveList;