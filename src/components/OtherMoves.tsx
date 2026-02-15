import React from 'react';
import {
	AmbassadorComponent,
	AttemptAssassinComponent,
	CoupComponent,
	CaptainComponent,
} from './moves';

export default function OtherMoves(props) {
	const { move, roomName, playerID, ambassadorBluff, turn, totalPlayers, playerNames, setConfirmed, setWaitingMessage } = props;

	if (move === 'Ambassador') {
		return (
			<div>
				<AmbassadorComponent
					roomName={roomName}
					playerID={playerID}
					ambassadorBluff={ambassadorBluff}
					turn={turn}
					totalPlayers={totalPlayers}
					playerNames={playerNames}
				/>
			</div>
		);
	} else if (move === 'AttemptAssassin') {
		return (
			<div>
				<AttemptAssassinComponent
					roomName={roomName}
					playerID={playerID}
					turn={turn}
					setConfirmed={setConfirmed}
					setWaitingMessage={setWaitingMessage}
				/>
			</div>
		);
	} else if (move === 'Coup') {
		return (
			<div>
				<CoupComponent
					roomName={roomName}
					playerID={playerID}
					turn={turn}
					setConfirmed={setConfirmed}
					setWaitingMessage={setWaitingMessage}
				/>
			</div>
		);
	} else if (move === 'Captain') {
		return (
			<div>
				<CaptainComponent
					roomName={roomName}
					playerID={playerID}
					turn={turn}
					setConfirmed={setConfirmed}
					setWaitingMessage={setWaitingMessage}
				/>
			</div>
		);
	}

	return null;
}
