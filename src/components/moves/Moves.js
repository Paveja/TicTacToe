import React from 'react'

function formatLocation(location) {
  if (location == null) return null
  const row = Math.floor(location / 3) + 1
  const col = (location % 3) + 1
  return `row ${row}, col ${col}`
}

const Moves = ({ history, jumpTo, stepNumber }) => {
  const moves = history.map((step, move) => {
    const isCurrent = move === stepNumber
    let desc

    if (move === 0) {
      desc = 'Go to game start'
    } else {
      const player = move % 2 === 1 ? 'X' : 'O'
      const location = formatLocation(step.location)
      desc = location
        ? `Go to move #${move} — ${player} at ${location}`
        : `Go to move #${move}`
    }

    return (
      <li key={move}>
        <button
          type="button"
          className={`move-button${isCurrent ? ' current-move' : ''}`}
          onClick={() => jumpTo(move)}
          aria-current={isCurrent ? 'step' : undefined}
        >
          {desc}
          {isCurrent ? ' (current)' : ''}
        </button>
      </li>
    )
  })

  return (
    <nav className="game-moves" aria-label="Move history">
      <h3 className="moves-heading">Move History</h3>
      <ol className="moves-list">{moves}</ol>
    </nav>
  )
}

export default Moves
