import { motion } from "framer-motion";
import styled from "styled-components";
import { ElevenMachineContext } from "../context/AppContext";
import Card from "./Card";
import { isCardInCards } from "../utils";
import ShuffleAnimation from "./ShuffleAnimation";

const FlopContainer = styled(motion.div)<{ $numImages: number;}>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    grid-row-start: 2;
    grid-column-start: ${({ $numImages }) => ($numImages > 6 && ('span 2'))};
`;

export default function GameBoard() {
    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);

    const { flopCards, isPlayerTurn, playerCards, playerFlopSelection, playerHandSelection, botFlopSelection } = state.context;

    const showDropArea = isPlayerTurn && playerCards.length > 0;

    const numOfItems = showDropArea ? flopCards.length + 1 : flopCards.length;

    return (
        <FlopContainer $numImages={numOfItems}>
            {showDropArea &&
               <Card
                    dropArea={true}
                    numImages={numOfItems}
                    index={-1}
                    onCardClick={playerHandSelection ? () => elevenActorRef.send({type: 'user.dropCard'}) : undefined}
               />
            }
            {flopCards.map((card, index) => (
                <Card
                    key={card.code}
                    card={card}
                    numImages={numOfItems}
                    index={index}
                    onCardClick={() => elevenActorRef.send({type: 'user.selectFlopCard', card: card})}
                    selected={isCardInCards(card, playerFlopSelection.length > 0 ? playerFlopSelection : botFlopSelection)}
                />
            ))}
            {state.matches({startGame: 'endRound'}) &&
                <ShuffleAnimation />
            }
        </FlopContainer>
    )
}