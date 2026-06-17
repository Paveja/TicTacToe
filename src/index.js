import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import calculateWinner from './helpers/calculateWinner'
import Board from './components/board/Board'
import GameInfo from './components/game-info/GameInfo'

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
      theme: localStorage.getItem('theme') || 'light',
    }
  }

  componentDidMount() {
    document.getElementById('root').setAttribute('data-theme', this.state.theme)
  }

  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light'
    this.setState({ theme: newTheme })
    localStorage.setItem('theme', newTheme)
    document.getElementById('root').setAttribute('data-theme', newTheme)
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
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
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
          onClick={() => this.toggleTheme()}
          aria-label={this.state.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={this.state.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {this.state.theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
        </button>
        <h1>Tic Tac Toe</h1>
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
          />
        </section>
      </React.Fragment>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Router basename={process.env.REACT_APP_URI}>
  <Routes>
    <Route path="/tic-tac-toe" element={<Game />} />
  </Routes>
</Router>)
