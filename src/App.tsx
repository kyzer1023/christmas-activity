import { GameProvider, useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import LeftPanel from './components/LeftPanel';
import WheelModal from './components/WheelModal';
import EndGameModal from './components/EndGameModal';
import './App.css';

const GameContainer = () => {
  const { phase, pendingEffect, resolveEffect } = useGame();

  if (phase === 'SETUP') {
    return <SetupScreen />;
  }

  return (
    <div className="game-layout">
      {/* Global Modal Layer */}
      <WheelModal
        isOpen={pendingEffect === 'random'}
        onComplete={(giftId) => resolveEffect(giftId)}
      />
      <EndGameModal />

      <LeftPanel />
      <GameBoard />
      <GameControls />
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;
