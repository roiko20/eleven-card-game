import { motion } from "framer-motion";
import styled from "styled-components";

interface ButtonProps {
    text: string;
    onClick: () => void;
    color: string;
}

export const StyledButton = styled(motion.button)<{ $color: string; }>`
    width: auto;
    height: 3rem;
    border: none;
    border-radius: 4px;
    font-size: 1.4rem;
    letter-spacing: 1.25px;
    cursor: pointer;
    padding: 0 1rem;
    font-family: "Patua One", serif;
    background-image: ${({ $color }) => $color};
`;

export const StyledButton2 = styled(motion.button)`
    width: auto;
    height: 3rem;
    border: none;
    border-radius: 4px;
    font-size: 1.4rem;
    letter-spacing: 1.25px;
    cursor: pointer;
    padding: 0 1rem;
    font-family: "Patua One", serif;
    background-image: linear-gradient(-225deg, #DFFFCD 0%, #90F9C4 48%, #39F3BB 100%);
`;

export const StyledIcon = styled(motion.img)`
    width: 6rem;
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