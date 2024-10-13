import { assertEvent, assign, fromPromise, not, setup } from 'xstate';
import { CardType } from "../lib";
// import { RickCharacters } from './services/RickApi';
// import { getRandomNumber } from './common/constants';
import { drawCardsFromDeck, fetchDeck, fetchResources } from '../utils';

const elevenMachine = setup({
  types: {
    events: {} as
      | { type: 'user.showRules'}
      | { type: 'user.play' }
      | { type: 'user.hideRules' }
      | { type: 'user.reject' }
      | { type: 'user.accept' }
      | {
          type: 'user.selectAnswer';
          answer: number;
        }
      | { type: 'user.nextQuestion' }
      | { type: 'user.selectHandCard' }
      | { type: 'user.playAgain' },
    context: {} as {
      cards: CardType[];
      hasLoaded: boolean;
      error: string;
      gameInProgress: boolean;
      round: number;
      turn: 'bot' | 'player';
      playerPoints: number;
      playerClubs: number;
      playerCards: CardType[];
      playerSidePile: CardType[];
      playerSelection: CardType[];
      flopCards: CardType[];
      botPoints: number;
      botClubs: number;
      botCards: CardType[];
      botSidePile: CardType[];
      botSelection: CardType[];
    }
  },
  guards: {
    // isAnswerCorrect: ({ context, event }) => {
    //   assertEvent(event, 'user.selectAnswer');
    //   if (!context.currentCharacter) return false;
    //   return event.answer === context.currentCharacter.id;
    // },
    hasLostGame: ({ context }) => {
      return context.botPoints >= 104;
    },
    hasWonGame: ({ context }) => {
      return context.playerPoints >= 104;
    }
  },
  actions: {
    // goToTriviaPage: () => {},
    newGame: assign({
      cards: [], // TODO: add new deck cards
      round: 0,
      turn: 'player',
      playerPoints: 0,
      playerClubs: 0,
      playerCards: [],
      playerSidePile: [],
      playerSelection: [],
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
    turn: 'player',
    playerPoints: 0,
    playerClubs: 0,
    playerCards: [],
    playerSidePile: [],
    playerSelection: [],
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
      initial: 'loadingData',
      states: {
        loadingData: {
          invoke: {
            src: 'loadInitialResources',
            onDone: {
              actions: assign({
                cards: ({ event }) => event.output,
                hasLoaded: true
              }),
              target: 'dataLoaded'
            }
          }
        },
        dataLoaded: {
          on: {
            'user.showRules': {
              target: 'rulesModal'
            },
            'user.play': {
              target: '#startGame'
            }
          }
        },
        rulesModal: {
          id: 'rulesModal',
          on: {
            'user.hideRules': {
              target: 'dataLoaded'
            }
          }
        },
      }
    },
    startGame: {
      id: 'startGame',
      initial: 'dealNewHand',
      entry: ['newGame'],
      states: {
        dealNewHand: {
          id: 'dealNewHand',
          initial: 'dealPlayerHand',
          entry: assign({
            gameInProgress: true
          }),
          states: {
            dealPlayerHand: {
              entry: assign({
                playerCards: ({ context }) => drawCardsFromDeck(context.cards, 4),
              }),
              target: 'dealBotHand'
            },
            dealBotHand: {
              entry: assign ({
                botCards: ({ context }) => drawCardsFromDeck(context.cards, 4),
              }),
              target: 'dealFlop'
            },
            dealFlop: {
              entry: assign ({
                flopCards: ({ context }) => drawCardsFromDeck(context.cards, 4),
              }),
              target: '#playerTurn'
            }
          }
        },
        playerTurn: {
          id: 'playerTurn',
          initial: 'selectHandCard',
          on: {
            'user.selectHandCard': {
              actions: (event) => {
                console.log('event');
                console.log(event);
              }
          },
          states: {
            selectHandCard: {
              on: {
                'user.selectFlopCard': [
                  {
                    target: 'flopCardSelected',
                    guard: 'isValidMove'
                  },
                  // {
                  //   target: 'incorrectAnswer',
                  //   guard: not('isAnswerCorrect')
                  // }
                ]
              }
            },
            // flopCardSelected: {
            //   entry: assign({
            //     playerSelectedFlop: ({ context }) => context.points + 10
            //   }),
            //   always: [
            //     {
            //       guard: 'hasLostGame',
            //       target: 'lostGame'
            //     },
            //     {
            //       guard: 'hasWonGame',
            //       target: 'wonGame'
            //     }
            //   ],
            //   on: {
            //     'user.nextQuestion': {
            //       target: '#loadQuestionData'
            //     }
            //   }
            // },
            // incorrectAnswer: {
            //   entry: assign({
            //     lifes: ({ context }) => context.lifes - 1
            //   }),
            //   always: [
            //     {
            //       guard: 'hasLostGame',
            //       target: 'lostGame'
            //     },
            //     {
            //       guard: 'hasWonGame',
            //       target: 'wonGame'
            //     }
            //   ],
            //   on: {
            //     'user.nextQuestion': {
            //       target: '#loadQuestionData'
            //     }
            //   }
            // },
            lostGame: {
              on: {
                'user.playAgain': {
                  target: '#startGame'
                }
              }
            },
            wonGame: {
              on: {
                'user.playAgain': {
                  target: '#startGame'
                }
              }
            }
          }
        }
      }
    }
  }}
});

export default elevenMachine;