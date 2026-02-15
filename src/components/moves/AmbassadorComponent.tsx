/**
 * Ambassador move component - allows player to exchange cards
 */

import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getPlayerData, updatePlayerCards } from '../../api/playerApi';
import { getRoomData, updateRoomCards } from '../../api/roomApi';
import { incrementTurn } from '../../api/gameApi';
import { setAmbassadorBluff } from '../../api/turnApi';
import { updateCardDeck } from '../../utils/cardHelpers';
import PlayCard from '../PlayCard';
import cardStyles from '../../styles/Card.module.scss';
import styles from './PerformMoves.module.scss';

export const AmbassadorComponent = ({
  roomName,
  playerID,
  ambassadorBluff,
  turn,
  totalPlayers,
  playerNames,
}) => {
  const [cards, setCards] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const [cardsToChoose, setCardsToChoose] = useState(0);
  const [chosenKeys, setChosenKeys] = useState(new Set());

  useEffect(() => {
    const loadCards = async () => {
      try {
        const roomData = await getRoomData(roomName);
        const playerData = await getPlayerData(roomName, playerID);

        const viewCards = [
          [roomData.cards[0], 1],
          [roomData.cards[1], 2],
        ];

        if (playerData.cards && playerData.cards.length > 1) {
          setCardsToChoose(2);
          viewCards.push([playerData.cards[0], 3], [playerData.cards[1], 4]);
        } else {
          setCardsToChoose(1);
          viewCards.push([playerData.cards[0], 3]);
        }

        setCards(viewCards);
      } catch (error) {
        console.error('Error loading ambassador cards:', error);
      }
    };

    loadCards();
  }, [roomName, playerID]);

  const handleClick = async () => {
    setDisabled(true);

    try {
      const chosenCards = cards
        .filter(card => chosenKeys.has(card[1]))
        .map(card => card[0]);

      await updatePlayerCards(roomName, playerID, chosenCards);

      const roomData = await getRoomData(roomName);
      let allCards = [...roomData.cards];
      allCards.shift();
      allCards.shift();
      const updatedCards = updateCardDeck(cards, chosenKeys, allCards);
      await updateRoomCards(roomName, updatedCards);

      if (!ambassadorBluff) {
        await incrementTurn(roomName, totalPlayers, playerNames);
      } else {
        await setAmbassadorBluff(roomName, turn, false);
      }
    } catch (error) {
      console.error('Error executing ambassador move:', error);
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
      <h3 className={styles.cardSelectionTitle}>Choose {cardsToChoose}</h3>
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
