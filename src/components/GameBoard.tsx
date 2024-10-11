import { useContext } from 'react';
import { motion } from 'framer-motion';
import styled, { ThemeContext } from 'styled-components';
import { CardType } from '../lib';
import Card from './Card';
import Pile from './Pile';
import Score from './Score';
import DropArea from './DropArea';
import Info from './Info';
import Menu from './Menu';

const GameBoardContainer = styled(motion.div)`
    padding: ${({ theme }) => (theme?.isMdScreen ? '16px 16px 16px 4px' : '32px 32px 32px 16px')};
    display: grid;
    grid-template-rows: 22% 36% 30%;
    grid-template-columns: ${({ theme }) => (!theme?.isLgScreen ? '12% 88%': '13% auto 13%')};
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

const FlopContainer = styled(motion.div)<{ $numImages: number;}>`
    display: flex;
    justify-content: center;
    gap: 4px;
    grid-column-start: ${({ theme, $numImages }) => ($numImages > 6 && (theme?.isMdScreen ? 'span 1': 'span 2'))};
`;

export interface GameBoardProps {
    cards: CardType[];
    onMenuClick: () => void;
}

export default function GameBoard({ cards, onMenuClick }: GameBoardProps) {
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
        <Info isLastHand={false} />
        <FlopContainer $numImages={16}>
            <DropArea numImages={16} />
            {cards.slice(0,15).map((card: CardType, index: number) => (
                <Card
                    key={index}
                    card={card}
                    numImages={16}
                    index={index}
                />
            ))}
        </FlopContainer>
        {theme?.isLgScreen && <Pile cards={cards.slice(0,4)} isPlayerSidePile={false} />}
        <Score cards={cards} isPlayerScore={true}/>
        <PlayerHandContainer>
        {cards.slice(0,4).map((card: CardType, index: number) => (
            <Card
                key={card.code}
                card={card}
                index={index}
                numImages={4}
            />
        ))}
        </PlayerHandContainer>
        {theme?.isLgScreen && <Pile cards={cards.slice(0, 4)} isPlayerSidePile={true} />}
        <Menu handleClick={onMenuClick}/>
    </GameBoardContainer>;
};