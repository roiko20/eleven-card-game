import { and, assertEvent, assign, fromPromise, not, setup } from 'xstate';
import { CardType } from "../lib";
// import { RickCharacters } from './services/RickApi';
// import { getRandomNumber } from './common/constants';
import { compareCards, dealCards, fetchDeck, fetchResources, getBestCardToDrop, getBestMove, getCardScore, getCardsScore, getNumOfClubs, isCardInCards, isValidJackMove, isValidMove, removeCardsFromCards, selectCardsByRoyalty, shuffleDeck } from '../utils';
import { Context } from 'react-responsive';

interface ElevenContext {
  cards: CardType[];
    hasLoaded: boolean;
    error: string;
    gameInProgress: boolean;
    round: number;
    isPlayerTurn: boolean;
    isLastHand: boolean;
    lastPlayedHandCard: CardType | null;
    isPlayerLastToCollect: boolean;
    playerPoints: number;
    playerPreviousClubs: number;
    playerClubs: number;
    playerCards: CardType[];
    playerSidePile: CardType[];
    playerHandSelection: CardType | null;
    playerFlopSelection: CardType[],
    flopCards: CardType[];
    botPoints: number;
    botPreviousClubs: number;
    botClubs: number;
    botCards: CardType[];
    botSidePile: CardType[];
    botHandSelection: CardType | null;
    botFlopSelection: CardType[];
}

type ElevenEvents =
  | { type: 'user.play' }
  | { type: 'user.showRules'}
  | { type: 'user.hideRules' }
  | { type: 'user.openMenu' }
  | { type: 'user.closeMenu'}
  | { type: 'user.startNewGame' }
  | { type: 'user.selectHandCard', card: CardType }
  | { type: 'user.selectFlopCard', card: CardType }
  | { type: 'user.dropCard' }
  | { type: 'user.cancelSelection' }
  | { type: 'user.reject' }
  | { type: 'user.accept' }
  | {
      type: 'user.selectAnswer';
      answer: number;
    }
  | { type: 'user.nextQuestion' }
  | { type: 'user.playAgain' };


