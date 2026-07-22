import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import calculateWinner from './helpers/calculateWinner'
import Board from './components/board/Board'
import GameInfo from './components/game-info/GameInfo'
import GameCounter from './components/game-counter/GameCounter'
import Moves from './components/moves/Moves'

class Game extends React.Component {
  constructor(props) {
    super(props)
    const savedGamesPlayed = localStorage.getItem('totalGamesPlayed')
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      darkMode: false,
      totalGamesPlayed: savedGamesPlayed ? parseInt(savedGamesPlayed, 10) : 0,
      lastGameWinner: null,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'

    const result = calculateWinner(squares)
    const winner = result ? result.winner : null
    const isBoardFull = squares.every((square) => square !== null)
    const isGameCompleted = Boolean(winner || isBoardFull)

    const updates = {
      history: history.concat([
        {
          squares: squares,
          location: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }

    // Count completed games here (not in render) so time travel cannot double-fire.
    if (isGameCompleted && !this.state.lastGameWinner) {
      const newTotal = this.state.totalGamesPlayed + 1
      updates.totalGamesPlayed = newTotal
      updates.lastGameWinner = winner || 'draw'
      localStorage.setItem('totalGamesPlayed', newTotal.toString())
    }

    this.setState(updates)
  }

  jumpTo(step) {
    const current = this.state.history[step]
    const result = calculateWinner(current.squares)
    const winner = result ? result.winner : null
    const isBoardFull = current.squares.every((square) => square !== null)
    const isGameCompleted = Boolean(winner || isBoardFull)

    // Clear completion when leaving a finished tip so a new branch can count once.
    // Keep it when already on / returning to the live finished tip.
    const updates = {
      stepNumber: step,
      xIsNext: step % 2 === 0,
    }

    if (!isGameCompleted || step < this.state.history.length - 1) {
      updates.lastGameWinner = null
    }

    this.setState(updates)
  }

  toggleDarkMode() {
    this.setState({
      darkMode: !this.state.darkMode,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const result = calculateWinner(current.squares)
    const winner = result ? result.winner : null
    const winningIndices = result ? result.indices : []
    const isBoardFull = current.squares.every((square) => square !== null)
    const isDraw = !winner && isBoardFull
    const isViewingHistory = this.state.stepNumber < history.length - 1

    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else if (isDraw) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <React.Fragment>
        <button
          className="theme-toggle"
          onClick={() => this.toggleDarkMode()}
          title={this.state.darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {this.state.darkMode ? '☀️' : '🌙'}
        </button>
        <main className={this.state.darkMode ? 'dark-mode' : ''}>
          <h1>Tic Tac Toe</h1>
          <GameCounter totalGamesPlayed={this.state.totalGamesPlayed} />
          <section className="game">
            <GameInfo
              status={status}
              winner={winner}
              xIsNext={this.state.xIsNext}
              isDraw={isDraw}
            />
            <section className="game-play">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                jumpTo={(i) => this.jumpTo(i)}
                winningIndices={winningIndices}
              />
              {isViewingHistory && (
                <p className="history-banner" role="status">
                  Viewing move #{this.state.stepNumber} — play a move to continue from here
                </p>
              )}
              <Moves
                history={history}
                jumpTo={(step) => this.jumpTo(step)}
                stepNumber={this.state.stepNumber}
              />
            </section>
          </section>
        </main>
      </React.Fragment>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Router basename={process.env.REACT_APP_URI}>
  <Routes>
    <Route path="/" element={<Game />} />
  </Routes>
</Router>)
