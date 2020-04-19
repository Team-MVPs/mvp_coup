import React, { useContext } from 'react';
import { register, checkRoomNameExists, checkPlayerNameExists, createRoomName } from '../backend/startup';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { RoomContext } from '../contexts/RoomContext.js';

function LoginComponent(props) {
	const [playerName, setPlayerName] = React.useState("");
	const [tempRoomName, setTempRoomName] = React.useState("");
	const [redirect, setRedirect] = React.useState(false);

	const handlePlayerNameChange = (event) => { setPlayerName(event.target.value) }
	const handleRoomNameChange = (event) => { setTempRoomName(event.target.value) }

	const { setRoomName } = useContext(RoomContext);

	const newRoom = (event) => {
		event.preventDefault();
		if (playerName.trim().length === 0) {
			alert('Please input a Player Name');
			return (<Redirect to="/" />);
		} else if (tempRoomName.trim().length === 0) {
			alert('Please enter a Room name');
			return (<Redirect to="/" />);
		} else {
			checkRoomNameExists(tempRoomName).then((exists) => {
				if (exists) {
					alert('Room name already exists');
					return (<Redirect to="/" />);
				} else {
					createRoomName(tempRoomName).then(() => {
						register(props.setPlayerID, playerName, tempRoomName).then(() => {
							props.setHost(true);
							setRoomName(tempRoomName);
							setRedirect(true);
						})
					})
				}
			})
		}
	}

	const existingRoom = (event) => {
		event.preventDefault();
		if (playerName.trim().length === 0) {
			alert('Please input a Player Name');
			return (<Redirect to="/" />);
		} else if (tempRoomName.trim().length === 0) {
			alert('Please enter a Room name');
			return (<Redirect to="/" />);
		} else {
			checkRoomNameExists(tempRoomName).then((exists) => {
				if (!exists) {
					alert('Room name does not exist');
					return (<Redirect to="/" />);
				} else {
					
					checkPlayerNameExists(tempRoomName, playerName).then((exists) =>{
						if (exists) {
							alert("This player name already exists, choose another one.");
							return (<Redirect to="/" />);
						}
						else {
							register(props.setPlayerID, playerName, tempRoomName).then(() => {
								setRoomName(tempRoomName);
								setRedirect(true);
							})
						}

					})
				}
			})
		}
	};

	if (redirect) {
		return (
			<Redirect to="/GameStart" />)
	}

	return (
		<Container style={{ marginTop: "22%", width: "50%" }}>
			<h1 style={{ marginBottom: "3%" }}>Welcome to MVP Coup</h1>
			<Row style={{ marginBottom: "3%" }}>
				<input className="form-control" type="text" value={playerName} onChange={handlePlayerNameChange} placeholder="Player Name" />
			</Row>
			<Row style={{ marginBottom: "3%" }}>
				<input className="form-control" type="text" value={tempRoomName} onChange={handleRoomNameChange} placeholder="Room Name" />
			</Row>
			<Row>
				<Col xs={6}>
					<button style={{ width: "100%" }} type="Submit" className="btn btn-primary mb-2" onClick={newRoom}>Create a New Room</button>
				</Col>
				<Col xs={6}>
					<button style={{ width: "100%" }} type="Submit" className="btn btn-primary mb-2" onClick={existingRoom}>Join an Existing Room</button>
				</Col>
			</Row>
		</Container>
	)
}

export default LoginComponent;
