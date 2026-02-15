import React from 'react';
import ambassador from '../images/ambassador.JPG';
import assassin from '../images/assasin.JPG';
import back from '../images/back.JPG';
import captain from '../images/captain.JPG';
import contessa from '../images/contessa.JPG';
import duke from '../images/duke.JPG';
import { CharacterType } from '../types';
import styles from './PlayCard.module.scss';

interface PlayCardProps {
    cardName?: CharacterType | string;
}

const PlayCard: React.FC<PlayCardProps> = ({ cardName }) => {
    switch(cardName){
        case "Duke": {
            return (<div className={styles.cardWrapper}>
                <img src={duke} alt={cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Duke</div>
            </div>);
        }
        case "Assassin": {
            return (<div className={styles.cardWrapper}>
                <img src={assassin} alt={cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Assassin</div>
            </div>);
        }
        case "Contessa": {
            return (<div className={styles.cardWrapper}>
                <img src={contessa} alt={cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Contessa</div>
            </div>);
        }
        case "Captain": {
            return (<div className={styles.cardWrapper}>
                <img src={captain} alt={cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Captain</div>
            </div>);
        }
        case "Ambassador": {
            return (<div className={styles.cardWrapper}>
                <img src={ambassador} alt={cardName} className={styles.cardImage} />
                <div className={styles.cardLabel}>Ambassador</div>
            </div>);
        }
        default: {
            return (<div className={styles.cardWrapper}>
                <img src={back} alt={cardName || "Card back"} className={styles.cardImage} />
            </div>);
        }
    }
};

export default PlayCard;
