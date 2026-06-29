import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import calculateWinner from './helpers/calculateWinner'
import Board from './components/board/Board'
import GameInfo from './components/game-info/GameInfo'
import GameCounter from './components/game-counter/GameCounter'

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
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    console.log(step)
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      lastGameWinner: null,
    })
  }

  incrementGamesPlayed() {
    const newTotal = this.state.totalGamesPlayed + 1
    this.setState({
      totalGamesPlayed: newTotal,
    })
    localStorage.setItem('totalGamesPlayed', newTotal.toString())
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
    
    // Check if game is completed (winner or draw)
    const isBoardFull = current.squares.every(square => square !== null)
    const isGameCompleted = winner || isBoardFull
    
    // Increment counter only when game transitions from incomplete to complete
    if (isGameCompleted && this.state.lastGameWinner !== winner && !this.state.lastGameWinner) {
      this.incrementGamesPlayed()
      this.setState({ lastGameWinner: winner || 'draw' })
    }
    
    let status
    if (winner) {
      status = 'Winner: ' + winner
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
            />
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              jumpTo={(i) => this.jumpTo(i)}
              winningIndices={winningIndices}
            />
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
