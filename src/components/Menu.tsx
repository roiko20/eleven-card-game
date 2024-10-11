import styled from 'styled-components';

export interface MenuProps {
    handleClick: () => void;
}

const StyledMenuItemContainer = styled('div')`
    position: absolute;
    bottom: 6px;
    right: ${({ theme }) => (theme?.isMdScreen && '2px')};
    left: ${({ theme }) => (theme?.isLgScreen && '2px')};
    cursor: pointer;
`;

const StyledMenuItem = styled('img')`
    width: ${({ theme }) => (theme?.isMdScreen ? '3rem' : '3.5rem')};
    height: ${({ theme }) => (theme?.isMdScreen ? '3rem' : '3.5rem')};
`;

export default function Menu({handleClick}: MenuProps) {
    return (
        <StyledMenuItemContainer onClick={handleClick}>
            <StyledMenuItem src={'/icons/menu.png'} />
        </StyledMenuItemContainer>
    )
};