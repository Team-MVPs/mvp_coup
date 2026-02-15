import React from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import PlayCard from '../components/PlayCard';
import coins from '../images/coins.jpg';
import { Player } from '../types';
import styles from './OtherPlayerInfoComponent.module.scss';

interface PlayerDetails {
	[playerID: string]: Player & { name: string };
}

interface OtherPlayerInfoProps {
	playerDetails: PlayerDetails;
	ownID: string;
}

interface AccordianBodyProps {
	data: Player & { name: string };
	keyIndex: number;
}

const OtherPlayerInfo: React.FC<OtherPlayerInfoProps> = ({ playerDetails, ownID }) => {
	const AccordianBody: React.FC<AccordianBodyProps> = ({ data, keyIndex }) => {
		return (
			<Card>
				<Accordion.Toggle as={Card.Header} eventKey={keyIndex.toString()}>
					<Row>
						<Col>
							{data.name} [{data.cards.length} card(s) left!]
						</Col>
						<Col className="text-right">
							Current Coin Count: {data.coins}
						</Col>
					</Row>
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={keyIndex.toString()}>
					<Card.Body>
						<div>
							<Container className={styles.cardsContainer}>
								<Row>
									<Col xs={6}>
										{(data.cards.length >= 1) ? <PlayCard cardName={"back"}/> : <div>Out Of game, what a loser!</div>}
									</Col>
									<Col xs={6}>
										{(data.cards.length === 2) ? <PlayCard cardName={"back"}/> : <div/>}
									</Col>
								</Row>
							</Container>
						</div>
						<div className={`text-center ${styles.coinsDisplay}`}>
							{(data.cards.length !== 0) ?
								<div>
								<img src ={coins} alt="coins" className={styles.coinIcon}/>{data.coins}
								</div>
								: <div/>}
						</div>
					</Card.Body>
				</Accordion.Collapse>
			</Card>);
	};

	let i = 0;
	return (
		<Accordion defaultActiveKey="0">
			{
				Object.keys(playerDetails).map((key) => {
					if (key !== ownID) {
						return (<AccordianBody key={key} data={playerDetails[key]} keyIndex={i++} />);
					}
					return null;
				})
			}
		</Accordion>
	);
};

export default OtherPlayerInfo;
