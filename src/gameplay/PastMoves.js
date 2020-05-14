// @flow
import React, {useContext} from 'react';
import {Card} from "react-bootstrap";
import {RoomContext} from "../contexts/RoomContext";
import {firestore, root} from "../config/firebase";

function PastMoves() {
    const [moves, setMoves] = React.useState([]);
    
    const { roomName } = useContext(RoomContext);
    
    React.useEffect(() => {
        const unsubscribe = firestore.collection(root).doc(roomName).collection("turns").onSnapshot((docs) => {
            let moves = Array(docs.length);
            docs.forEach(function (doc) {
                const turn = doc.data();
                const turn_num = parseInt(doc.id);
                const move = turn.move;
                let move_msg = "";
                switch (turn.move.type) {
                    case "general_income":
                        move_msg = `${turn.playerName} took general income`;
                        break;
                    case "foreign_aid":
                        move_msg = `${turn.playerName} took foreign aid`;
                        break;
                    case "duke":
                        move_msg = `${turn.playerName} took 3 coins as Duke`;
                        break;
                    case "exchange_cards":
                        move_msg = `${turn.playerName} exchanged cards as Ambassador`;
                        break;
                    case "steal":
                        move_msg = `${turn.playerName} stole 2 coins from ${move.to}`;
                        break;
                    case "assassinate":
                        move_msg = `${turn.playerName} assassinated ${move.to}`;
                        break;
                    case "coup":
                        move_msg = `${turn.playerName} launched a coup on ${move.to}`;
                        break;
                    default:
                        alert("Invalid move type");
                        break;
                }
                moves[turn_num] = move_msg;
            });
            console.log(moves);
            setMoves(moves);
        });
        return () => unsubscribe;
    }, []);
    
    return (
        <div align="center">
            <h3>History</h3>
            <div align="left" style={{paddingBottom: "1em", paddingTop:"1em"}}>
                <Card>
                    <Card.Header><h4>Past Moves</h4></Card.Header>
                    <Card.Body>
                        <ol className="list-group list-group-flush">
                            {moves.map(move => (
                                <li className="list-group-item" key={move}>{move}</li>
                            ))}
                        </ol>
                    </Card.Body>
                </Card>
            </div>
        </div>)
}

export default PastMoves;
