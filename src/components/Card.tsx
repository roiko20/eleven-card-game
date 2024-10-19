import { CardType } from "../lib";
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { CARD_BACK_SVG_PATH, DROP_AREA_SVG_PATH, createCardSVGPath } from '../utils';
import { ElevenMachineContext } from "../context/AppContext";

export interface CardProps {
    card?: CardType;
    showBack?: boolean;
    dropArea?: boolean;
    numImages?: number;
    index: number;
    onCardClick?: () => void;
    selected?: boolean;
}

export const StyledCard = styled(motion.img)<{ $numImages?: number; $selected: boolean; $dropArea: boolean }>`
  max-height: ${({ $numImages }) => ($numImages && $numImages <= 6 && '100%')};
  max-width: ${({ $numImages }) => ($numImages ? `calc(90% / ${$numImages})` : '100%')};
  box-sizing: border-box;
  border: ${({ theme, $selected }) => ($selected && `#ffff00 outset ${theme.isMdScreen ? '4px' : '6px'}`)};
  border-radius: ${({ theme, $selected, $dropArea }) => (
    theme.isMdScreen ? ($dropArea ? '6px' : $selected ? '10px' : '4px')
    : ($dropArea ? '20px' : $selected ? '18px' : '10px')
  )};
  box-shadow: ${({ $selected }) => ($selected ? '4px 4px 18px #424242' : '2px 2px 6px #424242')};
`;

const getCardAnimation = (index: number, selected: boolean, isPlayerTurn: boolean) => {
    if (selected) {
      return {
        y: isPlayerTurn ? -7 : 7,
        zIndex: 10,
        cursor: 'grab'
     }
      // return {
      //   scale: 1,
      //   opacity: 1,
      //   x: 0,
      //   y: -15,
      //   transition: {
      //     duration: 0.5,
      //     delay: 0.5
      //   }
      // }
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

  const getCardHoverAnimation = (dropArea: boolean, grabCursor: boolean) => {
    if (grabCursor && dropArea) {
      return {
        cursor: 'grab',
        scale: 0.99
      }
    }
    if (grabCursor) {
      return {
        y: -7,
        cursor: 'grab'
     }
    }
    return {
       cursor: 'not-allowed'
    }
  }

export default function Card({ card, showBack, dropArea = false, numImages, index, onCardClick, selected = false }: CardProps) {
  const state = ElevenMachineContext.useSelector((state) => state);

  const { isPlayerTurn } = state.context;

  const src = showBack
    ? CARD_BACK_SVG_PATH
      : dropArea
        ? DROP_AREA_SVG_PATH
        : createCardSVGPath(card);

    return (
        <StyledCard
            src={src}
            $numImages={numImages}
            $selected={selected}
            $dropArea={dropArea}
            initial={!selected && { opacity: 0, x: -100, scale: 1.2 }}
            animate={getCardAnimation(index, selected, isPlayerTurn)}
            whileHover={getCardHoverAnimation(dropArea, isPlayerTurn && !!onCardClick)}
            onClick={(e) => {
              e.stopPropagation();
              onCardClick && onCardClick();
            }}
        />
      );
}
