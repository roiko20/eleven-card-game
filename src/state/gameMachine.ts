// import { EventObject, createMachine } from 'xstate';
// import { cardsData } from '../lib';
// import Score from '../components/Score';
export {};

// function assertEvent<TEvent extends EventObject, Type extends TEvent['type']>(
//     ev: TEvent,
//     type: Type
//   ): asserts ev is Extract<TEvent, { type: Type }> {
//     if (ev.type !== type) {
//       throw new Error('Unexpected event type.');
//     }
//   }

//   const context = {
//     deck: cardsData
//   };

//   export const elevenMachine = createMachine({
//     initial: 'menu',
//     context,
//     states: {
//         playing: {
//             always: [
//                 { target: 'gameOver.winner', guard: 'checkWin' }
//             ],
//             on: {
//                 PLAY: [
//                     {
//                         target: 'playing',
//                         guard: 'isValidMove',
//                         actions: 'updateBoard'
//                     }
//                 ]
//             }
//         },
//         gameOver: {
//             initial: 'winner',
//             states: {
//                 winner: {
//                     tags: 'winner',
//                     entry: 'setWinner'
//                 },
//             },
//             on: {
//                 RESET: {
//                     target: 'playing',
//                     actions: 'resetGame'
//                 }
//             }
//         }
//     }
// });