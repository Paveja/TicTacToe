const Scoreboard = ({ xWins, oWins, draws, totalGamesPlayed, onResetScoreboard }) => {
  return (
    <section className="scoreboard">
      <h2>Scoreboard</h2>
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Player X Wins</span>
          <span className="stat-value">{xWins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Player O Wins</span>
          <span className="stat-value">{oWins}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Draws</span>
          <span className="stat-value">{draws}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Games Played</span>
          <span className="stat-value">{totalGamesPlayed}</span>
        </div>
      </div>
      <button className="reset-scoreboard" onClick={onResetScoreboard}>
        Reset Scoreboard
      </button>
    </section>
  )
}

export default Scoreboard
