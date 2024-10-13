import { motion } from "framer-motion";
import styled from "styled-components";
import Button from "./Button";
import Modal from "./Modal";
import { ElevenMachineContext } from "../context/AppContext";

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

export default function Welcome({ onBackClick }: WelcomeProps) {
    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);
    console.log('snapshot');
    console.log(state);
    const { gameInProgress } = state.context;

    return (
        <StyledOverlay       
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <StyledIcon src={'/icons/clubs.svg'} />
            <h1>Eleven</h1>
            <StyledActions>
                {
                    gameInProgress &&
                        <Button
                            text={"BACK TO GAME"}
                            color={'linear-gradient(-225deg, #E0C3FC 0%, #B19FFF 48%, #ECA1FE 100%)'}
                            onClick={onBackClick}
                        />
                }
                <Button
                    text={"NEW GAME"}
                    color={'linear-gradient(-225deg, #DFFFCD 0%, #90F9C4 48%, #39F3BB 100%)'}
                    onClick={() => elevenActorRef.send({ type: 'user.play' })}
                />
                <Button
                    text={"RULES"}
                    color={'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'}
                    onClick={() => elevenActorRef.send({ type: 'user.showRules' })}
                />
            </StyledActions>
            <Modal
                open={state.matches({ welcome: 'rulesModal' })}
                onClose={() => elevenActorRef.send({ type: 'user.hideRules' })}
            />
        </StyledOverlay>
    )
}