import React from 'react';
import { register, checkRoomNameExists, createRoomName } from '../backend/startup';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

function LoginComponent(props) {
	const [playerName, setPlayerName] = React.useState("");
	const [roomName, setRoomName] = React.useState("");
	const [redirect, setRedirect] = React.useState(false);

	const handlePlayerNameChange = (event) => { setPlayerName(event.target.value) }
	const handleRoomNameChange = (event) => { setRoomName(event.target.value) }

	const newRoom = (event) => {
		event.preventDefault();
		if (playerName.trim().length === 0) {
			alert('Please input a Player Name');
			return (<Redirect to="/" />);
		} else if (roomName.trim().length === 0) {
			alert('Please enter a Room name');
			return (<Redirect to="/" />);
		} else {
			checkRoomNameExists(roomName).then((exists) => {
				if (exists) {
					alert('Room name already exists');
					return (<Redirect to="/" />);
				} else {
					createRoomName(roomName).then(() => {
						register(props.setPlayerID, playerName, roomName).then(() => {
							props.setHost(true);
							props.setRoomName(roomName);
							setRedirect(true);
						})
					})
				}
			})
		}
	}

	const existingRoom = (event) => {
		console.log("In Existing Room");
		event.preventDefault();
		if (playerName.trim().length === 0) {
			alert('Please input a Player Name');
			return (<Redirect to="/" />);
		} else if (roomName.trim().length === 0) {
			alert('Please enter a Room name');
			return (<Redirect to="/" />);
		} else {
			checkRoomNameExists(roomName).then((exists) => {
				if (!exists) {
					alert('Room name does not exist');
					return (<Redirect to="/" />);
				} else {
					register(props.setPlayerID, playerName, roomName).then(() => {
						props.setRoomName(roomName);
						setRedirect(true);
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
			<Row style={{ marginBottom: "3%" }}>
				<input className="form-control" type="text" value={playerName} onChange={handlePlayerNameChange} placeholder="Player Name" />
			</Row>
			<Row style={{ marginBottom: "3%" }}>
				<input className="form-control" type="text" value={roomName} onChange={handleRoomNameChange} placeholder="Room Name" />
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
