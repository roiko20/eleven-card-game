import styled from 'styled-components';

export interface MenuProps {
    handleClick: () => void;
}

const StyledMenuItemContainer = styled('div')`
    position: absolute;
    top: ${({ theme }) => theme?.isMdScreen ? '4px' : '10px'};
    left: ${({ theme }) => theme?.isMdScreen ? '0' : '2px'};
    cursor: pointer;
`;

const StyledMenuItem = styled('img')`
    width: ${({ theme }) => theme?.isMdScreen ? '36px' : '64px'};
    height: ${({ theme }) => theme?.isMdScreen ? '36px' : '64px'};
`;

export default function Menu({handleClick}: MenuProps) {
    return (
        <StyledMenuItemContainer onClick={handleClick}>
            <StyledMenuItem src={'/icons/menu.png'} />
        </StyledMenuItemContainer>
    )
};