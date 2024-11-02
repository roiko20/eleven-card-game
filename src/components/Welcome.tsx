import { motion } from "framer-motion";
import styled from "styled-components";
import Button from "./Button";
import Modal from "./Modal";
import { ElevenMachineContext } from "../context/AppContext";
import Confetti, { ConfettiType } from "./Confetti";

interface WelcomeProps {
    onBackClick: () => void;
}

const StyledOverlay = styled(motion.div)`
  height: 100vh;
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1); /* Semi-transparent overlay */
`;

const StyledActions = styled(motion.div)`
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledIcon = styled(motion.img)`
    width: 6rem;
`;

const welcomeVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    },
    hidden: {
        opacity: 0
    }
};

const itemVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hidden: {
      opacity: 0
    },
};

export default function Welcome({ onBackClick }: WelcomeProps) {
    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);

    const { gameInProgress } = state.context;

    return (
        <StyledOverlay       
            variants={welcomeVariants}
            initial="hidden"
            animate="visible"
        >
            <StyledIcon src={'/icons/clubs.svg'} variants={itemVariants} />
            <motion.h1 variants={itemVariants} >Eleven</motion.h1>
            <StyledActions variants={itemVariants}>
                {gameInProgress &&
                    <Button
                        text={"BACK TO GAME"}
                        color={'linear-gradient(120deg, #f6d365 0%, #ffee58 100%)'}
                        onClick={() => elevenActorRef.send({ type: 'user.closeMenu' })}
                    />
                }
                <Button
                    text={"NEW GAME"}
                    color={'linear-gradient(-225deg, #DFFFCD 0%, #90F9C4 48%, #39F3BB 100%)'}
                    onClick={() => elevenActorRef.send(gameInProgress ? { type: 'user.startNewGame'} : { type: 'user.play' })}
                />
                <Button
                    text={"RULES"}
                    color={'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'}
                    onClick={() => elevenActorRef.send({ type: 'user.showRules' })}
                />
            </StyledActions>
            <Modal
                open={state.matches({ menu: 'rulesModal' })}
                onClose={() => elevenActorRef.send({ type: 'user.hideRules' })}
            />
            {/* <Confetti isPlayerScore={false} type={ConfettiType.Clubs}/> */}
        </StyledOverlay>
    )
}