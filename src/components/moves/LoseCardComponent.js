/**
 * Component for losing a card (bluff failed, assassinated, or couped)
 */

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getPlayerData, updatePlayerCards } from '../../api/playerApi';
import { getRoomData, updateRoomCards } from '../../api/roomApi';
import { useTurnData } from '../../hooks';
import { updateCardDeckBluff, convertToViewableCards } from '../../utils/cardHelpers';
import PlayCard from '../PlayCard';
import cardStyles from '../../styles/Card.module.scss';
import styles from './PerformMoves.module.scss';

export const LoseCardComponent = ({ title, roomName, playerID, turn, confirmFunction }) => {
  const [cards, setCards] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [chosenKeys, setChosenKeys] = useState(new Set());
  const { turnData } = useTurnData(roomName, turn);
  const cardsToChoose = 1;

  useEffect(() => {
    const loadPlayerCards = async () => {
      try {
        const playerData = await getPlayerData(roomName, playerID);
        const viewCards = convertToViewableCards(playerData.cards || []);
        setCards(viewCards);
      } catch (error) {
        console.error('Error loading player cards:', error);
      }
    };

    loadPlayerCards();
  }, [roomName, playerID]);

  useEffect(() => {
    if (turnData?.ambassadorBluff) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [turnData]);

  const handleClick = async () => {
    setDisabled(true);

    try {
      const chosenCards = cards
        .filter(card => !chosenKeys.has(card[1]))
        .map(card => card[0]);

      await updatePlayerCards(roomName, playerID, chosenCards);

      const roomData = await getRoomData(roomName);
      const updatedCards = updateCardDeckBluff(cards, chosenKeys, roomData.cards);
      await updateRoomCards(roomName, updatedCards);

      confirmFunction();
    } catch (error) {
      console.error('Error losing card:', error);
      setDisabled(false);
    }
  };

  const selectCard = (card) => () => {
    const newChosenKeys = new Set(chosenKeys);
    if (newChosenKeys.has(card[1])) {
      newChosenKeys.delete(card[1]);
    } else {
      if (newChosenKeys.size === cardsToChoose) {
        const iterator = newChosenKeys.values();
        newChosenKeys.delete(iterator.next().value);
      }
      newChosenKeys.add(card[1]);
    }
    setChosenKeys(newChosenKeys);
  };

  return (
    <div>
      <h3 className={styles.cardSelectionTitle}>{title}</h3>
      <Container className={styles.cardSelectionContainer}>
        <Row>
          {cards.map(card => (
            <Col key={card[1]}>
              <div
                className={`${
                  chosenKeys.has(card[1]) ? cardStyles.Selected : cardStyles.Highlight
                } ${styles.cardWrapper}`}
                onClick={selectCard(card)}
              >
                <PlayCard cardName={card[0]} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <button
        type="button"
        className={`btn btn-lg btn-success ${styles.actionButton}`}
        disabled={isDisabled || cardsToChoose !== chosenKeys.size}
        onClick={handleClick}
      >
        Confirm
      </button>
    </div>
  );
};
