// @flow
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Character from '../characters/Character.js';
import OtherPlayerInfo from '../components/OtherPlayerInfoComponent.js';
import PlayCard from '../components/PlayCard.js';
import { firestore, root } from '../config/firebase';
import { playerStateCallback } from '../backend/game_logic.js'
import coins from '../images/coins.jpg';

/*const all_chars = ["Duke", "Assassin", "Contessa", "Captain", "Ambassador"];

const chars = all_chars.map((name, inx) => (
    <Character name={name} key={inx} show_card={true}/>
));*/

function UserDetails(props) {
    const [playerDetails, setDetails] = React.useState({});


    React.useEffect(() => {
        const unsubscribe = firestore.collection(root).doc(props.roomName).collection("players").onSnapshot((docs) => {
            let dict = {};
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
        	if (numCards === 2){
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
                        <div align = "center" style = {{fontSize: "x-large", paddingTop: "1em"}}>
                          <img src ={coins} alt="coins" style={{maxWidth: "10%", borderRadius: "2em", paddingRight: "0.5em"}}/>
                          {playerDetails[props.playerID].coins}
                        </div>
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
                        <div align = "center" style = {{fontSize: "x-large", paddingTop: "1em"}}>
                          <img src ={coins} alt="coins" style={{maxWidth: "10%", borderRadius: "2em", paddingRight: "0.5em"}}/>
                          {playerDetails[props.playerID].coins}
                        </div>
	                </div>);        		
        	}else {
        		return (<div>You are out of the game!</div>);
        	}

        } else {
            return (<div></div>);
        };
    };

    return (
        <div align="center">
            <h3>Player Information</h3>
            <div align="left" style={{paddingBottom: "1em", paddingTop:"1em"}}>
                <Card>
                    <Card.Header><h4>Your Cards and Currency</h4></Card.Header>
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
