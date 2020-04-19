import React from 'react';
import { Button } from 'react-bootstrap';
import {all_moves} from './move_logic.js';


function showMoveList(props){
	return (<div>
				{Object.keys(all_moves).map(move => (
					<div style ={{paddingBottom: "1em", paddingTop: "1em"}}>
						<Button type="button" className="btn btn-lg btn-light" style = {{width:"20em"}} onClick={all_moves[move](props.roomName, props.currentTurn, props.playerName, props.playerID)}>{move}</Button>
					</div>
					))}
			</div>);
}

export default showMoveList;
