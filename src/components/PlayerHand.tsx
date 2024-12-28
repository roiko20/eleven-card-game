import styled from "styled-components";
import { ElevenMachineContext } from "../context/AppContext";
import { CardType } from "../lib";
import Card from "./Card";
import { HandContainer } from "./StyledComponents";
import Winner from "./Winner";

const PlayerHandContainer = styled(HandContainer)`
    grid-row-start: 3;
    grid-column-start: 2;
`;

export default function BotHand() {
    const elevenActorRef = ElevenMachineContext.useActorRef();
    const state = ElevenMachineContext.useSelector((state) => state);
    
    const { playerCards, playerHandSelection } = state.context;

    const playerWin = state.matches({gameOver: 'playerWin'});

    return (
        <PlayerHandContainer>
            {playerWin ? <Winner />
            : playerCards.map((card: CardType, index: number) => (
                <Card
                    key={card.code}
                    card={card}
                    index={index}
                    onCardClick={() => elevenActorRef.send({type: 'user.selectHandCard', card: card})}
                    selected={card.code === playerHandSelection?.code}
                    numImages={playerCards.length}
                />
            ))}
    </PlayerHandContainer>
    )
}