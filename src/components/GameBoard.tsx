import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import styled, { ThemeContext } from 'styled-components';
import { CardType } from '../lib';
import Card from './Card';
import Pile from './Pile';
import useScreenSize from '../hooks/useScreenSize';
import Score from './Score';
import DropArea from './DropArea';

const GameBoardContainer = styled(motion.div)`
    padding: ${({ theme }) => (theme?.isSmScreen ? '8px' : theme?.isMdScreen ? '16px' : '32px')};
    display: grid;
    grid-template-rows: 22% 36% 30%;
    grid-template-columns: ${({ theme }) => (!theme?.isLgScreen ? '20% 75%': '25% auto 25%')};
    box-sizing: border-box;
    height: 100vh;
    row-gap: 6%;
`;

const HandContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    gap: 4px;
`;

const PlayerHandContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    gap: 4px;
    grid-row-start: 3;
    grid-column-start: 2;
`;

const FlopContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    gap: 4px;
    grid-column-start: ${({ theme }) => (!theme?.isLgScreen ? 'span 2': 'span 3')};
`;

export interface GameBoardProps {
    cards: CardType[];
}

export default function GameBoard({ cards }: GameBoardProps) {
    const theme = useContext(ThemeContext);

    return <GameBoardContainer>
        <Score cards={cards} isPlayerScore={false}/>
        <HandContainer>
        {cards.slice(0,4).map((card: CardType, index: number) => (
            <Card
                key={card.code}
                card={card}
                showBack={true}
                index={index}
            />
        ))}
        </HandContainer>
        <FlopContainer>
            {/* <DropArea /> */}
            <Card card={cards[0]} dropArea={true} numImages={5} index={-1}/>
            {cards.slice(0,4).map((card: CardType, index: number) => (
                <Card
                    key={index}
                    card={card}
                    numImages={5}
                    index={index}
                />
            ))}
        </FlopContainer>
        {theme?.isLgScreen && <Pile cards={cards.slice(0, 4)} isPlayerSidePile={false} />}
        <Score cards={cards} isPlayerScore={true}/>
        <PlayerHandContainer>
        {cards.slice(0,4).map((card: CardType, index: number) => (
            <Card
                key={card.code}
                card={card}
                index={index}
                numImages={theme?.isSmScreen ? 4 : 0}
            />
        ))}
        </PlayerHandContainer>
        {theme?.isLgScreen && <Pile cards={cards.slice(0, 4)} isPlayerSidePile={true} />}
    </GameBoardContainer>;
};