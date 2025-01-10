import { useContext } from 'react';
import { motion } from 'framer-motion';
import styled, { ThemeContext } from 'styled-components';
import Pile from './Pile';
import Score from './Score';
import Info from './Info';
import Menu from './Menu';
import { ElevenMachineContext } from '../context/AppContext';
import Flop from './Flop';
import Confetti from './Confetti';
import Loader from './Loader';
import BotHand from './BotHand';
import PlayerHand from './PlayerHand';

const GameBoardContainer = styled(motion.div)`
    padding: ${({ theme }) => (theme?.isMdScreen ? '16px 16px 16px 4px' : '32px 32px 32px 16px')};
    display: grid;
    grid-template-rows: 22% 35% 31%;
    grid-template-columns: ${({ theme }) => (theme?.isPortrait ? '12% 88%' : '13% auto 13%')};
    box-sizing: border-box;
    height: 100vh;
    row-gap: 6%;
`;

export default function GameBoard() {
    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);

    const { round, isLastHand, playerSidePile, botSidePile, botPoints, botClubs, playerPoints, playerClubs, botPreviousClubs, playerPreviousClubs } = state.context;

    const theme = useContext(ThemeContext);

    if (state.matches({startGame: 'loading'})) {
        return <Loader />
    }
    
    return <GameBoardContainer onClick={() => elevenActorRef.send({ type: 'user.cancelSelection'})}>
        <Menu handleClick={() => elevenActorRef.send({ type: 'user.openMenu' })} />
        <Score
            isPlayerScore={false}
            points={botPoints}
            clubs={botClubs}
            previousClubs={botPreviousClubs}
        />
        <BotHand />
        {!theme?.isPortrait
            && <Pile
                    cards={botSidePile}
                    isPlayerSidePile={false}
                />
        }
        <Info
            round={round}
            isLastHand={isLastHand}
        />
        <Flop />
        <Score
            isPlayerScore={true}
            points={playerPoints}
            clubs={playerClubs}
            previousClubs={playerPreviousClubs}
        />
        <PlayerHand />
        {!theme?.isPortrait
            && <Pile
                    cards={playerSidePile}
                />
        }
        {state.matches('gameOver') && <Confetti />}
    </GameBoardContainer>;
};