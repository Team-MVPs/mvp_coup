// @flow

import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import PlayerScreen from './AllPlayersScreen.js';
import PastMoves from './PastMoves.js';
import UserDetails from './UserDetails.js';
import {distributeCards, playerStateCallback} from "../backend/game_logic.js"



function MainGameScreen(props) {
    let roomName = props.roomName;
    let playerID = props.playerID;
    let isHost = props.isHost || false;
    
    // TODO: remove this later
    // keeping this here as it becomes hard to test without having to create a new room each time
    if (!roomName) {
        console.log("Room name not provided, using test roomname mvp");
        roomName = "mvp";
    }
    if (!playerID) {
        playerID = "3gTERuRmmTOJwmVTeIgj";
        isHost = true;
    }
    
    playerStateCallback(roomName, playerID);

    return (
        <div style={{margin:"3em", minWidth: "900px"}}>
            <Row>
                <Col xs={5}>
                   <UserDetails playerID = {playerID} roomName = {roomName}/>
                </Col>
                <Col xs={4}>
                    <PlayerScreen />
                </Col>
                <Col xs={3}>
                    <PastMoves />
                </Col>
            </Row>
        </div>
    );
}

export default MainGameScreen;
