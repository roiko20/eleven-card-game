import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

const StyledBackdrop = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: hidden;
`;

const StyledModal = styled(motion.div)`
    padding: 0 3rem 2rem 3rem;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%);
    max-height: 95%;
`;

const StyledModalTitle = styled(motion.h1)`
    font-size: clamp(16px, 3rem, 34px);
    margin-bottom: 4px;
`;

const StyledModalSubTitle = styled(motion.h2)`
    font-size: clamp(16px, 2rem, 24px);
    margin-top: 8px;
    margin-bottom: 6px;
`;

const StyledCloseIcon = styled.img`
    position: absolute;
    top: 25px;
    right: 25px;
    cursor: pointer;
    width: 30px;
`;

const StyledModalText = styled(motion.span)`
    font-size: clamp(16px, 3rem, 20px);
    overflow-y: auto;
    line-height: 1.5;
    padding: 0 16px;
`;

const StyledIcon = styled('img')`
    width: 2.4rem;
    vertical-align: middle;
    margin-left: '4px';
`;

const StyledList = styled('ul')`
    margin: 0;
    padding-left: 34px;
`;

const StyledListItem = styled('li')`
    margin-bottom: 4px;
`;

const StyledIconItem = styled('div')`
    margin: 4px 0;
`;

const StyledScoringWrapper = styled('div')`
    margin-top: 6px;
`;

const StyledScoringContainer = styled('div')`
    display: flex;
    justify-content: space-between;
`;

const StyledSpanIconItem = styled('span')`
    display: inline-block;
    margin: 4px 0;
    white-space: nowrap;
`;

const StyledCenteredScoringContainer = styled('div')`
    text-align: center;
    margin: 4px 0;
`;

const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  export default function Modal({open, onClose}: ModalProps) {
    return (
        <AnimatePresence>
            {open && 
                <StyledBackdrop
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <StyledModal
                        onClick={(e) => e.stopPropagation()}  
                        variants={dropIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <StyledModalTitle>Rules</StyledModalTitle>
                        <StyledCloseIcon
                            src={"/icons/close.svg"}
                            onClick={onClose}
                        />
                        <StyledModalText>
                            <StyledModalSubTitle>Objective</StyledModalSubTitle>
                            {/* You vs. Bot.<br/> */}
                            <StyledIcon src={'/icons/points.png'} /> Collect flop cards and be the first to score 104 points.
                            <StyledModalSubTitle>Gameplay</StyledModalSubTitle>
                                On your turn, play one of your hand cards with one or more flop cards to collect them:<br/>
                                <StyledIconItem>
                                    <StyledIcon src="/icons/eleven.png" /> Create a sum of 11 with your selected card and flop cards to collect.<br/>
                                </StyledIconItem>
                                <StyledIconItem>
                                    <StyledIcon src="/icons/king.png" /> King collects King.<br/>
                                </StyledIconItem>
                                <StyledIconItem>
                                    <StyledIcon src="/icons/queen.png" /> Queen collects Queen.<br/>
                                </StyledIconItem>
                                <StyledIconItem>
                                    <StyledIcon src="/icons/prince.png" /> Jack collects all flop cards except Kings and Queens.<br/>
                                </StyledIconItem>
                                Example moves:<br/>
                                <StyledList>
                                    <StyledListItem>
                                        Play a 5, collect a 6 from the flop.
                                    </StyledListItem>
                                    <StyledListItem>
                                        Play a 3, collect a 7 and an Ace from the flop.
                                    </StyledListItem>
                                </StyledList>
                                If no moves are available, drop a card.<br/>
                                At the end of each round, the last player to collect flop cards gets all remaining flop cards.
                            <StyledModalSubTitle>Round Scoring</StyledModalSubTitle>
                            26 points are available each round:<br/>
                            <StyledScoringWrapper>
                                <StyledScoringContainer>
                                    <StyledSpanIconItem>
                                        <StyledIcon src="/icons/club.png" /> Collect most club suit cards (7+ clubs) - 13 points.
                                    </StyledSpanIconItem>
                                    <StyledSpanIconItem>
                                        <StyledIcon src="/icons/10ofDiamonds.png" /> Ten of diamonds - 3 points.
                                    </StyledSpanIconItem>
                                </StyledScoringContainer>
                                <StyledScoringContainer>
                                    <StyledSpanIconItem>
                                        <StyledIcon src="/icons/2ofClubs.png" /> Two of clubs - 2 points.
                                    </StyledSpanIconItem>
                                    <StyledSpanIconItem>
                                        <StyledIcon src="/icons/jack.png" /> Jack (any suit) - 1 point.
                                    </StyledSpanIconItem>
                                    <StyledSpanIconItem>
                                        <StyledIcon src="/icons/ace.png" /> Ace (any suit) - 1 point.
                                    </StyledSpanIconItem>
                                </StyledScoringContainer>
                                <StyledCenteredScoringContainer>
                                    <StyledIcon src="/icons/joker.png" /> Bonus - clear the flop (except for the last round, not using a jack) - 5 points.
                                </StyledCenteredScoringContainer>
                            </StyledScoringWrapper>
                        </StyledModalText>
                    </StyledModal>
                </StyledBackdrop>
            }
        </AnimatePresence>
      );
  }