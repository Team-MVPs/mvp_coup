// @flow
import React, { useContext } from 'react';
import { Card, ListGroup } from "react-bootstrap";
import { RoomContext } from "../contexts/RoomContext";
import { firestore, root } from "../config/firebase";

function PastMoves() {
    const [moves, setMoves] = React.useState([]);
    const { roomName } = useContext(RoomContext);

    React.useEffect(() => {
		const subscribe = firestore.collection(root).doc(roomName).onSnapshot((roomDoc) => {
            let currentTurn = roomDoc.data().turn;
            roomDoc.ref.collection("turns").get().then((docs) => {
                let moves = Array(docs.length);
                docs.forEach(function (doc) {
                    const turn = doc.data();
                    const turn_num = parseInt(doc.id);
                    const move = turn.move;
                    let move_msg = [];
                    console.log(currentTurn);
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
                        moves[turn_num] = move_msg;
                    }
                });
                // console.log(moves);
                setMoves(moves);
            });
		});
		return () => subscribe();
    }, []);

    return (
        <div align="center">
            <h3>History</h3>
            <div align="left" style={{ paddingBottom: "1em", paddingTop: "1em" }}>
                <Card>
                    <Card.Header><h4>Past Moves</h4></Card.Header>
                    <Card.Body className="overflow-auto" style={{padding:"0rem", height: "40em"}}>
                        <ListGroup>
                            {moves.map(move => {
                                if (move !== undefined) {
                                    return(
                                        <ListGroup.Item style={{border: "1px solid rgba(0, 0, 0, 0.125)"}}>
                                            <ol style={{paddingLeft: "0"}}>
                                                {move.map(line => {
                                                    return (<li style={{listStyleType: "none"}}>{line}</li>)
                                                })}
                                            </ol>
                                        </ListGroup.Item>
                                    );
                                }
                            })}
                       </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        </div>)
}

export default PastMoves;
