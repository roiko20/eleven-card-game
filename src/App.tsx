import './App.css';
import GameBoard from './components/GameBoard';
import useScreenSize from './hooks/useScreenSize';
import MainMenu from './components/MainMenu';
import { ThemeProvider } from 'styled-components';
import Tilt from './components/Tilt';
import Loader from './components/Loader';
import { ElevenMachineContext } from './context/AppContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const screenSize = useScreenSize();
  const state = ElevenMachineContext.useSelector((state) => state);

  return (
    <ThemeProvider theme={{ ...screenSize }}>
       {screenSize.isSmScreen && <Tilt/>}
        {state.matches('menu') &&
          <MainMenu />
        }
        {(state.matches('startGame') || state.matches('gameOver')) &&
          <GameBoard />
        }
        {state.matches('newGame') && 
          <Loader />
        }
        <Analytics />
    </ThemeProvider>
  );
}

export default App;
