import { useContext } from 'react';
import { motion } from 'framer-motion';
import styled, { ThemeContext } from 'styled-components';
import { CardType } from '../lib';
import Card from './Card';
import Pile from './Pile';
import Score from './Score';
import Info from './Info';
import Menu from './Menu';
import { ElevenMachineContext } from '../context/AppContext';
import { isCardInCards } from '../utils';
import Flop from './Flop';
import Confetti from './Confetti';

const GameBoardContainer = styled(motion.div)`
    padding: ${({ theme }) => (theme?.isMdScreen ? '16px 16px 16px 4px' : '32px 32px 32px 16px')};
    display: grid;
    grid-template-rows: 22% 35% 31%;
    grid-template-columns: ${({ theme }) => (!theme?.isLgScreen ? '12% 88%': '13% auto 13%')};
    box-sizing: border-box;
    height: 100vh;
    row-gap: 6%;
`;

const HandContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    gap: 6px;
`;

const PlayerHandContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    gap: 6px;
    grid-row-start: 3;
    grid-column-start: 2;
`;

export interface GameBoardProps {
    onMenuClick: () => void;
}

export default function GameBoard({ onMenuClick }: GameBoardProps) {
    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);

    const { round, isLastHand, playerCards, botCards, playerSidePile, botSidePile, playerHandSelection, botHandSelection, botPoints, botClubs, playerPoints, playerClubs, botPreviousClubs, playerPreviousClubs } = state.context;

    const theme = useContext(ThemeContext);

    console.log('state');
    console.log(state);
    
    return <GameBoardContainer onClick={() => elevenActorRef.send({ type: 'user.cancelSelection'})}>
        <Score isPlayerScore={false} points={botPoints} clubs={botClubs} previousClubs={botPreviousClubs} />
        <HandContainer>
        {botCards.map((card: CardType, index: number) => (
            <Card
                key={card.code}
                card={card}
                // showBack={true}
                index={index}
                selected={card.code === botHandSelection?.code}
            />
        ))}
        </HandContainer>
        <Info round={round} isLastHand={isLastHand} />
        <Flop />
        {theme?.isLgScreen && <Pile cards={botSidePile} isPlayerSidePile={false} />}
        <Score isPlayerScore={true} points={playerPoints} clubs={playerClubs} previousClubs={playerPreviousClubs} />
        <PlayerHandContainer>
        {playerCards.map((card: CardType, index: number) => (
            <Card
                key={card.code}
                card={card}
                index={index}
                numImages={4}
                onCardClick={() => elevenActorRef.send({type: 'user.selectHandCard', card: card})}
                selected={card.code === playerHandSelection?.code}
            />
        ))}
        </PlayerHandContainer>
        {theme?.isLgScreen && <Pile cards={playerSidePile} />}
        <Menu handleClick={() => elevenActorRef.send({ type: 'user.openMenu' })}/>
        {/* {state.matches({startGame: {startRound: 'playerBonusMove'}}) && <Confetti />} */}
    </GameBoardContainer>;
};