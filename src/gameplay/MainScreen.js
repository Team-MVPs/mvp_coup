// @flow

import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import PlayerScreen from './AllPlayersScreen.js';
import PastMoves from './PastMoves.js';
import UserDetails from './UserDetails.js';
//import {playerRegistrationCallback} from "../backend/callbacks.js"
import {playerRegistrationCallback} from "../backend/firebaseTestingPreet.js"

function MainGameScreen(props) {
    playerRegistrationCallback(props.popupCallback);
    console.log(props);
    return (
        <Container>
            <Row>
                <Col xs={3}>
                   <UserDetails />
                </Col>
                <Col xs={6}>
                    <PlayerScreen />
                </Col>
                <Col xs={3}>
                    <PastMoves />
                </Col>
            </Row>
        </Container>
    );
}

export default MainGameScreen;