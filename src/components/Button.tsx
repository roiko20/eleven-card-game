import { motion } from "framer-motion";
import styled from "styled-components";

interface ButtonProps {
    text: string;
    onClick: () => void;
    color: string;
}

const StyledButton = styled(motion.button)<{ $color: string; }>`
    width: auto;
    height: 3rem;
    border: none;
    border-radius: 4px;
    font-size: ${({ theme }) => (theme?.isMdScreen ? '1.2rem' : '1.4rem')};
    letter-spacing: 1.25px;
    cursor: pointer;
    padding: 0 1rem;
    font-family: "Patua One", serif;
    background-image: ${({ $color }) => $color};
    white-space: nowrap;
`;

export default function Button({text, onClick, color}: ButtonProps) {
    return (
        <StyledButton
            $color={color}
            onClick={onClick}
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.9 }}
        >
            {text}
        </StyledButton>
    )
}