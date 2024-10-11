import { CardType } from "./lib";

export const createCardSVGPath = (card?: CardType) => {
    return card ? (
      CARDS_PREFIX_PATH +
      card.suit +
      "-" +
      card.value +
      ".svg"
    ) : '';
  }

export const CARDS_PREFIX_PATH = "/cards/";
export const CARD_BACK_SVG_PATH = `${CARDS_PREFIX_PATH}BACK.svg`;
export const DROP_AREA_SVG_PATH = `${CARDS_PREFIX_PATH}DROP-AREA.svg`;