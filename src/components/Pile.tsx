import React, { useEffect, useRef } from 'react';
import { CardType } from '../lib';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface PileProps {
    cards: CardType[];
    isPlayerSidePile?: boolean;
}

const PileContainer = styled(motion.div)<{ $isPlayerSidePile?: boolean; }>`
  grid-row-start: ${({ $isPlayerSidePile }) => ($isPlayerSidePile ? '3' : '1')};
  grid-column-start: 3;
  position: relative;
  margin-right: ${({ theme }) => (theme?.isLgScreen ? '24px' : '16px')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PileCard = styled(motion.img)<{ index: number; $isPlayerSidePile?: boolean; }>`
    position: absolute;
    right: ${({ index, $isPlayerSidePile }) => (`${index * ($isPlayerSidePile ? -1.35 : -0.7)}px`)};
    height: ${({ theme }) => (theme?.isLgScreen ? '90%' : '80%')};
    border-radius: ${({ $isPlayerSidePile }) => $isPlayerSidePile ? '8px' : '4px'};
    box-shadow: ${({ $isPlayerSidePile }) => ($isPlayerSidePile ? '1px 1px 4px #424242' : '1px 1px 2.5px #424242')};
`;

const Pile: React.FC<PileProps> = ({ cards, isPlayerSidePile = true }) => {
  const previousCardsLengthRef = useRef(0);
  useEffect(() => {
    // Update ref with the current length of cards after render
    previousCardsLengthRef.current = cards.length;
  });
  return (
    <PileContainer
      $isPlayerSidePile={isPlayerSidePile}
    >
        {/* Render the side pile cards */}
        {cards.map((card: CardType, index: number) => (
            <PileCard
              key={index}
              index={index}
              initial={{ opacity: 0, x: "-45vw", y: isPlayerSidePile ? "-45vh" : "45vh" }}
              animate={{ opacity: 1, x: 0, y: 0, transition: { delay: 0.2 * (index - previousCardsLengthRef.current), duration: 0.3}}}
              src={'/cards/BACK.svg'} 
              alt={card.code}
              $isPlayerSidePile={isPlayerSidePile}
            />
        ))}
    </PileContainer>
  );
};

export default Pile;