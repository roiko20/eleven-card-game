import { motion } from "framer-motion";
import styled from "styled-components";


export const WinnerText = styled(motion.span)`
    font-size: 4.5rem;
`;

export default function Winner() {

    return (
        <WinnerText
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1,
                transition: {
                    duration: 2
                }
            }}
        >
            WINNER
        </WinnerText>
    )
}