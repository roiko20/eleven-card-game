import React, { useContext } from 'react';
import { CardType } from "../lib";
import { motion } from 'framer-motion';
import styled, { ThemeContext } from 'styled-components';

export interface ScoreProps {
    isPlayerScore: boolean;
    cards?: CardType[];
}

const StyledScoreContainer = styled('div')<{ $isPlayerScore: boolean;}>`
    width: fit-content;
    height: fit-content;
    display: flex;
    margin: auto;
    // margin-left: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    grid-row-start: ${({ $isPlayerScore }) => ($isPlayerScore && '3')};
    grid-column-start: ${({ $isPlayerScore }) => ($isPlayerScore && '1')};
    // margin-top: ${({ $isPlayerScore }) => ($isPlayerScore && 'auto')};
    margin-left: 12px;
    // background-color: white;
    // border-radius: 8px;
    // padding: 8px;
`;

const StyledScoreTitle = styled('span')`
    font-size: clamp(16px, 5vh, 32px);
`;

const StyledPointsContainer = styled('div')`
    display: flex;
    // flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    gap: 4px;
`;

const StyledScoreItem = styled('div')`
    display: flex;
    alignItems: center;
    justifyContent: center;
    gap: 6px;
`;

const StyledScoreItemIcon = styled('img')`
    width: 5vh;
`;

const StyledScoreItemText = styled('span')`
    font-size: clamp(16px, 5vh, 32px);
`;

export default function Score({isPlayerScore, cards}: ScoreProps) {
    const theme = useContext(ThemeContext);
    return (
        <StyledScoreContainer $isPlayerScore={isPlayerScore}>
            <StyledScoreTitle>{isPlayerScore ? 'YOU' : theme?.isSmScreen ? 'PC' : 'COMPUTER'}</StyledScoreTitle>
            <StyledScoreItem>
                    <StyledScoreItemIcon src={'/icons/points.svg'} />
                    <StyledScoreItemText>20</StyledScoreItemText>
                </StyledScoreItem>
            <StyledPointsContainer>
                <StyledScoreItem>
                    <StyledScoreItemIcon src={'/icons/clubs.svg'} />
                    <StyledScoreItemText>40</StyledScoreItemText>
                </StyledScoreItem>
                <StyledScoreItem>
                    <StyledScoreItemIcon src={'/icons/joker.svg'} />
                    <StyledScoreItemText>46</StyledScoreItemText>
                </StyledScoreItem>
            </StyledPointsContainer>
        </StyledScoreContainer>
      );
}
