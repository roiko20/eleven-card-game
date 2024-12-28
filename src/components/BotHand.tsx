import { ElevenMachineContext } from "../context/AppContext";
import { CardType } from "../lib";
import Card from "./Card";
import { HandContainer } from "./StyledComponents";
import Winner from "./Winner";


export default function BotHand() {
    const state = ElevenMachineContext.useSelector((state) => state);
    
    const { botCards, botHandSelection } = state.context;

    const botWin = state.matches({gameOver: 'botWin'});

    return (
        <HandContainer>
            {botWin ? <Winner />
            : botCards.map((card: CardType, index: number) => (
                <Card
                    key={card.code}
                    card={card}
                    // showBack={card.code !== botHandSelection?.code}
                    index={index}
                    selected={card.code === botHandSelection?.code}
                    numImages={botCards.length}
                />
            ))}
    </HandContainer>
    )
}