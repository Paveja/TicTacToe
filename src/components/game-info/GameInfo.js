import Friends from '../../assets/images/friends.webp'

const GameInfo = ({ status, winner, xIsNext, isDraw }) => {
  let message
  let messageClass = 'player-x'

  if (winner === 'X') {
    message = 'Nice! I won!'
    messageClass = 'player-x'
  } else if (winner === 'O') {
    message = 'Wohoo! I made it!'
    messageClass = 'player-o'
  } else if (isDraw || status === 'Draw') {
    message = "It's a draw!"
    messageClass = 'player-x'
  } else if (xIsNext) {
    message = "It's your turn, player X"
    messageClass = 'player-x'
  } else {
    message = 'Now you, player O!'
    messageClass = 'player-o'
  }

  return (
    <section className="game-information">
      <h3 className={messageClass}>{message}</h3>
      <img src={Friends} alt="Player X and Player O" />
    </section>
  )
}

export default GameInfo
