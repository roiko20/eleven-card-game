# Eleven <img src="./public/icons/clubs.svg" alt="Clubs logo" width="34" height="34">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Code size in bytes](https://img.shields.io/github/languages/code-size/roiko20/eleven-card-game)

A fast-paced card game where you race to 104 points by collecting flop cards and outsmarting your bot opponent.
Play your cards wisely, create sums of 11, match Kings or queens, or use your Jack to grab all cards!
Sounds easy? <img src="./public/icons/bot.png" alt="bot" width="24" height="24"> [Let's play!][https://linkHere]

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
- <img src="./public/icons/club.png" alt="club" width="24" height="24"> Collect most club suit cards (7+ clubs) - 13 points.
- <img src="./public/icons/10ofDiamonds.png" alt="10 of diamonds" width="24" height="24"> Ten of diamonds - 3 points.
- <img src="./public/icons/2ofClubs.png" alt="10 of diamonds" width="24" height="24"> Two of clubs - 2 points.
- <img src="./public/icons/jack.png" alt="jack" width="24" height="24"> Jack (any suit) - 1 point.
- <img src="./public/icons/ace.png" alt="ace" width="24" height="24"> Ace (any suit) - 1 point.
- <img src="./public/icons/joker.png" alt="joker" width="24" height="24"> **Bonus** - clear the flop (except for the last round, not using a jack) - 5 points.

## What's inside
- **React** + **Framer Motion** for seamless animations.
- **TypeScript** for robust type safety.
- **XState** for managing the game state and keeping things under control.

## Development
Install [NodeJS](https://nodejs.org/en/download/).
    ```bash
    git clone https://github.com/roiko20/eleven-card-game
    cd eleven-card-game
    npm install
    npm run watch
    ```
Visit [localhost:3000](http://localhost:3000)

## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details