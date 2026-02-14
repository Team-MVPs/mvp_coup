// @flow
import React, { useContext } from 'react';
import { Card, ListGroup } from "react-bootstrap";
import { RoomContext } from "../contexts/RoomContext";
import { firestore, root } from "../config/firebase";
import styles from './PastMoves.module.scss';

function PastMoves() {
    const [moves, setMoves] = React.useState([]);
    const { roomName } = useContext(RoomContext);

    React.useEffect(() => {
        if (!roomName) return;

		const subscribe = firestore.collection(root).doc(roomName).onSnapshot((roomDoc) => {
            const currentTurn = roomDoc.data().turn;
            roomDoc.ref.collection("turns").get().then((docs) => {
                const movesArray = Array(docs.length);
                docs.forEach(function (doc) {
                    const turn = doc.data();
                    const turn_num = parseInt(doc.id, 10);
                    const move = turn.move;
                    const move_msg = [];
                    if(currentTurn !== turn_num){
                        switch (turn.move.type) {
                            case "general_income":
                                move_msg.push(`${turn.playerName} took general income`);
                                break;
                            case "foreign_aid":
                                move_msg.push(`${turn.playerName} took foreign aid`);
                                break;
                            case "duke":
                                move_msg.push(`${turn.playerName} took 3 coins as Duke`);
                                break;
                            case "exchange_cards":
                                move_msg.push(`${turn.playerName} exchanged cards as Ambassador`);
                                break;
                            case "steal":
                                move_msg.push(`${turn.playerName} stole 2 coins from ${move.to}`);
                                break;
                            case "assassinate":
                                move_msg.push(`${turn.playerName} assassinated ${move.to}`);
                                break;
                            case "coup":
                                move_msg.push(`${turn.playerName} launched a coup on ${move.to}`);
                                break;
                            default:
                                alert("Invalid move type");
                                break;
                        }
                        if (turn.blocks.length !== 0) {
                            const block = turn.blocks[0];
                            const playerName = block.playerName;
                            const card = (block.card !== undefined) ? block.card : "Contessa"
                            move_msg.push(playerName + " blocked " + turn.playerName + "'s move as " + card);
                        }
                        if (turn.bluffs.length !== 0) {
                            const bluff = turn.bluffs[0];
                            const playerName = bluff.playerName;
                            const loser = turn.bluffLoser.playerName;
                            move_msg.push(playerName + " bluffed the move");
                            move_msg.push(loser + " lost a card");
                        }
                        movesArray[turn_num] = move_msg;
                    }
                });
                setMoves(movesArray.reverse());
            });
		});
		return () => subscribe();
    }, [roomName]);

    return (
        <div align="center">
            <h3>History</h3>
            <div align="left" className={styles.historySection}>
                <Card>
                    <Card.Header><h4>Past Moves</h4></Card.Header>
                    <Card.Body className={`overflow-auto ${styles.cardBody}`}>
                        <ListGroup>
                            {moves.map((move, idx) => {
                                if (move !== undefined) {
                                    return (
                                        <ListGroup.Item key={idx} className={styles.listItem}>
                                            <ol className={styles.moveList}>
                                                {move.map((line, lineIdx) => (
                                                    <li key={lineIdx}>{line}</li>
                                                ))}
                                            </ol>
                                        </ListGroup.Item>
                                    );
                                }
                                return null;
                            })}
                       </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        </div>)
}

export default PastMoves;
