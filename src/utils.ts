import { CardType } from "./lib";

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

export const drawCardsFromDeck = (deck: CardType[], numOfCards: number) => {
  return deck.splice(0, numOfCards);
}

export const isPlayerTurn = (turn: 'bot' | 'player') => {
  return turn === 'player';
}