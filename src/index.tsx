import ReactDOM from 'react-dom/client';
import App from './App';
import { ElevenMachineContext } from './context/AppContext';

console.log('hereeee');
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ElevenMachineContext.Provider>
    <App />
  </ElevenMachineContext.Provider>
);
