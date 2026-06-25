import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import calculateWinner from './helpers/calculateWinner'
import Board from './components/board/Board'
import GameInfo from './components/game-info/GameInfo'
import Scoreboard from './components/scoreboard/Scoreboard'

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      darkMode: false,
      xWins: 0,
      oWins: 0,
      draws: 0,
      totalGamesPlayed: 0,
      gameCompleted: false,
    }
  }

  componentDidMount() {
    const savedStats = localStorage.getItem('tictactoe-stats')
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats)
        this.setState({
          xWins: stats.xWins || 0,
          oWins: stats.oWins || 0,
          draws: stats.draws || 0,
          totalGamesPlayed: stats.totalGamesPlayed || 0,
        })
      } catch (e) {
        console.error('Failed to load stats from localStorage:', e)
      }
    }
  }

  saveStats(stats) {
    try {
      localStorage.setItem('tictactoe-stats', JSON.stringify(stats))
    } catch (e) {
      console.error('Failed to save stats to localStorage:', e)
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
    const newHistory = history.concat([
      {
        squares: squares,
      },
    ])
    const newStepNumber = history.length
    
    this.setState({
      history: newHistory,
      stepNumber: newStepNumber,
      xIsNext: !this.state.xIsNext,
    }, () => {
      this.checkGameCompletion(newHistory, newStepNumber)
    })
  }

  checkGameCompletion(history, stepNumber) {
    const current = history[stepNumber]
    const result = calculateWinner(current.squares)
    const winner = result ? result.winner : null
    const isBoardFull = current.squares.every(square => square !== null)
    
    if (!this.state.gameCompleted && (winner || isBoardFull)) {
      const newStats = { ...this.state }
      
      if (winner === 'X') {
        newStats.xWins += 1
      } else if (winner === 'O') {
        newStats.oWins += 1
      } else if (isBoardFull) {
        newStats.draws += 1
      }
      
      newStats.totalGamesPlayed += 1
      newStats.gameCompleted = true
      
      this.setState(newStats)
      this.saveStats(newStats)
    }
  }

  jumpTo(step) {
    console.log(step)
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  resetGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      gameCompleted: false,
    })
  }

  resetScoreboard() {
    const newStats = {
      xWins: 0,
      oWins: 0,
      draws: 0,
      totalGamesPlayed: 0,
      gameCompleted: false,
    }
    this.setState(newStats)
    this.saveStats(newStats)
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
          <section className="game">
            <div className="game-left">
              <GameInfo
                status={status}
                winner={winner}
                xIsNext={this.state.xIsNext}
              />
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                onResetGame={() => this.resetGame()}
                winningIndices={winningIndices}
              />
            </div>
            <Scoreboard
              xWins={this.state.xWins}
              oWins={this.state.oWins}
              draws={this.state.draws}
              totalGamesPlayed={this.state.totalGamesPlayed}
              onResetScoreboard={() => this.resetScoreboard()}
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
