// @flow 

import React from 'react';
import {all_chars} from '../backend/game_logic.js';
import ShowMoveList from '../backend/MoveList.js';
import { firestore, root } from '../config/firebase';



const [turnCount, setTurnCount]= React.useState(-1);



function PlayerScreen(props) {
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
