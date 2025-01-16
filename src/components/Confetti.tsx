import { motion } from 'framer-motion';
import { useContext } from 'react';
import styled, { ThemeContext } from "styled-components";
import Button from './Button';
import { ElevenMachineContext } from '../context/AppContext';

const playerIcons = ['/icons/win.png', '/icons/joker.png', '/icons/hat2.png', '/icons/clubsCoin.png'];
const botIcons = ['/icons/bot.png', '/icons/hat.png', '/icons/clubsCoin.png'];

const getConfettiAnimation = () => {
    const randomX = Math.random() * window.innerWidth / 5;
    const randomY = Math.random() * window.innerHeight / 2;
    const randomDelay = Math.random() * 2;
    const randomSpeed = Math.random() * 4 + 2;
    const randomScale = Math.max(Math.random() * window.innerWidth / 350, 1);
    const randomRotate = Math.random() * 360;
    return {
        animate: {
            y: [0, randomY, window.innerHeight],
            x: [randomX, randomX + 50, randomX],
            rotate: [randomRotate, 0, randomRotate],
            scale: [0, randomScale, 0.3],
        },
        transition: {
            delay: randomDelay,
            duration: randomSpeed,
            ease: 'easeInOut',
            repeat: Infinity
        },
    };
};

const ConfettiContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: ${({ theme }) => (theme?.isMdScreen ? '90vh' : '100vh')};
    background-color: rgba(60, 60, 60, 0.3);
`;

const ConfettiIcon = styled(motion.img)`
    width: 2rem;
    pointer-events: none;
`;

const Modal = styled(motion.div)`
    position: absolute;
    top: 45%;
    left: 49.5%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 32px 24px;
    border-radius: 16px;
    box-shadow: 2px 2px 8px #424242;
    background-color: rgba(10, 10, 10, 0.6);
`;

const ActionsContainer = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
`;

const GameOverTextContainer = styled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
`;

const StyledTitle = styled('span')`
    font-size: ${({ theme }) => (theme?.isMdScreen ? '44px' : '52px')};
    color: #4fc3f7;
    white-space: nowrap;
`;

const Icon = styled('img')`
    width: ${({ theme }) => (theme?.isMdScreen ? '4rem' : '5rem')};
`;

export default function Confetti() {
    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);

    const playerWin = state.matches({ gameOver: 'playerWin' });

    const theme = useContext(ThemeContext);

    const getIconsArray = (playerWin: boolean) => {
        const numIcons = theme?.isMdScreen ? 40 : 80;
        return Array.from({ length: numIcons }, (_, index) => playerWin ?
            playerIcons[index % playerIcons.length]
            : botIcons[index % botIcons.length]
        );
    };

    return (
        <ConfettiContainer>
            {getIconsArray(playerWin).map((icon, index) => (
                <ConfettiIcon
                    key={index}
                    src={icon}
                    {...getConfettiAnimation()}
                />
            ))}
            <Modal
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.7 } }}
            >
                <GameOverTextContainer>
                    <Icon src={playerWin ? "/icons/king.png" : "/icons/botLove.png" } />
                    <StyledTitle>
                        {playerWin ? 'YOU DID IT!' : 'TRY AGAIN?'}
                    </StyledTitle>
                    <Icon src={playerWin ? "/icons/queen.png" : "/icons/botLove.png"} />
                </GameOverTextContainer>
                <ActionsContainer>
                    <Button
                        text={"NEW GAME"}
                        color={'linear-gradient(-225deg, #DFFFCD 0%, #90F9C4 48%, #39F3BB 100%)'}
                        onClick={() => elevenActorRef.send({ type: 'user.startNewGame' })}
                    />
                    <Button
                        text={"RESUME GAME"}
                        color={'linear-gradient(120deg, #f6d365 0%, #ffee58 100%)'}
                        onClick={() => elevenActorRef.send({ type: 'user.resumeGame' })}
                    />
                    <Button
                        text={"MAIN MENU"}
                        color={'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'}
                        onClick={() => elevenActorRef.send({ type: 'user.mainMenu' })}
                    />
                </ActionsContainer>
            </Modal>
        </ConfettiContainer>
    );
}
