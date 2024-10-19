import { assertEvent, assign, fromPromise, not, setup } from 'xstate';
import { CardType } from "../lib";
// import { RickCharacters } from './services/RickApi';
// import { getRandomNumber } from './common/constants';
import { compareCards, dealCards, fetchDeck, fetchResources, getBestCardToDrop, getBestMove, isCardInCards, isValidJackMove, isValidMove, removeCardsFromCards, selectCardsByRoyalty } from '../utils';

interface ElevenContext {
  cards: CardType[];
    hasLoaded: boolean;
    error: string;
    gameInProgress: boolean;
    round: number;
    isPlayerTurn: boolean;
    playerPoints: number;
    playerClubs: number;
    playerCards: CardType[];
    playerSidePile: CardType[];
    playerHandSelection: CardType | null;
    playerFlopSelection: CardType[],
    flopCards: CardType[];
    botPoints: number;
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
  guards: {
    isValidMove: ({ context, event }) => {
      // assertEvent(event, 'user.selectAnswer');
      return isValidMove(context.playerHandSelection, context.playerFlopSelection);
    },
    isValidJackMove: ({ context }) => isValidJackMove(context.playerHandSelection, context.flopCards),
    isPlayerHandCardSelected: ({ context }) => !!context.playerHandSelection,
    isHandOver: ({ context }) => context.botCards.length === 0 && context.playerCards.length === 0,
    hasLostGame: ({ context }) => {
      return context.botPoints >= 104;
    },
    isBotTurn: ({ context }) => !context.isPlayerTurn,
    hasWonGame: ({ context }) => {
      return context.playerPoints >= 104;
    }
  },
  actions: {
    // goToTriviaPage: () => {},
    newGame: assign({
      cards: [], // TODO: add new deck cards
      round: 0,
      isPlayerTurn: true,
      playerPoints: 0,
      playerClubs: 0,
      playerCards: [],
      playerSidePile: [],
      playerHandSelection: null,
      playerFlopSelection: [],
      flopCards: [],
      botPoints: 0,
      botClubs: 0,
      botCards: [],
      botSidePile: [],
      botHandSelection: null,
      botFlopSelection: []
    })
  },
  actors: {
    loadInitialResources: fromPromise(fetchResources),
    loadNewDeck: fromPromise(fetchDeck)
  }
}).createMachine({
  id: 'elevenMachine',
  initial: 'welcome',
  context: {
    cards: [],
    hasLoaded: false,
    error: '',
    gameInProgress: false,
    round: 0,
    isPlayerTurn: true,
    playerPoints: 0,
    playerClubs: 0,
    playerCards: [],
    playerSidePile: [],
    playerHandSelection: null,
    playerFlopSelection: [],
    flopCards: [],
    botPoints: 0,
    botClubs: 0,
    botCards: [],
    botSidePile: [],
    botHandSelection: null,
    botFlopSelection: []
  },
  states: {
    welcome: {
      id: 'welcome',
      initial: 'mainMenu',
      invoke: {
        src: 'loadInitialResources',
        onDone: {
          actions: assign({
            cards: ({ event }) => event.output,
            hasLoaded: true
          })
        }
      },
      states: {
        mainMenu: {
          on: {
            'user.showRules': {
              target: 'rulesModal'
            },
            'user.play': {
              target: '#startGame'
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
    menu: {
      id: 'menu',
      on: {
        'user.closeMenu': {
          target: '#startGame.history'
        }
      }
    },
    startGame: {
      id: 'startGame',
      initial: 'startRound',
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
        startRound: {
          id: 'startRound',
          initial: 'dealCards',
          states: {
            dealCards: {
              id: 'dealCards',
              entry: assign(({ context }) => {
                const { playerCards, botCards, flopCards } = dealCards(context.cards, context.isPlayerTurn, context.flopCards.length === 0);
                
                return {
                  playerCards: playerCards,
                  botCards: botCards,
                  flopCards: flopCards ?? context.flopCards,
                  cards: context.cards.slice(12),
                };
              }),
              always: 'decideTurn'
            },
            decideTurn: {
              id: 'decideTurn',
              always: [
                { target: 'botTurn', guard: 'isBotTurn'},
                { target: 'playerTurn', guard: not('isBotTurn')}
              ]
            },
            botTurn: {
              id: 'botTurn',
              initial: 'setMove',
              states: {
                setMove: {
                  id: 'setMove',
                  entry: assign(({ context }) => {
                    const bestMove = getBestMove(context.botCards, context.flopCards);
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
                  after: {
                    2000: {
                      target: '#botMoveUpdateBoard'
                    }
                  }
                },
              }
            },
            playerTurn: {
              id: 'playerTurn',
              on: {
                'user.selectHandCard': {
                  actions: assign({
                    playerHandSelection: ({ context, event }) => 
                      compareCards(context.playerHandSelection, event.card) ? null : event.card,
                  }),
                },
                'user.selectFlopCard': {
                  actions: assign({
                    playerFlopSelection: ({ context, event }) => 
                      isCardInCards(event.card, context.playerFlopSelection)
                        ? removeCardsFromCards([event.card], context.playerFlopSelection)
                        : [...context.playerFlopSelection, event.card],
                  })
                },
                'user.dropCard': {
                  guard: 'isPlayerHandCardSelected',
                  actions: assign({
                    flopCards: ({ context }) => [context.playerHandSelection!, ...context.flopCards],
                    playerCards: ({ context }) => removeCardsFromCards([context.playerHandSelection!], context.playerCards),
                    playerHandSelection: null,
                    isPlayerTurn: false
                  }),
                  target: 'decideTurn'
                },
                'user.cancelSelection': {
                  actions: assign({
                    playerHandSelection: null,
                    playerFlopSelection: []
                  })
                }
              },
              always: [
                { target: 'playerJackMoveUpdateBoard', guard: 'isValidJackMove' },
                { target: 'playerMoveDelayedUpdateBoard', guard: 'isValidMove' }
              ],
            },
            botMoveUpdateBoard: {
              id: 'botMoveUpdateBoard',
              entry: assign(({ context }) => {
                // cards collected - add to side pile
                if (context.botFlopSelection.length) {
                  return {
                    botSidePile: [
                      ...context.botSidePile,
                      context.botHandSelection!,
                      ...context.botFlopSelection
                    ],
                    flopCards: removeCardsFromCards(context.botFlopSelection, context.flopCards),
                    botCards: removeCardsFromCards([context.botHandSelection!], context.botCards),
                    botFlopSelection: [],
                    botHandSelection: null,
                  }
                }
                // card dropped - add to flop
                return {
                  flopCards: [context.botHandSelection!, ...context.flopCards],
                  botCards: removeCardsFromCards([context.botHandSelection!], context.botCards),
                  botHandSelection: null
                }
              }),
              exit: assign({
                isPlayerTurn: true
              }),
              always: {target: 'decideTurn'}
            },
            playerJackMoveUpdateBoard: {
              id: 'playerJackMoveUpdateBoard',
              entry: assign({
                playerFlopSelection: ({ context }) => selectCardsByRoyalty(context.flopCards, false)
              }),
              after: {
                1200: {
                  target: 'playerMoveUpdateBoard'
                }
              }
            },
            playerMoveDelayedUpdateBoard: {
              id: 'playerMoveDelayedUpdateBoard',
              after: {
                600: { target: 'playerMoveUpdateBoard' }
              }
            },
            playerMoveUpdateBoard: {
              id: 'playerMoveUpdateBoard',
              entry: assign({
                playerSidePile: ({ context }) => [
                  ...context.playerSidePile,
                  context.playerHandSelection!,
                  ...context.playerFlopSelection
                ],
                flopCards: ({ context }) => removeCardsFromCards(context.playerFlopSelection, context.flopCards),
                playerCards: ({ context }) => removeCardsFromCards([context.playerHandSelection!], context.playerCards),
                playerFlopSelection: [],
                playerHandSelection: null,
                isPlayerTurn: false
              }),
              always: {target: 'decideTurn'}
            }
          },
          always: [
            { target: '.dealCards', guard: 'isHandOver' },
          ],
        },
      }
    }
  }
});

export default elevenMachine;