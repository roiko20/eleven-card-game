
import { useEffect, useState } from 'react';
import './App.css';
import { CardType, cardsData } from './lib';
import GameBoard from './components/GameBoard';
import useScreenSize from './hooks/useScreenSize';
import { CARD_BACK_SVG_PATH, DROP_AREA_SVG_PATH, createCardSVGPath } from './utils';
import Welcome from './components/Welcome';
import { ThemeProvider } from 'styled-components';
import Tilt from './components/Tilt';
import Loader from './components/Loader';

const defaultTheme = {
  isSmScreen: false,
  isMdScreen: false,
  isLgScreen: true,
};

const preloadImage = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

function App() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        // draw deck
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');
        const data = await response.json();
        setCards(data.cards); // Store fetched cards

        // preload SVGs
        const cardImagePromises = data.cards.map((card: any) => preloadImage(createCardSVGPath(card)));
        cardImagePromises.push(preloadImage(DROP_AREA_SVG_PATH));
        cardImagePromises.push(preloadImage(CARD_BACK_SVG_PATH));
        await Promise.all(cardImagePromises);

        setLoading(false);
      }
      catch (error) {
      console.error('Error loading resources:', error);
      setLoading(false); // Set loading to false even on error to prevent infinite loading
    }
  };

  loadResources();
  }, []);

  const screenSize = useScreenSize();

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  const startGame = () => {
    setGameStarted(true);
  }

  const content =
  isMenuOpen || !gameStarted
    ? <Welcome
        onStartGame={startGame}
        showBackButton={isMenuOpen}
        onBackClick={closeMenu}
      />
    : loading
      ? <Loader />
      : <GameBoard
          cards={cards}
          onMenuClick={openMenu}
        />;

  return (
    <ThemeProvider theme={{ ...defaultTheme, ...screenSize }}>
      {screenSize.isSmScreen && <Tilt/>}
      {content}
    </ThemeProvider>
  );
}

export default App;