const elevenMachine = setup({
  types: {
    events: {} as ElevenEvents,
    context: {} as ElevenContext
  },
  actions: {
    incrementRound: assign({
      round: ({ context }) => context.round + 1
    }),
    dealFirstRoundHand: assign(({ context }) => {
      let deck = context.cards;
      // keep shuffling deck until flop cards (cards[8-12]) have no jacks in them
      while (deck.slice(8, 12).some(card => card.value === 'JACK')) {
        deck = shuffleDeck(deck);
      }
      const { playerCards, botCards, flopCards } = dealCards(deck, context.isPlayerTurn, true);
      const updatedDeck = deck.slice(12);
      return {
        playerCards: playerCards,
        botCards: botCards,
        flopCards: flopCards,
        cards: updatedDeck
      }
    }),
    dealHand: assign(({ context }) => {
      const { playerCards, botCards } = dealCards(context.cards, context.isPlayerTurn, false);
      const updatedDeck = context.cards.slice(8);
      const isLastHand = updatedDeck.length === 0;

      return {
        playerCards: playerCards,
        botCards: botCards,
        cards: updatedDeck,
        isLastHand: isLastHand
      };
    }),
    handleBotMove: assign(({ context }) => {
      const bestMove = getBestMove(context.botCards, context.flopCards, context.isLastHand);
      // no moves - set drop card selection
      if (!bestMove) {
        const cardToDrop = getBestCardToDrop(context.botCards);
        return {
          botHandSelection: cardToDrop
        }
      }

      // set selection by best move
      const { handCard, flopCards } = bestMove;
      
      return {
        botHandSelection: handCard,
        botFlopSelection: flopCards
      };
    }),
    updateBotMove: assign(({ context }) => {
      // cards collected - add to side pile
      if (context.botFlopSelection.length) {
        return {
          botSidePile: [
            ...context.botSidePile,
            context.botHandSelection!,
            ...context.botFlopSelection
          ],
          botPoints: context.botPoints + getCardsScore([context.botHandSelection!, ...context.botFlopSelection], context.botClubs),
          botPreviousClubs: context.botClubs,
          botClubs: context.botClubs + getNumOfClubs([context.botHandSelection!, ...context.botFlopSelection]),
          flopCards: removeCardsFromCards(context.botFlopSelection, context.flopCards),
          botCards: removeCardsFromCards([context.botHandSelection!], context.botCards),
          botFlopSelection: [],
          lastPlayedHandCard: context.botHandSelection,
          botHandSelection: null,
          isPlayerLastToCollect: false
        }
      }
      // card dropped - add to flop
      return {
        flopCards: [context.botHandSelection!, ...context.flopCards],
        botCards: removeCardsFromCards([context.botHandSelection!], context.botCards),
        botHandSelection: null
      }
    }),
    handleToggleTurn: assign({
      isPlayerTurn: ({ context }) => !context.isPlayerTurn
    }),
    botBonus: assign({
      botPoints: ({ context }) => context.botPoints + 5
    }),
    setPlayerHandSelection: assign(({ context, event }) => {
      assertEvent(event, 'user.selectHandCard');
      return {
        playerHandSelection: compareCards(context.playerHandSelection, event.card) ? null : event.card,
      }
    }),
    setPlayerFlopSelection: assign(({ context, event}) => {
      assertEvent(event, 'user.selectFlopCard');
      return {
        playerFlopSelection: isCardInCards(event.card, context.playerFlopSelection)
        ? removeCardsFromCards([event.card], context.playerFlopSelection)
        : [...context.playerFlopSelection, event.card],
      }
    }),
    dropPlayerCard: assign({
      playerFlopSelection: [],
      flopCards: ({ context }) => [context.playerHandSelection!, ...context.flopCards],
      playerCards: ({ context }) => removeCardsFromCards([context.playerHandSelection!], context.playerCards),
      lastPlayedHandCard: ({ context }) => context.playerHandSelection,
      playerHandSelection: null
    }),
    cancelPlayerSelection: assign({
      playerHandSelection: null,
      playerFlopSelection: []
    }),
    setPlayerJackMoveSelection: assign({
      playerFlopSelection: ({ context }) => selectCardsByRoyalty(context.flopCards, false)
    }),
    updatePlayerMove: assign({
      playerSidePile: ({ context }) => [
        ...context.playerSidePile,
        context.playerHandSelection!,
        ...context.playerFlopSelection
      ],
      playerPoints: ({ context }) => context.playerPoints + getCardsScore([context.playerHandSelection!, ...context.playerFlopSelection], context.playerClubs),
      playerPreviousClubs: ({ context }) => context.playerClubs,
      playerClubs: ({ context }) => context.playerClubs + getNumOfClubs([context.playerHandSelection!, ...context.playerFlopSelection]),
      flopCards: ({ context }) => removeCardsFromCards(context.playerFlopSelection, context.flopCards),
      playerCards: ({ context }) => removeCardsFromCards([context.playerHandSelection!], context.playerCards),
      playerFlopSelection: [],
      lastPlayedHandCard: ({ context }) => context.playerHandSelection,
      playerHandSelection: null,
      isPlayerLastToCollect: true
    }),
    playerBonus: assign({
      playerPoints: ({ context }) => context.playerPoints + 5
    }),
    pickUpRemainingCards: assign(({ context }) => {
      if (context.isPlayerLastToCollect) {
        return {
          playerFlopSelection: context.flopCards,
        }
      }
      return {
        botFlopSelection: context.flopCards,
      }
    }),
    updateFinalMove: assign(({ context }) => {
      if (context.playerFlopSelection.length > 0) {
        return {
          playerSidePile: [
            ...context.playerSidePile,
            ...context.playerFlopSelection
          ],
          playerPoints: context.playerPoints + getCardsScore([...context.playerFlopSelection], context.playerClubs),
          playerPreviousClubs: context.playerClubs,
          playerClubs: context.playerClubs + getNumOfClubs([...context.playerFlopSelection]),
          flopCards: removeCardsFromCards(context.playerFlopSelection, context.flopCards),
          playerFlopSelection: [],
        }
      }
      return {
          botSidePile: [
            ...context.botSidePile,
            ...context.botFlopSelection
          ],
          botPoints: context.botPoints + getCardsScore([...context.botFlopSelection], context.botClubs),
          botPreviousClubs: context.botClubs,
          botClubs: context.botClubs + getNumOfClubs([...context.botFlopSelection]),
          flopCards: removeCardsFromCards(context.botFlopSelection, context.flopCards),
          botFlopSelection: [],
      }
    }),
    handleEndRound: assign(({ context }) => {
      const newDeck = shuffleDeck([
        ...context.botSidePile,
        ...context.playerSidePile
      ]);
      return {
        cards: newDeck,
        botSidePile: [],
        playerSidePile: [],
        botPreviousClubs: 0,
        botClubs: 0,
        playerPreviousClubs: 0,
        playerClubs: 0,
        isLastHand: false
      }
    }),
    handleNewGame: assign(({ context }) => {
      const newDeck = shuffleDeck([
        ...context.cards,
        ...context.botCards,
        ...context.botSidePile,
        ...context.flopCards,
        ...context.playerCards,
        ...context.playerSidePile
      ]);
      return {
        cards: newDeck,
        round: 0,
        isPlayerTurn: true,
        isLastHand: false,
        lastPlayedHandCard: null,
        isPlayerLastToCollect: false,
        playerPoints: 0,
        playerPreviousClubs: 0,
        playerClubs: 0,
        playerCards: [],
        playerSidePile: [],
        playerHandSelection: null,
        playerFlopSelection: [],
        flopCards: [],
        botPoints: 0,
        botPreviousClubs: 0,
        botClubs: 0,
        botCards: [],
        botSidePile: [],
        botHandSelection: null,
        botFlopSelection: []
      }
    })
  },
  guards: {
    hasLoaded: ({ context }) => context.hasLoaded,
    isPlayerHandCardSelected: ({ context }) => !!context.playerHandSelection,
    isValidMove: ({ context, event }) => {
      // assertEvent(event, 'user.selectAnswer');
      return isValidMove(context.playerHandSelection, context.playerFlopSelection);
    },
    isValidJackMove: ({ context }) => isValidJackMove(context.playerHandSelection, context.flopCards),
    isBonusMove: ({ context }) => context.flopCards.length === 0 && !context.isLastHand && context.lastPlayedHandCard?.value !== 'JACK',
    // isBotMostClubsMove: ({ context }) => context.botPreviousClubs < 7 && context.botClubs >= 7,
    // isPlayerMostClubsMove: ({ context }) => context.playerPreviousClubs < 7 && context.playerClubs >= 7,
    isRoundOverWithRemainingFlop : ({ context }) => context.isLastHand && context.flopCards.length > 0 && context.botCards.length === 0 && context.playerCards.length === 0,
    isRoundOver: ({ context }) => context.isLastHand && context.botCards.length === 0 && context.playerCards.length === 0,
    isHandOver: ({ context }) => context.botCards.length === 0 && context.playerCards.length === 0,
    // isLastHand: ({ context }) => context.isLastHand,
    hasLostGame: ({ context }) => {
      return context.botPoints >= 104;
    },
    isBotTurn: ({ context }) => !context.isPlayerTurn,
    hasWonGame: ({ context }) => {
      return context.playerPoints >= 104;
    }
  },
  // actions: {
  //   // goToTriviaPage: () => {},
  //   newGame: assign({
  //     cards: [], // TODO: add new deck cards
  //     round: 0,
  //     isPlayerTurn: false,
  //     isLastHand: false,
  //     lastPlayedHandCard: null,
  //     isPlayerLastToCollect: false,
  //     playerPoints: 0,
  //     playerPreviousClubs: 0,
  //     playerClubs: 0,
  //     playerCards: [],
  //     playerSidePile: [],
  //     playerHandSelection: null,
  //     playerFlopSelection: [],
  //     flopCards: [],
  //     botPoints: 0,
  //     botPreviousClubs: 0,
  //     botClubs: 0,
  //     botCards: [],
  //     botSidePile: [],
  //     botHandSelection: null,
  //     botFlopSelection: []
  //   })
  // },
  actors: {
    loadInitialResources: fromPromise(fetchResources)
  }
}).createMachine({
  invoke: {
    src: 'loadInitialResources',
    onDone: {
      actions: assign({
        cards: ({ event }) => event.output,
        hasLoaded: true
      }),
    },
  },
  id: 'elevenMachine',
  initial: 'menu',
  context: {
    cards: [],
    hasLoaded: false,
    error: '',
    gameInProgress: false,
    round: 0,
    isPlayerTurn: true,
    isLastHand: false,
    lastPlayedHandCard: null,
    isPlayerLastToCollect: false,
    playerPoints: 0,
    playerPreviousClubs: 0,
    playerClubs: 0,
    playerCards: [],
    playerSidePile: [],
    playerHandSelection: null,
    playerFlopSelection: [],
    flopCards: [],
    botPoints: 0,
    botPreviousClubs: 0,
    botClubs: 0,
    botCards: [],
    botSidePile: [],
    botHandSelection: null,
    botFlopSelection: []
  },
  states: {
    menu: {
      id: 'menu',
      initial: 'mainMenu',
      states: {
        mainMenu: {
          on: {
            'user.showRules': {
              target: 'rulesModal'
            },
            'user.play': {
              target: '#startGame'
            },
            'user.closeMenu': {
              target: '#startGame.history'
            },
            'user.startNewGame': {
              target: '#newGame'
            },
          }
        },
        rulesModal: {
          id: 'rulesModal',
          on: {
            'user.hideRules': {
              target: 'mainMenu'
            }
          }
        },
      }
    },
    startGame: {
      id: 'startGame',
      initial: 'loading',
      // entry: ['newGame'],
      entry: assign({
        gameInProgress: true
      }),
      on: {
        'user.openMenu': {
          target: '#menu'
        }
      },
      states: {
        history: {
          type: 'history',
          history: 'deep'
        },
        loading: {
          id: 'loading',
          always: { target: 'startRound', guard: 'hasLoaded'}
        },
        startRound: {
          id: 'startRound',
          initial: 'firstHand',
          states: {
            firstHand: {
              id: 'firstHand',
              entry: ['incrementRound', 'dealFirstRoundHand'],
              after: {
                1500: {
                  target: 'roundInProgress'
                }
              }
            },
            roundInProgress: {
              id: 'roundInProgress',
              initial: 'decideTurn',
              states: {
                decideTurn: {
                  id: 'decideTurn',
                  always: [
                    { target: '#pickUpRemainingFlop', guard: 'isRoundOverWithRemainingFlop' },
                    { target: '#endRound', guard: 'isRoundOver'},
                    { target: 'dealCards', guard: 'isHandOver' },
                    { target: 'botTurn', guard: 'isBotTurn'},
                    { target: 'playerTurn', guard: not('isBotTurn')}
                  ]
                },
                dealCards: {
                  id: 'dealCards',
                  entry: 'dealHand',
                  always: 'decideTurn'
                },
                toggleTurn: {
                  id: 'toggleTurn',
                  entry: 'handleToggleTurn',
                  always: { target: '#decideTurn' }
                },
                botTurn: {
                  id: 'botTurn',
                  initial: 'delayMove',
                  states: {
                    delayMove: {
                      id: 'delayMove',
                      after: {
                        1000: {
                          target: 'setMove'
                        }
                      }
                    },
                    setMove: {
                      id: 'setMove',
                      entry: 'handleBotMove',
                      after: {
                        1500: {
                          target: '#botMoveUpdateBoard'
                        }
                      }
                    },
                    botMoveUpdateBoard: {
                      id: 'botMoveUpdateBoard',
                      entry: 'updateBotMove',
                      always: [
                        { target: 'botBonusMove', guard: 'isBonusMove' },
                        // { target: '#decideTurn', guard: and([not('isBonusMove'), not('isRoundOver')]) } 
                        { target: '#toggleTurn', guard: not('isBonusMove') }
                      ]
                    },
                    botBonusMove: {
                      id: 'botBonusMove',
                      after: {
                        3000: {
                          actions: 'botBonus',
                          target: '#toggleTurn'
                        }
                      }
                    }
                  }
                },
                playerTurn: {
                  id: 'playerTurn',
                  initial: 'waitForMove',
                  states: {
                    waitForMove: {
                      id: 'waitForMove',
                      on: {
                        'user.selectHandCard': {
                          actions: 'setPlayerHandSelection'
                        },
                        'user.selectFlopCard': {
                          actions: 'setPlayerFlopSelection'
                        },
                        'user.dropCard': {
                          guard: 'isPlayerHandCardSelected',
                          actions: ['dropPlayerCard'],
                          target: '#toggleTurn'
                        },
                        'user.cancelSelection': {
                          actions: 'cancelPlayerSelection'
                        }
                      },
                      always: [
                        { target: 'playerJackMoveUpdateBoard', guard: 'isValidJackMove' },
                        { target: 'playerMoveDelayedUpdateBoard', guard: 'isValidMove' }
                      ],
                    },
                    playerJackMoveUpdateBoard: {
                      id: 'playerJackMoveUpdateBoard',
                      entry: 'setPlayerJackMoveSelection',
                      after: {
                        1200: {
                          target: 'playerMoveUpdateBoard'
                        }
                      }
                    },
                    playerMoveDelayedUpdateBoard: {
                      id: 'playerMoveDelayedUpdateBoard',
                      after: {
                        500: { target: 'playerMoveUpdateBoard' }
                      }
                    },
                    playerMoveUpdateBoard: {
                      id: 'playerMoveUpdateBoard',
                      entry: ['updatePlayerMove'],
                      always: [
                        { target: 'playerBonusMove', guard: 'isBonusMove' },
                        // { target: '#decideTurn', guard: and([not('isBonusMove'), not('isRoundOver')]) }
                        { target: '#toggleTurn', guard: not('isBonusMove')}
                      ]
                    },
                    playerBonusMove: {
                      id: 'playerBonusMove',
                      after: {
                        3000: {
                          actions: 'playerBonus',
                          target: '#toggleTurn'
                        }
                      }
                    }
                  },
                },
              },
              always: [
                { target: '#pickUpRemainingFlop', guard: 'isRoundOverWithRemainingFlop' },
                { target: '#endRound', guard: 'isRoundOver'},
                { target: '.dealCards', guard: and(['isHandOver', not('isBonusMove')]) },
                // { target: '.dealCards', guard: and(['isHandOver', not('isRoundOver')]) },
              ],
            },
            pickUpRemainingFlop: {
              id: 'pickUpRemainingFlop',
              entry: 'pickUpRemainingCards',
              after: {
                1200: {
                  target: 'updateBoardFinalMove'
                }
              }
            },
            updateBoardFinalMove: {
              id: 'updateBoardFinalMove',
              entry: 'updateFinalMove',
              after: {
                1500: {
                  target: '#endRound'
                }
              }
            },
          }
        },
        endRound: {
          id: 'endRound',
          entry: ['handleEndRound', 'handleToggleTurn'],
          after: {
            2800: {
              target: 'startRound'
            }
          }
        }
      },
      always: { target: '.loading', guard: not('hasLoaded') }
    },
    newGame: {
      id: 'newGame',
      entry: 'handleNewGame',
      always: { target: 'startGame'}
    }
  }
});

export default elevenMachine;