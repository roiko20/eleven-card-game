import { motion } from "framer-motion";
import styled from "styled-components";
import Button from "./Button";
import Modal from "./Modal";
import { ElevenMachineContext } from "../context/AppContext";
import { useEffect, useState } from "react";

const StyledOverlay = styled(motion.div)`
    height: ${({ theme }) => (theme?.isMdScreen ? '90vh' : '100vh')};
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
`;

const StyledTitle = styled(motion.h1)`
    margin: ${({ theme }) => (theme?.isMdScreen ? '8px 0' : '16px 0')};
`;

const StyledActions = styled(motion.div)`
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledIcon = styled(motion.img)`
    width: ${({ theme }) => (theme?.isMdScreen ? '5rem' : '6rem')};
`;

const StyledCredits = styled(motion.div)`
    position: absolute;
    bottom: 8px;
    right: ${({ theme }) => (theme?.isMdScreen ? '8px' : '16px')};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => (theme?.isMdScreen ? '8px' : '10px')};
`;

const StyledCreditsLinekdinIcon = styled.img`
    width: ${({ theme }) => (theme?.isMdScreen ? '2rem' : '2.5rem')};
`;

const StyledCreditsGitIcon = styled.img`
    width: ${({ theme }) => (theme?.isMdScreen ? '2.13rem' : '2.6rem')};
`;

const mainMenuVariants = {
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

export default function MainMenu() {
    const [initialLoad, setInitialLoad] = useState(true);

    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);

    const { gameInProgress } = state.context;

    useEffect(() => {
        setInitialLoad(false);
    }, []);

    return (
        <StyledOverlay
            variants={mainMenuVariants}
            initial="hidden"
            animate="visible"
        >
            <StyledIcon src={'/icons/clubs.svg'} variants={itemVariants} />
            <StyledTitle variants={itemVariants} >Eleven</StyledTitle>
            <StyledActions variants={itemVariants}>
                {gameInProgress &&
                    <Button
                        text={"RESUME GAME"}
                        color={'linear-gradient(120deg, #f6d365 0%, #ffee58 100%)'}
                        onClick={() => elevenActorRef.send({ type: 'user.closeMenu' })}
                    />
                }
                <Button
                    text={"NEW GAME"}
                    color={'linear-gradient(-225deg, #DFFFCD 0%, #90F9C4 48%, #39F3BB 100%)'}
                    onClick={() => elevenActorRef.send(gameInProgress ? { type: 'user.startNewGame' } : { type: 'user.play' })}
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
            {!state.matches({ menu: 'rulesModal'}) &&
            <>
                <StyledCredits
                    layout
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1,
                        transition: {
                            delay: initialLoad ? 1.5 : 0
                        }
                    }}
                >
                    <a
                        href={'https://www.linkedin.com/in/roi-levi/'}
                        target={'_blank'}
                        rel="noreferrer noopener"
                    >
                        <StyledCreditsLinekdinIcon src={'/icons/linkedin.png'} />
                    </a>
                    <a
                        href={'https://github.com/roiko20/eleven-card-game'}
                        target={'_blank'}
                        rel="noreferrer noopener"
                    >
                        <StyledCreditsGitIcon src={'/icons/github.png'} />
                    </a>
                </StyledCredits>
            </>
            }
        </StyledOverlay>
    )
}