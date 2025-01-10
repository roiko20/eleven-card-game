import styled from 'styled-components';
import ScoreConfetti, { ConfettiType } from './ScoreConfetti';
import { ElevenMachineContext } from '../context/AppContext';
import { useEffect, useState } from 'react';

export interface ScoreProps {
    isPlayerScore: boolean;
    points: number;
    clubs: number;
    previousClubs: number;
}

const StyledScoreContainer = styled('div')<{ $isPlayerScore: boolean;}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => (theme?.isMdScreen ? '6px' : '12px')};
    grid-row-start: ${({ $isPlayerScore }) => ($isPlayerScore && '3')};
    grid-column-start: ${({ $isPlayerScore }) => ($isPlayerScore && '1')};
`;

const StyledScoreTitle = styled('span')`
    font-size: ${({ theme }) => (theme?.isMdScreen ? '24px' : '32px')};
    padding-left: 4px;
`;

const StyledScoreItem = styled('div')`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StyledScoreItemIcon = styled('img')`
    width: ${({ theme }) => (theme?.isMdScreen ? '1.5rem' : '3rem')};
`;

const StyledScoreItemText = styled('span')`
    font-size: ${({ theme }) => (theme?.isMdScreen ? '22px' : '34px')};
`;

export default function Score({ isPlayerScore, points, clubs, previousClubs }: ScoreProps) {
    const [showClubsConfetti, setShowClubsConfetti] = useState(false);
    const state = ElevenMachineContext.useSelector((state) => state);

    useEffect(() => {
        const showBotClubsConfetti = !isPlayerScore && previousClubs < 7 && clubs >= 7;
        const showPlayerClubsConfetti = isPlayerScore && previousClubs < 7 && clubs >= 7;
        setShowClubsConfetti(showBotClubsConfetti || showPlayerClubsConfetti)
    }, [isPlayerScore, previousClubs, clubs]);

    const isBotBonusMove = !isPlayerScore && state.matches({startGame: {startRound: {roundInProgress: {botTurn: 'botBonusMove'}}}});
    const isPlayerBonusMove = isPlayerScore && state.matches({startGame: {startRound: {roundInProgress: {playerTurn: 'playerBonusMove'}}}});

    return (
        <StyledScoreContainer $isPlayerScore={isPlayerScore}>
            <StyledScoreTitle>{isPlayerScore ? 'YOU' : 'BOT'}</StyledScoreTitle>
            <StyledScoreItem>
                <StyledScoreItemIcon src={'/icons/points.png'} />
                <StyledScoreItemText>{points}</StyledScoreItemText>
                {(isBotBonusMove || isPlayerBonusMove) && 
                    <ScoreConfetti isPlayerScore={isPlayerScore} type={ConfettiType.Bonus} />
                }
                {showClubsConfetti &&
                    <ScoreConfetti isPlayerScore={isPlayerScore} type={ConfettiType.Clubs} />
                }
            </StyledScoreItem>
            <StyledScoreItem>
                <StyledScoreItemIcon src={'/icons/clubs.svg'} />
                <StyledScoreItemText>{clubs}</StyledScoreItemText>
            </StyledScoreItem>
        </StyledScoreContainer>
      );
}
