/**
 * Login component for room creation and joining
 */

import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { register, checkRoomNameExists, checkPlayerNameExists, createRoomName, checkGameStart } from '../backend/startup';
import { RoomContext } from '../contexts/RoomContext';
import { isValidPlayerName, isValidRoomName } from '../utils/validators';
import styles from './LoginComponent.module.scss';

/**
 * Validates input fields
 * @param {string} playerName - The player name to validate
 * @param {string} roomName - The room name to validate
 * @returns {string|null} - Error message if validation fails, null otherwise
 */
const validateInputs = (playerName, roomName) => {
	if (!isValidPlayerName(playerName)) {
		return 'Please input a Player Name';
	}
	if (!isValidRoomName(roomName)) {
		return 'Please enter a Room name';
	}
	return null;
};

const LoginComponent = (props) => {
	const [playerName, setPlayerName] = useState('');
	const [tempRoomName, setTempRoomName] = useState('');
	const [redirect, setRedirect] = useState(false);

	const { setRoomName } = useContext(RoomContext);

	const handlePlayerNameChange = (event) => setPlayerName(event.target.value);
	const handleRoomNameChange = (event) => setTempRoomName(event.target.value);

	/**
	 * Handles creating a new room
	 */
	const newRoom = async (event) => {
		event.preventDefault();

		const validationError = validateInputs(playerName, tempRoomName);
		if (validationError) {
			alert(validationError);
			return;
		}

		try {
			const roomExists = await checkRoomNameExists(tempRoomName);
			if (roomExists) {
				alert('Room name already exists');
				return;
			}

			await createRoomName(tempRoomName);
			await register(props.setPlayerID, playerName, tempRoomName);
			props.setHost(true);
			setRoomName(tempRoomName);
			setRedirect(true);
		} catch (error) {
			console.error('Error creating room:', error);
			alert('An error occurred while creating the room. Please try again.');
		}
	};

	/**
	 * Handles joining an existing room
	 */
	const existingRoom = async (event) => {
		event.preventDefault();

		const validationError = validateInputs(playerName, tempRoomName);
		if (validationError) {
			alert(validationError);
			return;
		}

		try {
			const roomExists = await checkRoomNameExists(tempRoomName);
			if (!roomExists) {
				alert('Room name does not exist');
				return;
			}

			const gameStarted = await checkGameStart(tempRoomName);
			if (gameStarted) {
				alert('You cannot join this lobby, game has already started!');
				return;
			}

			const playerExists = await checkPlayerNameExists(tempRoomName, playerName);
			if (playerExists) {
				alert('This player name already exists, choose another one.');
				return;
			}

			await register(props.setPlayerID, playerName, tempRoomName);
			setRoomName(tempRoomName);
			setRedirect(true);
		} catch (error) {
			console.error('Error joining room:', error);
			alert('An error occurred while joining the room. Please try again.');
		}
	};

	if (redirect) {
		return <Redirect to="/GameStart" />;
	}

	return (
		<Container className={styles.loginContainer}>
			<h1 className={styles.welcomeTitle}>Welcome to MVP Coup</h1>
			<Row className={styles.inputRow}>
				<input
					className="form-control"
					type="text"
					value={playerName}
					onChange={handlePlayerNameChange}
					placeholder="Player Name"
				/>
			</Row>
			<Row className={styles.inputRow}>
				<input
					className="form-control"
					type="text"
					value={tempRoomName}
					onChange={handleRoomNameChange}
					placeholder="Room Name"
				/>
			</Row>
			<Row className={styles.buttonRow}>
				<Col xs={6} className={styles.buttonCol}>
					<button
						className={`btn btn-primary mb-2 ${styles.actionButton}`}
						type="submit"
						onClick={newRoom}
					>
						Create a New Room
					</button>
				</Col>
				<Col xs={6} className={styles.buttonCol}>
					<button
						className={`btn btn-primary mb-2 ${styles.actionButton}`}
						type="submit"
						onClick={existingRoom}
					>
						Join an Existing Room
					</button>
				</Col>
			</Row>
			<div className={`fixed-bottom ${styles.footerLink}`}>
				<Link to="/creators">Meet the Creators</Link>
			</div>
		</Container>
	);
};

export default LoginComponent;
