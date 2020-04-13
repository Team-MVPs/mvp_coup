import React from 'react';
import { firestore } from '../config/firebase';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import PlayCard from '../components/PlayCard.js';

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
										{(props.data.cards.length >= 1) ? <PlayCard cardName={"back"}/> : <div/>}
									</Col>
									<Col xs={6}>
										{(props.data.cards.length == 2) ? <PlayCard cardName={"back"}/> : <div/>}
									</Col>
								</Row>
							</Container>
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