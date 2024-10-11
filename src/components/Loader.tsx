import { motion } from "framer-motion";
import styled from "styled-components";
import BackSVG from "./BackSVG";

const StyledOverlay = styled(motion.div)`
  height: 100vh;
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1); /* Semi-transparent overlay */
`;

const StyledText = styled(motion.h1)`
  position: relative;
  font-size: ${({ theme }) => (theme?.isMdScreen ? '32px' : '36px')};
  top: ${({ theme }) => (theme?.isMdScreen ? '115px' : '140px')};
`;

const textVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  },
  hidden: {}
};

const charVariants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 0,
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatDelay: 0.5
    }
  },
};

export default function Loader() {

    // Shuffe animation
    const shuffleAnimation = (i: number) => ({
      x: [0, 75, -75, 50, 0],
      y: [0, 10, -10, 5, -15, 0],
      rotate: [0, 10, -5, 20, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        delay: i * 0.1,
        repeatDelay: 1.6
      },
    });
  
    return (
      <StyledOverlay>
        {Array(16).fill(null).map((_, index) => (
            <BackSVG
              key={index}
              animate={shuffleAnimation(index)}
            />
        ))}
        <StyledText
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {'Loading...'.split("").map((char, index) => (
            <motion.span
              variants={charVariants}
              key={index}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </StyledText>
      </StyledOverlay>
    );
};