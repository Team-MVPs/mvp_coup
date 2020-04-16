// @flow 

import React from 'react';
//import Character from '../characters/Character.js';
import {all_chars} from '../backend/game_logic.js';
import ShowMoveList from '../backend/MoveList.js';


/*const chars = all_chars.map((name, inx) => (
    <Character name={name} key={inx} show_card={false}/>
));*/

let isTurn = true;

function PlayerScreen(props) {
	if (isTurn){
		return(
			<div>
				<h3>Make A Move!</h3>
				<ShowMoveList/>
			</div>
			)
	} else{
		return(
		<div>
			<h3>Not your Turn</h3> 
		</div>)
	}

}

export default PlayerScreen;
