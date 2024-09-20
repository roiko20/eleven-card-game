
import React from 'react';
import './App.css';
import Card from './components/Card';
import {cardsData} from './lib';
import GameBoard from './components/GameBoard';
import useScreenSize from './hooks/useScreenSize';
import { ThemeProvider } from 'styled-components';

const defaultTheme = {
  isSmScreen: false,
  isMdScreen: false,
  isLgScreen: true,
};

function App() {
  const screenSize = useScreenSize();
  return (
    <ThemeProvider theme={{ ...defaultTheme, ...screenSize }}>
          <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <GameBoard cards={cardsData}/>
    </div>
    </ThemeProvider>
  );
}

export default App;
