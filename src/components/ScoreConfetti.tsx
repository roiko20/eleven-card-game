import { motion } from 'framer-motion';
import { useContext } from 'react';
import styled, { ThemeContext } from "styled-components";

const bonusIcons = ['/icons/joker.png', '/icons/fivePoints.png'];
const clubsIcons = ['/icons/clubsCoin.png', '/icons/thirteen.png'];

export enum ConfettiType {
    Bonus = 'Bonus',
    Clubs = 'Clubs'
}

interface ScoreConfettiProps {
    isPlayerScore: boolean;
    type: ConfettiType;
}

const ConfettiContainer = styled.span`
    position: absolute;
`;

const ConfettiIcon = styled(motion.img)`
    position: absolute;
    width: 3rem;
    z-index: 100;
    pointer-events: none;
`;

const getConfettiAnimation = (index: number, isPlayerScore = false, isMdScreen: boolean, type: ConfettiType) => {
    return {
        animate:{ 
            opacity: [0, 1, 1],
            scale: [0.7, isMdScreen ? 2 : 3, 0],
            x: ['40vw', '30vw', 0],
            y: [isPlayerScore ? '-40vh' : '40vh', isPlayerScore ? '-30vh' : '30vh', 0],
            rotate: Math.random() * 360
        },
        transition: {
            duration: type === ConfettiType.Clubs ? 1.3 : 2,
            delay: 0.3 * index,
            ease: 'easeInOut'
        }
    };
};

export default function ScoreConfetti({isPlayerScore, type = ConfettiType.Clubs} : ScoreConfettiProps) {
    const theme = useContext(ThemeContext);

    const getIconsArray = (type: ConfettiType) => {
        
        const confettiIcons = {
            [ConfettiType.Bonus]: bonusIcons,
            [ConfettiType.Clubs]: clubsIcons,
        };

        const selectedIcons = confettiIcons[type] || [];

        return Array.from({ length: 4 }, (_, index) => selectedIcons[index % selectedIcons.length]);
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