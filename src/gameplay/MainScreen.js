// @flow

import React from 'react';
import {Row, Col} from 'react-bootstrap';
import PlayerScreen from './AllPlayersScreen.js';
import PastMoves from './PastMoves.js';
import UserDetails from './UserDetails.js';
import {cleanupRoom} from "../backend/callbacks.js"

function MainGameScreen(props) {
    let roomName = props.roomName;
    let playerID = props.playerID;
    let isHost = props.isHost || false;
    
    if (isHost) {
        cleanupRoom(roomName);
    }

    return (
        <div style={{margin:"3em", minWidth: "900px"}}>
            <Row>
                <Col xs={4}>
                   <UserDetails playerID = {playerID} roomName = {roomName}/>
                </Col>
                <Col xs={5}>
                    <PlayerScreen playerID = {playerID} roomName = {roomName}  playerIndex={props.playerIndex} playerNames = {props.playerNames} />
                </Col>
                <Col xs={3}>
                    <PastMoves />
                </Col>
            </Row>
        </div>
    );
}

export default MainGameScreen;
