import './App.css';
import GameBoard from './components/GameBoard';
import useScreenSize from './hooks/useScreenSize';
import MainMenu from './components/MainMenu';
import { ThemeProvider } from 'styled-components';
import Tilt from './components/Tilt';
import Loader from './components/Loader';
import { ElevenMachineContext } from './context/AppContext';

function App() {
  const screenSize = useScreenSize();
  const state = ElevenMachineContext.useSelector((state) => state);

  console.log('here');

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
    </ThemeProvider>
  );
}

export default App;
