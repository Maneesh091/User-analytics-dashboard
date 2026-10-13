import { useState } from 'react';
import Sessions from './components/session';
import Heatmap from './components/heatmap';
import './App.css';

export default function App() {
  const [tab, setTab] = useState('sessions'); // kaun sa tab khula hai

  return (
    <div className="container">
      <h2>User Analytics Dashboard</h2>

      <div className="tabs">
        <button className={tab === 'sessions' ? 'tab active' : 'tab'} onClick={() => setTab('sessions')}>
          Sessions
        </button>
        <button className={tab === 'heatmap' ? 'tab active' : 'tab'} onClick={() => setTab('heatmap')}>
          Heatmap
        </button>
      </div>

      {tab === 'sessions' ? <Sessions /> : <Heatmap />}
    </div>
  );
}