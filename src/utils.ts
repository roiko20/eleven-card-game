import { assign } from "xstate";
import { cardsData, soorDeck, CardType, Move } from "./lib";

export const CARDS_PREFIX_PATH = "/cards/";
export const CARD_BACK_SVG_PATH = `${CARDS_PREFIX_PATH}BACK.svg`;
export const DROP_AREA_SVG_PATH = `${CARDS_PREFIX_PATH}DROP-AREA.svg`;

export const createCardSVGPath = (card?: CardType) => {
  return card ? (
    CARDS_PREFIX_PATH +
    card.suit +
    "-" +
    card.value +
    ".svg"
  )
  : '';
}

const preloadImage = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

export const fetchDeck = async () => {
  const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');
  const data = await response.json();
  return data.cards;
}

export const fetchResources = async () => {
  try {
    // draw deck
    const cards = await fetchDeck();
    // const cards = cardsData;
    // const cards = soorDeck;
  
    // preload SVGs
    const cardImagePromises = cards.map((card: CardType) => preloadImage(createCardSVGPath(card)));
    cardImagePromises.push(preloadImage(DROP_AREA_SVG_PATH));
    cardImagePromises.push(preloadImage(CARD_BACK_SVG_PATH));
    await Promise.all(cardImagePromises);

    return cards;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}

export const dealCards = (deck: CardType[], isPlayerTurn: boolean, dealFlop: boolean) => {
  let playerCards;
  let botCards;
  let flopCards;
  if (isPlayerTurn) {
    playerCards = deck.slice(0, 4);
    botCards = deck.slice(4, 8)
  }
  else {
    botCards = deck.slice(0, 4);
    playerCards = deck.slice(4, 8)
  }
  if (dealFlop) {
    flopCards = deck.slice(8, 12);
  }
  return { playerCards, botCards, flopCards };
};

export const compareCards = (card1: CardType | null, card2: CardType| null) => {
  return card1 && card2 && card1.code === card2.code;
}

export const isCardInCards = (card: CardType, cards: CardType[]) => {
  return cards.some(c => compareCards(c, card))
}

export const removeCardsFromCards = (cardsToRemove: CardType[], cards: CardType[]) => {
  return cards.filter(card => !isCardInCards(card, cardsToRemove));
}

const getCardValueByCode = (cardCode: string) => {
  // Get the first char of the card code
  const cardStrChar = cardCode.charAt(0);
  // Ace is 1
  if (cardStrChar === 'A') return 1;
  // Get the card numeric value
  const cardIntChar = parseInt(cardStrChar);
  // 0 is 10
  if (cardIntChar === 0) return 10;
  // Return the number if it is one
  if (!isNaN(cardIntChar)) return cardIntChar;
  // Royalty - return 12 to fail
  return 12;
}

export const getCardRank = (card: CardType): number => {
  // Clubs winner is whoever has at least 7 clubs - 13 points => each club is 13/7 = 1.85 points
  // 10 of diamonds - 3 points
  if (card.code === '0D') return 3;
  // Dudula (2 of clubs) - 2 points + club
  if (card.code === '2C') return 3.85;
  // Jack is 1 point + club
  if (card.code === 'JC') return 2.85;
  // Ace is 1 point + club
  if (card.code === 'AC') return 2.85;
  // Get the first char of the card code
  const cardStrChar = card.code.charAt(0);
  // jack is 1 point
  if (cardStrChar === 'J') return 1;
  // ace is 1 point
  if (cardStrChar === 'A') return 1;
  // Get the card suit value
  const cardSuitStrChar = card.code.charAt(1);
  // club is 1.85 points (13/7)
  if (cardSuitStrChar === 'C') return 1.85;
  // no points for other cards
  return 0;
}

export const getCardScore = (card: CardType): number => {
  // 10 diamonds - 3 points
  if (card.code === '0D') return 3;
  // Dudula (2 of clubs) - 2 points
  if (card.code === '2C') return 2;
  // jack - 1 point
  if (card.value === 'JACK') return 1;
  // ace - 1 point
  if (card.value === 'ACE') return 1;
  // no points for other cards
  return 0;
}

export const getMoveRank = (cards: CardType[]) => {
  return cards.reduce((rank, card) => rank + getCardRank(card), 0);
}

export const getCardsScore = (cards: CardType[], currentNumOfClubs: number) => {
  const cardsScore = cards.reduce((score, card) => score + getCardScore(card), 0);
  const updatedNumOfClubs = currentNumOfClubs + getNumOfClubs(cards);
  const scoredMostClubs = currentNumOfClubs < 7 && updatedNumOfClubs >= 7;
  return scoredMostClubs ? cardsScore + 13 : cardsScore;
}

const isClub = (card: CardType) => {
  return card.suit === 'CLUBS';
}

export const getNumOfClubs = (cards: CardType[]) => {
  return cards.reduce((numOfClubs, card) => numOfClubs + Number(isClub(card)), 0);
}

const getCardsValuesSum = (cards: CardType[]) => {
  return cards.reduce((sum, card) => {
    const cardValue = getCardValueByCode(card.code);
    return sum + cardValue;
  }, 0);
}

export const isValidMove = (playerHandCard: CardType | null, flopCards: CardType[]) => {
  console.log('in is valid move');
  // some player card must be selected
  if (!playerHandCard) {
    console.log('return false - no hand card selected');
    return false;
  }
  // jack hand card played - pick up all flop cards except kings and queens
  // if (isValidJackMove(playerHandCard, flopCards)) {
  //   //handle Jack Move
  //   console.log('return true - valid jack selection');
  //   return true;
  // }
  // some flop cards must be selected too
  if (flopCards.length === 0) {
    console.log('return false - no flop cards selected');
    return false;
  }
  // king/queen selection
  if (playerHandCard?.value === 'QUEEN' || playerHandCard?.value === 'KING') {
    console.log('royalty selected, return:');
    console.log(flopCards.length === 1 && playerHandCard.value === flopCards[0].value);
    return flopCards.length === 1 && playerHandCard.value === flopCards[0].value;
  }
  // sum of eleven selection
  if (getCardsValuesSum([playerHandCard, ...flopCards]) === 11) {
    console.log('return true - sum of 11');
    return true;
  }
  // invalid move
  console.log('return false');
  return false;
}

export const isValidJackMove = (card: CardType| null, flopCards: CardType[]) => {
  return card?.value === 'JACK' && cardsHaveNonRoyaltyCards(flopCards);
}

const isRoyalty = (card: CardType) => {
  return card.value === 'KING' || card.value === 'QUEEN'
}

const cardsHaveNonRoyaltyCards = (cards: CardType[]) => {
  return cards.some(card => !isRoyalty(card));
}

export const selectCardsByRoyalty = (cards: CardType[], isRoyaltyFilter: boolean) => {
  return cards.filter(card => isRoyalty(card) === isRoyaltyFilter);
}

export const getBestMove = (hand: CardType[], flop: CardType[]): Move | null => {
  let validMoves: Move[] = [];

  const pickCardsFromFlop = (pickedCards: CardType[], remainingFlop: CardType[]) => {
    const sumOfPickedCards = pickedCards.reduce((accumulator, pickedCard) => accumulator + getCardValueByCode(pickedCard.code), 0);

    if (sumOfPickedCards === 11) {
      validMoves.push({
        handCard: pickedCards[0],
        flopCards: pickedCards.slice(1),
        scoreRank: getMoveRank(pickedCards),
      });
      // foundValidMove = true;
      // return; // Terminate the recursion for this starting card
    }

    if (remainingFlop.length === 0) return; // Terminate the recursion if no more cards

    for (let i = 0; i < remainingFlop.length; i++) {
      const cardToCheck = remainingFlop[i];

      // sum is less than 11 - try finding more flop cards to complete a valid move
      if (sumOfPickedCards + getCardValueByCode(cardToCheck.code) <= 11) {
        pickCardsFromFlop([...pickedCards, cardToCheck], remainingFlop.slice(i + 1));
      }
    }
  }

  for (const cardInHand of hand) {
    // check jack move
    if (cardInHand.value === 'JACK') {
      const nonRoyaltyCards = selectCardsByRoyalty(flop, false);
      // jack pick up is allowed only if there are non-royality cards in flop
      if (nonRoyaltyCards.length > 0) {
        validMoves.push({
          handCard: cardInHand,
          flopCards: nonRoyaltyCards,
          scoreRank: getMoveRank([cardInHand, ...nonRoyaltyCards])
        })
      }
    }
    // check king/queen move
    else if (isRoyalty(cardInHand)) {
      const optionalRoyalityCardsToPickUp = flop.filter((card) => card.value === cardInHand.value);
      optionalRoyalityCardsToPickUp.forEach(optionalRoyalityCardToPickUp => {
        validMoves.push({
          handCard: cardInHand,
          flopCards: [optionalRoyalityCardToPickUp],
          scoreRank: getMoveRank([cardInHand, optionalRoyalityCardToPickUp])
        })
      })
    }
    // check sum of eleven move
    pickCardsFromFlop([cardInHand], flop);
  }

  console.log('valid moves:');
  console.log(validMoves);

  // no moves found
  if (validMoves.length === 0) {
    return null;
  }

  const bestMove = validMoves.reduce((bestMove, currentMove) => {
    return currentMove.scoreRank > bestMove.scoreRank ? currentMove : bestMove;
  }, validMoves[0]);

  console.log('best move:');
  console.log(bestMove);

  return bestMove;
}

export const getBestCardToDrop = (cards: CardType[]) => {
  return cards.reduce((minCard, currentCard) => {
    const minScore = getCardRank(minCard);
    const currentScore = getCardRank(currentCard);

    return currentScore < minScore ? currentCard : minCard;
  });
}

export const shuffleDeck = (cards: CardType[]) => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}