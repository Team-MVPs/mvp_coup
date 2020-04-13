// @flow
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Character from '../characters/Character.js';
import OtherPlayerInfo from '../components/OtherPlayerInfoComponent.js';
import PlayCard from '../components/PlayCard.js';
import { firestore } from '../config/firebase';
import { playerStateCallback } from '../backend/game_logic.js'


/*const all_chars = ["Duke", "Assassin", "Contessa", "Captain", "Ambassador"];

const chars = all_chars.map((name, inx) => (
    <Character name={name} key={inx} show_card={true}/>
));*/

var root = "root";

function UserDetails(props) {
    const [playerDetails, setDetails] = React.useState({});


    React.useEffect(() => {
        const unsubscribe = firestore.collection(root).doc(props.roomName).collection("players").onSnapshot((docs) => {
            var dict = {};
            docs.forEach(function (doc) {
                dict[doc.id] = doc.data();
            });
            console.log(dict);
            setDetails(dict);
        });
        return () => unsubscribe;
    }, [])
    console.log(props.playerID);

    function OwnCards(props) {
        if (playerDetails[props.playerID] !== undefined) {
        	let numCards = playerDetails[props.playerID].cards.length;
        	if(numCards === 2){
	        	return (
	                <div>
	                    <Container style={{width:"20em"}}>
	                        <Row>
	                            <Col xs={6}>
	                                <PlayCard cardName={playerDetails[props.playerID].cards[0]} />
	                            </Col>
	                            <Col xs={6}>
	                                <PlayCard cardName={playerDetails[props.playerID].cards[1]} />
	                            </Col>
	                        </Row>
	                    </Container>
	                </div>);

        	} else if (numCards === 1){
	        	return (
	                <div>
	                    <Container style={{width:"20em"}}>
	                        <Row>
	                            <Col xs={6}>
	                                <PlayCard cardName={playerDetails[props.playerID].cards[0]} />
	                            </Col>
	                        </Row>
	                    </Container>
	                </div>);        		
        	}

        } else {
            return (<div></div>);
        }
    }
    return (
        <div align="center">
            <h3>Player Information</h3>
            <div align="left" style={{paddingBottom: "1em"}}>
                <Card>
                    <Card.Header><h4>Your Cards</h4></Card.Header>
                    <Card.Body>
                    <OwnCards playerID={props.playerID} />
                    </Card.Body>
                </Card>
            </div>
            <div align="left">
                <Card>
                    <Card.Header><h4>Other Players</h4></Card.Header>
                    <Card.Body>
                    <OtherPlayerInfo playerDetails={playerDetails} ownID={props.playerID} />
                    </Card.Body>
                </Card>
            </div>

        </div>)
}

export default UserDetails;