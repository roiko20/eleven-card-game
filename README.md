# <img src="./public/icons/clubs.svg" alt="Clubs logo" width="34" height="34"> Eleven

Are you ready to master the art of 11?  
Match cards to outplay the bot in a race to 104 points!

[Play here!](https://linkHere)

## Rules

#### Objective
<img src="./public/icons/points.png" alt="points" width="26" height="26"> Collect flop cards and be the first to score 104 points!

#### Gameplay
On your turn, play one of your hand cards with one or more flop cards to collect them:

<img src="./public/icons/eleven.png" alt="eleven" width="26" height="26"> Create a sum of 11 with your selected card and flop cards to collect.  
<img src="./public/icons/king.png" alt="king" width="26" height="26"> King collects King.  
<img src="./public/icons/queen.png" alt="queen" width="26" height="26"> Queen collects Queen.  
<img src="./public/icons/prince.png" alt="prince" width="26" height="26"> Jack collects all flop cards except Kings and Queens.

If no moves are available, drop a card.  
At the end of each round, the last player to collect flop cards gets all remaining flop cards.

**Example moves:**
- Play a 5, collect a 6 from the flop.
- Play a 3, collect a 7 and an Ace from the flop.

#### Round Scoring
26 points are available each round:

<img src="./public/icons/clubs.svg" alt="clubs" width="26" height="26"> Collect most club suit cards (7+ clubs) - 13 points.  
<img src="./public/icons/10ofDiamonds.png" alt="10 of diamonds" width="26" height="26"> Ten of diamonds - 3 points.  
<img src="./public/icons/2ofClubs.png" alt="10 of diamonds" width="26" height="26"> Two of clubs - 2 points.  
<img src="./public/icons/jack.png" alt="jack" width="26" height="26"> Jack (any suit) - 1 point.  
<img src="./public/icons/ace.png" alt="ace" width="26" height="26"> Ace (any suit) - 1 point.  
<img src="./public/icons/joker.png" alt="joker" width="26" height="26"> **Bonus** - clear the flop (except for the last round, not using a jack) - 5 points.

## What's inside
<img src="https://react.dev/favicon-32x32.png" alt="react" width="24" height="24"> &nbsp;[React](https://react.dev/) for UI components.  
<img src="https://www.typescriptlang.org/favicon-32x32.png" alt="typescript" width="24" height="24"> &nbsp;[TypeScript](https://www.typescriptlang.org/) for type safety.  
<img src="https://stately.ai/icon.svg" alt="xstate" width="24" height="24"> &nbsp;[XState](https://xstate.js.org/) for managing game state.  
<img src="https://framerusercontent.com/images/FEF0Xp0qllCZsG1uilpmdZAzD8.png" alt="framer motion" width="24" height="24"> &nbsp;[Framer Motion](https://motion.dev/) for smooth animations.  
<img src="https://avatars.githubusercontent.com/u/20658825" alt="styled components" width="24" height="24"> &nbsp;[Styled-Components](https://styled-components.com/) for components styling.  

## Development
Install [NodeJS](https://nodejs.org/en/download/)  

    git clone https://github.com/roiko20/eleven-card-game

    cd eleven-card-game

    npm install

    npm run watch
Visit [localhost:3000](http://localhost:3000)  

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Code size in bytes](https://img.shields.io/github/languages/code-size/roiko20/eleven-card-game)