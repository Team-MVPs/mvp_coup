import React from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import PlayCard from '../components/PlayCard.js';
import coins from '../images/coins.jpg';
import styles from './OtherPlayerInfoComponent.module.scss';

function OtherPlayerInfo(props) {
	function AccordianBody(props) {
		return (
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey={props.keyIndex}>
					<Row>
						<Col>
							{props.data.name} [{props.data.cards.length} card(s) left!]
						</Col>
						<Col align="right">
							Current Coin Count: {props.data.coins}
						</Col>
					</Row>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={props.keyIndex}>
					<Card.Body>
						<div>
							<Container className={styles.cardsContainer}>
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
						<div align = "center" className={styles.coinsDisplay}>
							{(props.data.cards.length !== 0) ?
								<div>
								<img src ={coins} alt="coins" className={styles.coinIcon}/>{props.data.coins}
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
						return (<AccordianBody key={key} data={props.playerDetails[key]} keyIndex={i++} />);
					}
					return null;
				})
			}
		</Accordion>
	)
}

export default OtherPlayerInfo;
