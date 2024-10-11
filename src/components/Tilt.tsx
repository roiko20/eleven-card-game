import { motion } from "framer-motion";
import styled from "styled-components";

const StyledBackdrop = styled(motion.div)`
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: hidden;
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
`;

const StyledIcon = styled(motion.img)`
    width: 10rem;
`;

export default function Tilt() {
    return <StyledBackdrop>
        <StyledIcon
            src={"/icons/tilt.png"}
            initial={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5
            }}
        />
    </StyledBackdrop>
};