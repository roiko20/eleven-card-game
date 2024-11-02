
import { useContext, useEffect, useState } from 'react';
import './App.css';
import { CardType, cardsData } from './lib';
import GameBoard from './components/GameBoard';
import useScreenSize from './hooks/useScreenSize';
import { CARD_BACK_SVG_PATH, DROP_AREA_SVG_PATH, createCardSVGPath, fetchDeck } from './utils';
import Welcome from './components/Welcome';
import { ThemeProvider } from 'styled-components';
import Tilt from './components/Tilt';
import Loader from './components/Loader';
import elevenMachine from './state/elevenMachine';
import { useMachine } from '@xstate/react';
import { ElevenMachineContext } from './context/AppContext';

const preloadImage = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

function App() {
  // const [snapshot, send] = useMachine(elevenMachine);
  // const [cards, setCards] = useState<CardType[]>([]);
  // const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const screenSize = useScreenSize();
  const state = ElevenMachineContext.useSelector((state) => state);

  // useEffect(() => {
  //   const loadResources = async () => {
  //     try {
  //       // draw deck
  //       const cards = await fetchDeck();
  //       setCards(cards); // Store fetched cards

  //       // preload SVGs
  //       const cardImagePromises = cards.map((card: CardType) => preloadImage(createCardSVGPath(card)));
  //       cardImagePromises.push(preloadImage(DROP_AREA_SVG_PATH));
  //       cardImagePromises.push(preloadImage(CARD_BACK_SVG_PATH));
  //       await Promise.all(cardImagePromises);

  //       setLoading(false);
  //     }
  //     catch (error) {
  //     console.error('Error loading resources:', error);
  //     setLoading(false); // Set loading to false even on error to prevent infinite loading
  //   }
  // };

  // loadResources();
  // }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  const startGame = () => {
    setGameStarted(true);
  }

  // const content =
  // isMenuOpen || !gameStarted
  //   ? <Welcome
  //       onStartGame={startGame}
  //       showBackButton={isMenuOpen}
  //       onBackClick={closeMenu}
  //     />
  //   : loading
  //     ? <Loader />
  //     : <GameBoard
  //         cards={cards}
  //         onMenuClick={openMenu}
  //       />;

  console.log('app state:');
  console.log(state);

  return (
    <ThemeProvider theme={{ ...screenSize }}>
       {screenSize.isSmScreen && <Tilt/>}
        {(state.matches('menu')) &&
          <Welcome
            onBackClick={closeMenu}
          />
        }
        {state.matches('startGame') &&
          <GameBoard onMenuClick={() => console.log('menu')}/>
        }
    </ThemeProvider>
  );
}

export default App;
