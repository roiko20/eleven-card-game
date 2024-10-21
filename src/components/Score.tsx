import { motion } from 'framer-motion';
import styled from 'styled-components';
import Confetti, { ConfettiType } from './Confetti';

export interface ScoreProps {
    isPlayerScore: boolean;
    points: number;
    clubs: number;
    showConfetti: boolean;
}

const StyledScoreContainer = styled('div')<{ $isPlayerScore: boolean;}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => (theme?.isMdScreen ? '8px' : '12px')};
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
    width: ${({ theme }) => (theme?.isMdScreen ? '2rem' : '3rem')};
    height: ${({ theme }) => (theme?.isMdScreen ? '2rem' : '3rem')};
`;

const StyledScoreItemText = styled('span')`
    font-size: ${({ theme }) => (theme?.isMdScreen ? '24px' : '34px')};
`;

export default function Score({isPlayerScore, points, clubs, showConfetti}: ScoreProps) {
    return (
        <StyledScoreContainer $isPlayerScore={isPlayerScore}>
            <StyledScoreTitle>{isPlayerScore ? 'YOU' : 'BOT'}</StyledScoreTitle>
            <StyledScoreItem>
                <StyledScoreItemIcon src={'/icons/points.png'} />
                <StyledScoreItemText>{points}</StyledScoreItemText>
                {showConfetti && 
                    <Confetti isPlayerScore={isPlayerScore} type={ConfettiType.Bonus} />
                }
            </StyledScoreItem>
            <StyledScoreItem>
                <StyledScoreItemIcon src={'/icons/clubs.svg'} />
                <StyledScoreItemText>{clubs}</StyledScoreItemText>
            </StyledScoreItem>
        </StyledScoreContainer>
      );
}
