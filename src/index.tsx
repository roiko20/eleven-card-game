import ReactDOM from 'react-dom/client';
import App from './App';
import { ElevenMachineContext } from './context/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <ElevenMachineContext.Provider>
      <App />
    </ElevenMachineContext.Provider>
);
