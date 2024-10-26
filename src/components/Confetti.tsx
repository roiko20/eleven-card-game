import { motion } from 'framer-motion';
import { useContext } from 'react';
import styled, { ThemeContext } from "styled-components";

const bonusIcons = ['/icons/joker.png', '/icons/fivePoints.png'];
const clubsIcons = ['/icons/clubsCoin.png', '/icons/thirteen.png'];

export enum ConfettiType {
    Bonus = 'Bonus',
    Clubs = 'Clubs'
}

interface ConfettiProps {
    isPlayerScore: boolean;
    type: ConfettiType;
}

const getConfettiAnimation = (index: number, isPlayerScore = false, isMdScreen: boolean, type: ConfettiType) => {
    const randomX = Math.random() * (window.innerWidth / 3) + window.innerWidth / 4;
    const randX = Math.random() * 100 - 200;
    const randomY = Math.random() * 400;
    const randomDelay = Math.min(Math.random() * 1, 0.3);
    const randomSpeed = Math.random() * 3 + 2;
    const randomScale = Math.random() * 3;
    const randomRotate = Math.random() * 360;
    const bottomScreen = window.innerHeight - Math.random() * 800;
    const centerScreen = window.innerWidth / 2;
    const middleScreen = window.innerHeight / 2;
    const topMiddleScreen = window.innerHeight / 3;
    const topScreen = window.innerHeight / 4;
    return {
        // initial:{ opacity: 0, x: "45vw", y: isPlayerScore ? "-45vh" : "45vh" },
        animate:{ 
            opacity: [0, 1, 1],
            scale: [0.7, isMdScreen ? 2 : 3, 0],
            x: ['40vw', '30vw', 0],
            y: [isPlayerScore ? '-40vh' : '40vh', isPlayerScore ? '-30vh' : '30vh', 0],
            rotate: randomRotate
        },
        transition: {
            // delay: 0.2 * (index - previousCardsLengthRef.current),
            duration: type === ConfettiType.Clubs ? 1.3 : 2,
            delay: 0.3 * index,
            ease: 'easeInOut',
            // repeat: Infinity
        }
    };
};

const ConfettiContainer = styled.span`
    position: absolute;
`;

const ConfettiIcon = styled(motion.img)`
    position: absolute;
    width: 3rem;
    z-index: 100;
`;

export default function Confetti({isPlayerScore, type = ConfettiType.Clubs} : ConfettiProps) {
    const theme = useContext(ThemeContext);

    const getIconsArray = (type: ConfettiType) => {
        const numIcons = theme?.isMdScreen ? 4 : 4;
        
        const confettiIcons = {
            [ConfettiType.Bonus]: bonusIcons,
            [ConfettiType.Clubs]: clubsIcons,
            // Add new types here with their respective icons
        };

        const selectedIcons = confettiIcons[type] || [];

        return Array.from({ length: numIcons }, (_, index) => selectedIcons[index % selectedIcons.length]);
    };

    return (
        <ConfettiContainer>
          {getIconsArray(type).map((icon, index) => (
            <ConfettiIcon 
                key={index}
                src={icon}
                {...getConfettiAnimation(index, isPlayerScore, theme?.isMdScreen, type)}
            />
            ))}
        </ConfettiContainer>
      );
}