import { motion } from "framer-motion";
import styled from "styled-components";

export const HandContainer = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
`;

export const WinnerText = styled(motion.span)`
    font-size: 4.5rem;
`;