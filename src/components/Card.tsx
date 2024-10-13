import { Rank, Suit, CardType } from "../lib";
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { CARD_BACK_SVG_PATH, DROP_AREA_SVG_PATH, createCardSVGPath } from '../utils';

export interface CardProps {
    card?: CardType;
    showBack?: boolean;
    dropArea?: boolean;
    numImages?: number;
    index: number;
    selected?: boolean;
}

export const StyledCard = styled(motion.img)<{ $hidden?: boolean; $numImages?: number;}>`
  max-width: ${({ $numImages }) => ($numImages ? `calc(90% / ${$numImages})` : '100%')};
`;

const getCardAnimation = (index: number, selected: boolean) => {
    if (selected) {
      return {
        scale: 1,
        opacity: 1,
        x: 0,
        y: -15,
        transition: {
          duration: 0.5,
          delay: 0.5
        }
      }
    }
    return {
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.2,
        duartion: 0.1
      }
    }
  }

export default function Card({ card, showBack, dropArea, numImages, index, selected = false }: CardProps) {
    const src = showBack
        ? CARD_BACK_SVG_PATH
        : dropArea
            ? DROP_AREA_SVG_PATH
            : createCardSVGPath(card);
    return (
        <StyledCard
            src={src}
            $numImages={numImages}
            initial={{ opacity: 0, x: -100, scale: 1.2 }}
            animate={getCardAnimation(index, selected)}
            whileHover={!dropArea ? {y: -7, cursor: 'grab'} : {}}
        />
      );
}
