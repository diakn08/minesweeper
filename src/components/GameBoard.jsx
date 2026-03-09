import { useState, useEffect } from "react";
import Cell from "./Cell";

const boardSize = 10;

export default function GameBoard({ difficulty }) {
  const minesSettings = {
    easy: 3,
    medium: 10,
    hard: 25
  };

  const [board, setBoard] = useState([]);
  const [minesCount, setMinesCount] = useState(minesSettings[difficulty]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (!gameOver && !win) {
      timer = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameOver, win]);

  useEffect(() => {
    setMinesCount(minesSettings[difficulty]);
    createBoard();
    setGameOver(false);
    setWin(false);
    setTime(0);
  }, [difficulty]);

  function createBoard(firstClickRow = null, firstClickCol = null) {
    const newBoard = [];
    const totalMines = minesSettings[difficulty];

    // Создаем пустую доску
    for (let i = 0; i < boardSize; i++) {
      const row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        });
      }
      newBoard.push(row);
    }

    // Если это первый клик, расставляем мины
    if (firstClickRow !== null && firstClickCol !== null) {
      // Расставляем мины
      let minesPlaced = 0;
      while (minesPlaced < totalMines) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        
        if (!newBoard[row][col].isMine && 
            !(row === firstClickRow && col === firstClickCol)) {
          newBoard[row][col].isMine = true;
          minesPlaced++;
        }
      }

      // Подсчитываем соседей
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (!newBoard[i][j].isMine) {
            let count = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < boardSize && nj >= 0 && nj < boardSize) {
                  if (newBoard[ni][nj].isMine) count++;
                }
              }
            }
            newBoard[i][j].neighborMines = count;
          }
        }
      }

      // Открываем первую клетку
      if (newBoard[firstClickRow][firstClickCol].neighborMines === 0) {
        revealEmpty(newBoard, firstClickRow, firstClickCol);
      } else {
        newBoard[firstClickRow][firstClickCol].isRevealed = true;
      }
    }

    setBoard(newBoard);
  }

  function revealEmpty(board, row, col) {
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return;
    
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged || cell.isMine) return;
    
    cell.isRevealed = true;
    
    if (cell.neighborMines === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          revealEmpty(board, row + di, col + dj);
        }
      }
    }
  }

  function checkWin(board) {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = board[i][j];
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  }

  function revealAllMines(board) {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j].isMine) {
          board[i][j].isRevealed = true;
        }
      }
    }
  }

  function saveToLeaderboard() {
    const leaderboardKey = `minesweeper-leaderboard-${difficulty}`;
    const existing = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    const newRecord = { time, date: new Date().toISOString() };
    const updated = [...existing, newRecord]
      .sort((a, b) => a.time - b.time)
      .slice(0, 10);
    localStorage.setItem(leaderboardKey, JSON.stringify(updated));
  }

  function handleClick(row, col) {
    if (gameOver || win) return;
    
    const newBoard = JSON.parse(JSON.stringify(board)); // Глубокое копирование
    const cell = newBoard[row][col];
    
    if (cell.isRevealed || cell.isFlagged) return;
    
    // Проверяем, первый ли это клик
    const isFirstMove = board.flat().every(c => !c.isRevealed);
    if (isFirstMove) {
      createBoard(row, col);
      return;
    }
    
    if (cell.isMine) {
      revealAllMines(newBoard);
      setGameOver(true);
      setBoard(newBoard);
      return;
    }
    
    if (cell.neighborMines === 0) {
      revealEmpty(newBoard, row, col);
    } else {
      cell.isRevealed = true;
    }
    
    setBoard(newBoard);
    
    if (checkWin(newBoard)) {
      setWin(true);
      saveToLeaderboard();
    }
  }

  function handleRightClick(e, row, col) {
    e.preventDefault();
    
    if (gameOver || win) return;
    
    const newBoard = [...board];
    const cell = newBoard[row][col];
    
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      setBoard(newBoard);
      
      const flaggedCount = newBoard.flat().filter(c => c.isFlagged).length;
      setMinesCount(minesSettings[difficulty] - flaggedCount);
    }
  }

  return (
    <div className="game-board">
      {board.map((row, i) =>
        row.map((cell, j) => (
          <Cell
            key={`${i}-${j}`}
            cell={cell}
            onClick={() => handleClick(i, j)}
            onRightClick={(e) => handleRightClick(e, i, j)}
          />
        ))
      )}
      {(gameOver || win) && (
        <div className="game-overlay">
          {gameOver && <div className="game-over">💥 GAME OVER 💥</div>}
          {win && <div className="game-win">🎉 YOU WIN! 🎉 Time: {time}s</div>}
        </div>
      )}
    </div>
  );
}