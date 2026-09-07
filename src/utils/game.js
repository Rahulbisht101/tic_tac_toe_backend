const checkWinner = (board) => {
  const lines = [
    // Rows
    board[0],
    board[1],
    board[2],

    // Columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],

    // Diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const line of lines) {
    const sum = line[0] + line[1] + line[2];

    if (sum === 3) {
      return "x";
    }

    if (sum === -3) {
      return "o";
    }
  }

  // No winner + board is full = draw
  const isDraw = board.every((row) => row.every((cell) => cell !== 0));

  if (isDraw) {
    return "draw";
  }

  // Game is still running
  return null;
};

module.exports = { checkWinner };
