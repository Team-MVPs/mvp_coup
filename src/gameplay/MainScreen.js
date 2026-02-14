// @flow

import React from 'react';
import {Row, Col, Navbar, Button, Modal} from 'react-bootstrap';
import PlayerScreen from './AllPlayersScreen.js';
import PastMoves from './PastMoves.js';
import UserDetails from './UserDetails.js';
import {cleanupRoom} from "../backend/callbacks.js"
import moves from '../images/moves.jpg';
import styles from './MainScreen.module.scss';

function MovesPopup(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Moves
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <img src={moves} alt="Game moves reference" className={styles.movesImage} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>

    );
}

function MainGameScreen(props) {
    const [movesPopupShow, setMovesPopupShow] = React.useState(false);

    let roomName = props.roomName;
    let playerID = props.playerID;
    let isHost = props.isHost || false;
    
    if (isHost) {
        cleanupRoom(roomName);
    }
    function show() {
        return () => {
            setMovesPopupShow(true);
        }
    }

    return (
        <div className={styles.mainContainer}>
            <Row className={styles.gameRow}>
                <Col xs={4} className={styles.playerInfoCol}>
                   <UserDetails playerID = {playerID} />
                </Col>
                <Col xs={5} className={styles.movesCol}>
                    <PlayerScreen playerID = {playerID}  playerIndex={props.playerIndex} />
                </Col>
                <Col xs={3} className={styles.historyCol}>
                    <PastMoves/>
                </Col>
            </Row>
            <Navbar fixed="bottom" expand="lg" variant="light" bg="light" className="justify-content-end">
                <Button variant="outline-dark" onClick={show()}>Moves</Button>
          </Navbar>
          <MovesPopup
          show={movesPopupShow}
          onHide={() => {
              setMovesPopupShow(false)
            }
          }
        />
        </div>
    );
}

export default MainGameScreen;
