import { assign } from "xstate";
import { cardsData, CardType } from "./lib";

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
    // const cards = await fetchDeck();
    const cards = cardsData;
  
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

export const dealCards = (deck: CardType[], isPlayerTurn: boolean) => {
  let playerCards;
  let botCards;
  if (isPlayerTurn) {
    playerCards = deck.slice(0, 4);
    botCards = deck.slice(4, 8)
  }
  else {
    botCards = deck.slice(0, 4);
    playerCards = deck.slice(4, 8)
  }
  const flopCards = deck.slice(8, 12);
  return { playerCards, botCards, flopCards };
};

export const isPlayerTurn = (turn: 'bot' | 'player') => {
  return turn === 'player';
}

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
    console.log(flopCards.length === 1 && playerHandCard.value === flopCards[1].value);
    return flopCards.length === 1 && playerHandCard.value === flopCards[1].value;
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

// export const jackCollect = (playerHandCard: CardType | null, flopCards: CardType[]) => {
//     // some player card must be selected
//     if (!playerHandCard) {
//       console.log('return false - no hand card selected');
//       return false;
//     }
//   if (isValidJackMove(playerHandCard, flopCards))
// }

export const selectNonRoyaltyCards = (cards: CardType[]) => {
  return cards.filter(card => !isRoyalty(card));
}