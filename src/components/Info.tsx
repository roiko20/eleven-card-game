import styled from 'styled-components';

export interface InfoProps {
    round: number;
    isLastHand: boolean;
}

const StyledInfoContainer = styled('div')`
    grid-row-start: 2;
    grid-column-start: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => (theme?.isMdScreen ? '14px' : '24px')};
`;

const StyledRoundTextContainer = styled('span')`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
`;

const StyledRoundText = styled('span')`
    font-size: ${({ theme }) => (theme?.isPortrait ? '22px' : (theme?.isMdScreen ? '18px' : '24px'))};
    text-align: center;
`;

const StyledRoundCount = styled('span')`
    font-size: ${({ theme }) => (theme?.isMdScreen ? '24px' : '32px')};
    text-align: center;
`;

const StyledLastHandContainer = styled('div')`
    display: flex;
    align-items: center;
    gap: 4px;
    text-align: center;
`;

const StyledLastHandItemIcon = styled('img')`
    width: ${({ theme }) => (theme?.isMdScreen ? '1.5rem' : '2.3rem')};
    height: ${({ theme }) => (theme?.isMdScreen ? '1.5rem' : '2.3rem')};
`;

const StyledLastHandText = styled('span')`
    font-size: ${({ theme }) => (theme?.isMdScreen ? '14px' : '20px')};
    text-align: center;
`;

export default function Info({round, isLastHand}: InfoProps) {

    return (
        <StyledInfoContainer>
            <StyledRoundTextContainer>
                <StyledRoundText>Round</StyledRoundText>
                <StyledRoundCount>{round}</StyledRoundCount>
            </StyledRoundTextContainer>
            {isLastHand &&
            <StyledLastHandContainer>
                <StyledLastHandItemIcon src={'/icons/lastHand.png'} />
                <StyledLastHandText>Last<br/>Hand</StyledLastHandText>
            </StyledLastHandContainer>
            }
        </StyledInfoContainer>
    );
};