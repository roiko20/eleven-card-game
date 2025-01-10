# Eleven <img src="./public/icons/clubs.svg" alt="Clubs logo" width="34" height="34">

Can you master the art of eleven?  
Match cards to outplay the bot in a race to 104 points!

Challenge accepted? <img src="./public/icons/bot.png" alt="bot" width="24" height="24">  
[Play now!](https://linkHere)

## Rules

### Objective
<img src="./public/icons/points.png" alt="points" width="24" height="24"> Collect flop cards and be the first to score 104 points!

### Gameplay
On your turn, play one of your hand cards with one or more flop cards to collect them:
- <img src="./public/icons/eleven.png" alt="eleven" width="24" height="24"> Create a sum of 11 with your selected card and flop cards to collect.
- <img src="./public/icons/king.png" alt="king" width="24" height="24"> King collects King.
- <img src="./public/icons/queen.png" alt="queen" width="24" height="24"> Queen collects Queen.
- <img src="./public/icons/prince.png" alt="prince" width="24" height="24"> Jack collects all flop cards except Kings and Queens.

#### Example moves:
- Play a 5, collect a 6 from the flop.
- Play a 3, collect a 7 and an Ace from the flop.
If no moves are available, drop a card.  
At the end of each round, the last player to collect flop cards gets all remaining flop cards.

### Round Scoring
26 points are available each round:
- <img src="./public/icons/clubs.svg" alt="clubs" width="24" height="24"> Collect most club suit cards (7+ clubs) - 13 points.
- <img src="./public/icons/10ofDiamonds.png" alt="10 of diamonds" width="24" height="24"> Ten of diamonds - 3 points.
- <img src="./public/icons/2ofClubs.png" alt="10 of diamonds" width="24" height="24"> Two of clubs - 2 points.
- <img src="./public/icons/jack.png" alt="jack" width="24" height="24"> Jack (any suit) - 1 point.
- <img src="./public/icons/ace.png" alt="ace" width="24" height="24"> Ace (any suit) - 1 point.
- <img src="./public/icons/joker.png" alt="joker" width="24" height="24"> **Bonus** - clear the flop (except for the last round, not using a jack) - 5 points.

## What's inside
- [React](https://react.dev/) for UI components.
- [TypeScript](https://www.typescriptlang.org/) for type safety.
- [XState](https://xstate.js.org/) for managing game state.
- [Framer Motion](https://motion.dev/) for smooth animations.
- [Styled-Components](https://styled-components.com/) for components styling.

## Development
Install [NodeJS](https://nodejs.org/en/download/).
    ```bash
    git clone https://github.com/roiko20/eleven-card-game  
    cd eleven-card-game  
    npm install  
    npm run watch  
    ```
Visit [localhost:3000](http://localhost:3000)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Code size in bytes](https://img.shields.io/github/languages/code-size/roiko20/eleven-card-game)