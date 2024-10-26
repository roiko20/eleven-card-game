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
    isPlayerHandCardSelected: ({ context }) => !!context.playerHandSelection,
    isValidMove: ({ context, event }) => {
      // assertEvent(event, 'user.selectAnswer');
      return isValidMove(context.playerHandSelection, context.playerFlopSelection);
    },
    isValidJackMove: ({ context }) => isValidJackMove(context.playerHandSelection, context.flopCards),
    isBonusMove: ({ context }) => context.flopCards.length === 0 && !context.isLastHand && context.lastPlayedHandCard?.value !== 'JACK',
    // isBotMostClubsMove: ({ context }) => context.botPreviousClubs < 7 && context.botClubs >= 7,
    // isPlayerMostClubsMove: ({ context }) => context.playerPreviousClubs < 7 && context.playerClubs >= 7,
    isRoundOver : ({ context }) => context.isLastHand && context.flopCards.length > 0 && context.botCards.length === 0 && context.playerCards.length === 0,
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
  actions: {
    // goToTriviaPage: () => {},
    newGame: assign({
      cards: [], // TODO: add new deck cards
      round: 0,
      isPlayerTurn: false,
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
    isPlayerTurn: false,
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
                const isNewRound = context.cards.length === 52;
                const { playerCards, botCards, flopCards } = dealCards(context.cards, context.isPlayerTurn, isNewRound);
                let updatedDeck = flopCards ? context.cards.slice(12) : context.cards.slice(8);
                const isLastHand = updatedDeck.length === 0;

                if (isLastHand) {
                  const newDeck = shuffleDeck([
                    ...botCards,
                    ...context.botSidePile,
                    ...context.flopCards,
                    ...playerCards,
                    ...context.playerSidePile
                  ]);
                  updatedDeck = newDeck;
                }
                
                return {
                  round: isNewRound ? context.round + 1 : context.round,
                  isPlayerTurn: isNewRound ? !context.isPlayerTurn : context.isPlayerTurn,
                  playerCards: playerCards,
                  botCards: botCards,
                  flopCards: flopCards ?? context.flopCards,
                  cards: updatedDeck,
                  botSidePile: isNewRound ? [] : context.botSidePile,
                  playerSidePile: isNewRound ? [] : context.playerSidePile,
                  botPreviousClubs: isNewRound ? 0 : context.botPreviousClubs,
                  botClubs: isNewRound ? 0 : context.botClubs,
                  playerPreviousClubs: isNewRound ? 0 : context.playerPreviousClubs,
                  playerClubs: isNewRound ? 0 : context.playerClubs,
                  isLastHand: isLastHand
                };
              }),
              always: 'decideTurn'
            },       
            decideTurn: {
              id: 'decideTurn',
              always: [
                { target: '#endRound', guard: 'isRoundOver' },
                { target: 'dealCards', guard: 'isHandOver' },
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
                    1700: {
                      target: '#botMoveUpdateBoard'
                    }
                  }
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
                  exit: assign({
                    isPlayerTurn: true
                  }),
                  always: [
                    { target: 'botBonusMove', guard: 'isBonusMove' },
                    // { target: '#decideTurn', guard: and([not('isBonusMove'), not('isRoundOver')]) } 
                    { target: '#decideTurn', guard: not('isBonusMove') }
                  ]
                },
                botBonusMove: {
                  id: 'botBonusMove',
                  entry: assign({
                    isPlayerTurn: false
                  }),
                  after: {
                    3000: {
                      actions: assign({
                        botPoints: ({ context }) => context.botPoints + 5,
                        isPlayerTurn: true
                      }),
                      target: '#decideTurn'
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
                        lastPlayedHandCard: ({ context }) => context.playerHandSelection,
                        playerHandSelection: null,
                        isPlayerTurn: false
                      }),
                      target: '#decideTurn'
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
                  entry: assign({
                    isPlayerTurn: false
                  }),
                  after: {
                    500: { target: 'playerMoveUpdateBoard' }
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
                    playerPoints: ({ context }) => context.playerPoints + getCardsScore([context.playerHandSelection!, ...context.playerFlopSelection], context.playerClubs),
                    playerPreviousClubs: ({ context }) => context.playerClubs,
                    playerClubs: ({ context }) => context.playerClubs + getNumOfClubs([context.playerHandSelection!, ...context.playerFlopSelection]),
                    flopCards: ({ context }) => removeCardsFromCards(context.playerFlopSelection, context.flopCards),
                    playerCards: ({ context }) => removeCardsFromCards([context.playerHandSelection!], context.playerCards),
                    playerFlopSelection: [],
                    lastPlayedHandCard: ({ context }) => context.playerHandSelection,
                    playerHandSelection: null,
                    isPlayerTurn: false,
                    isPlayerLastToCollect: true
                  }),
                  always: [
                    { target: 'playerBonusMove', guard: 'isBonusMove' },
                    // { target: '#decideTurn', guard: and([not('isBonusMove'), not('isRoundOver')]) }
                    { target: '#decideTurn', guard: not('isBonusMove')}
                  ]
                },
                playerBonusMove: {
                  id: 'playerBonusMove',
                  after: {
                    3000: {
                      actions: assign({
                        playerPoints: ({ context }) => context.playerPoints + 5
                      }),
                      target: '#decideTurn'
                    }
                  }
                }
              },
            },
          },
          always: [
            { target: '#endRound', guard: 'isRoundOver' },
            { target: '.dealCards', guard: 'isHandOver' },
            // { target: '.dealCards', guard: and(['isHandOver', not('isRoundOver')]) },
          ],
        },
        endRound: {
          id: 'endRound',
          entry: assign(({ context }) => {
            if (context.isPlayerLastToCollect) {
              return {
                playerFlopSelection: context.flopCards,
              }
            }
            return {
              botFlopSelection: context.flopCards,
            }
          }),
          after: {
            1200: {
              target: 'updateBoardEndRound'
            }
          }
        },
        updateBoardEndRound: {
          id: 'updateBoardEndRound',
          entry: assign(({ context }) => {
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
                isLastHand: false
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
              playerFlopSelection: [],
              isLastHand: false
            }
          }),
          after: {
            1800: {
              target: 'startRound'
            }
          }
        }
      }
    }
  }
});

export default elevenMachine;