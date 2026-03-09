import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import Controls from "./components/Controls";
import Leaderboard from "./components/Leaderboard";
import "./style.css";

export default function App() {
  const [difficulty, setDifficulty] = useState("medium");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="game-container">
      <Header 
        onReset={handleReset}
        showLeaderboard={showLeaderboard}
        setShowLeaderboard={setShowLeaderboard}
      />

      <Controls 
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <GameBoard 
        key={resetKey}
        difficulty={difficulty} 
      />

      {showLeaderboard && <Leaderboard difficulty={difficulty} />}
    </div>
  );
}