import { assertEvent, assign, fromPromise, not, setup } from 'xstate';
import { CardType } from "../lib";
// import { RickCharacters } from './services/RickApi';
// import { getRandomNumber } from './common/constants';
import { compareCards, dealCards, fetchDeck, fetchResources, isCardInCards, isValidJackMove, isValidMove, removeCardsFromCards, selectNonRoyaltyCards } from '../utils';

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
      botSelection: CardType[];
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
      botSelection: []
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
    botSelection: []
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
                const { playerCards, botCards, flopCards } = dealCards(context.cards, context.isPlayerTurn);
                
                return {
                  playerCards: playerCards,
                  botCards: botCards,
                  flopCards: flopCards,
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
              id: 'botTurn'
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
                { target: 'playerMoveUpdateBoard', guard: 'isValidMove' },
              ],
              exit: assign({
                isPlayerTurn: false
              })
            },
            playerJackMoveUpdateBoard: {
              id: 'playerJackMoveUpdateBoard',
              entry: assign({
                playerFlopSelection: ({ context }) => selectNonRoyaltyCards(context.flopCards)
              }),
              after: {
                1200: {
                  target: 'playerMoveUpdateBoard'
                }
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
                playerHandSelection: null
              }),
              always: {target: 'decideTurn'}
            }
          },
        },
      }
    }
  }
});

export default elevenMachine;