import React, { useEffect, useRef } from 'react';
import { CardType } from '../lib';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface PileProps {
    cards: CardType[];
    isPlayerSidePile: boolean;
}

const PileContainer = styled(motion.div)<{ $isPlayerSidePile?: boolean; }>`
  grid-row-start: ${({ $isPlayerSidePile }) => ($isPlayerSidePile ? '3' : '1')};
  grid-column-start: 3;
  position: relative;
  margin-right: 36px;
//   margin-top: ${({ $isPlayerSidePile }) => ($isPlayerSidePile && '44px')};
//   margin-bottom: ${({ $isPlayerSidePile, theme }) => ($isPlayerSidePile && theme?.isMdScreen && '44px')};
`;

const PileCard = styled(motion.img)<{ index: number; $isPlayerSidePile?: boolean; }>`
    position: absolute;
    right: ${({ index }) => (`${index * -2.5}px`)};
    height: 100%;
    box-shadow: 0px 0px 2px rgba(0,0,0,0.75);
`;

const Pile: React.FC<PileProps> = ({ cards, isPlayerSidePile }) => {
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
              initial={{ opacity: 0, x: "-50vw", y: isPlayerSidePile ? "-50vh" : "50vh" }}
              animate={{ opacity: 1, x: 0, y: 0, transition: { delay: 0.2 * (index - previousCardsLengthRef.current), duration: 0.2, type: "tween"}}}
              src={'/cards/BACK.svg'} 
              alt={card.code}
              $isPlayerSidePile={isPlayerSidePile}
            />
        ))}
    </PileContainer>
  );
};

export default Pile;