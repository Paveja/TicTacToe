const GameCounter = ({ totalGamesPlayed }) => {
  return (
    <section className="game-counter">
      <h3 className="counter-label">Total Games Played</h3>
      <p className="counter-value">{totalGamesPlayed}</p>
    </section>
  )
}

export default GameCounter
