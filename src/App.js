import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, moves, recentRemoved, remMove }) {
  function ajacentEmpty(i) {
    if(i === 0){
      return (!squares[1] + !squares[3] + !squares[4]);
    }
    if(i === 1){
      return (!squares[0] + !squares[2] + !squares[3] + !squares[4] + !squares[5]);
    }
    if(i === 2){
      return (!squares[1] + !squares[5] + !squares[4]);
    }
    if(i === 3){
      return (!squares[0] + !squares[1] + !squares[4] + !squares[6] + !squares[7]);
    }
    if(i === 4){
      return (!squares[0] + !squares[1] + !squares[2] + !squares[3] + !squares[8] + !squares[5] + !squares[6] + !squares[7]);
    }
    if(i === 5){
      return (!squares[1] + !squares[2] + !squares[4] + !squares[7] + !squares[8]);
    }
    if(i === 6){
      return (!squares[3] + !squares[4] + !squares[7]);
    }
    if(i === 7){
      return (!squares[3] + !squares[4] + !squares[5] + !squares[6] + !squares[8]);
    }
    if(i === 8){
      return (!squares[4] + !squares[5] + !squares[7]);
    }
  }

  function isAjacent(x, y){
    if(x === 0 && (y === 1 ||y === 3 ||y === 4)){
      return true;
    }
    if(x === 1 && (y === 0 ||y === 3 ||y === 4 || y === 2 || y === 5)){
      return true;
    }
    if(x === 2 && (y === 1 ||y === 4 || y === 5)){
      return true;
    }
    if(x === 3 && (y === 1 ||y === 0 ||y === 4 || y===6 || y===7)){
      return true;
    }
    if(x === 4){
      return true;
    }
    if(x === 5 && (y === 2 || y === 1 || y === 4 || y === 7 || y===8)){
      return true;
    }
    if(x === 6 && (y === 3 || y === 7 || y === 4)){
      return true;
    }
    if(x === 7 && (y === 3 || y === 4 || y === 5 || y === 6 || y === 8)){
      return true;
    }
    if(x === 8 && (y === 7 ||y === 5 ||y === 4)){
      return true;
    }
    return false;
  }
  function handleClick(i) {
    if (moves < 6) {
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares);
    } else {
      if (remMove === 10) {

        if (calculateWinner(squares) || !squares[i]) {
          return;
        }

        let whichPlayerSquare = 2;
        if(squares[i] === 'X'){
          whichPlayerSquare = 0;
        }
        else if(squares[i] === 'O'){
          whichPlayerSquare = 1;
        }
        if((xIsNext && whichPlayerSquare) || (!xIsNext && !whichPlayerSquare)){
          return;
        }
        if(xIsNext && squares[4] === 'X' && ajacentEmpty(4) && i !== 4){
          return;
        }
        else if(!xIsNext && squares[4] === 'O' && ajacentEmpty(4) && i !== 4){
          return;
        }
        if(!ajacentEmpty(i)){
          return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = "";
        recentRemoved(i);
        onPlay(nextSquares);
      } else {
        if (
          isAjacent(remMove , i)
        ) {
          if (calculateWinner(squares) || squares[i]) {
            return;
          }
          const nextSquares = squares.slice();
          if (xIsNext) {
            nextSquares[i] = "X";
          } else {
            nextSquares[i] = "O";
          }
          recentRemoved(10);
          onPlay(nextSquares);
        }
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(20).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  const [remMove, setRemMove] = useState(10);
  function recentRemoved(removedMove) {
    setRemMove(removedMove);
  }

  const xIsNext = (currentMove % 2 === 0 && currentMove < 6) || (currentMove >= 6 && ((currentMove - 6) % 4) < 2);
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setRemMove(10);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          moves={currentMove}
          recentRemoved={recentRemoved}
          remMove={remMove}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
