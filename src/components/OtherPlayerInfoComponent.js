import React from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import PlayCard from '../components/PlayCard.js';
import coins from '../images/coins.jpg';

function OtherPlayerInfo(props) {
	function AccordianBody(props) {
		return (
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey={props.keyIndex}>
					{props.data.name}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={props.keyIndex}>
					<Card.Body>
						<div>
							<Container style={{ width: "20em" }}>
								<Row>
									<Col xs={6}>
										{(props.data.cards.length >= 1) ? <PlayCard cardName={"back"}/> : <div>Out Of game, what a loser!</div>}
									</Col>
									<Col xs={6}>
										{(props.data.cards.length === 2) ? <PlayCard cardName={"back"}/> : <div/>}
									</Col>
								</Row>
							</Container>
						</div>
						<div align = "center" style = {{ marginTop: "1em", fontSize: "large" }}>
							{(props.data.cards.length !== 0) ? 
								<div>  
								<img src ={coins} alt="coins" style={{maxWidth: "10%", borderRadius: "2em", paddingRight: "0.5em"}}/>{props.data.coins}
								</div> 
								: <div/>}
						</div>
					</Card.Body>
				</Accordion.Collapse>
			</Card>);
	}
	let i = 0;
	return (
		<Accordion defaultActiveKey="0">
			{
				Object.keys(props.playerDetails).map((key, index) => {
					if (key !== props.ownID) {
						return (<AccordianBody data={props.playerDetails[key]} keyIndex={i++} />);
					}
				})
			}
		</Accordion>
	)
}

export default OtherPlayerInfo;
