//**
//  @{param} history: a List of Moves
//
//  @{returns} A map of occupied places to
//*

var chessEngine = require('./chessEngine');
var repl = require('repl');
var readableMoves = [
];
var moves = readableMoves.map(function (move) {
  return move.map(chessEngine.readableToPosition);
});
console.log(moves);
var alphaMap = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5,
  'g': 6, 'h': 7};
function renderBoard(board) {
  if (!board) {
    console.error("invalid history");
    return;
  }
  board.map(function(row, i) {
    process.stdout.write(8-i + ' ');
    row.map(function(cell) {
      if (cell.length > 2) cell = cell.slice(cell.length - 2);
      process.stdout.write("["+cell+"] ");
    });
    process.stdout.write("\n \n");
  });
  console.log(['   a','b','c','d','e','f','g','h'].join('    '));
}

var initBoard = chessEngine(moves);
renderBoard(initBoard);

repl.start({
  eval: function(cmd) {
    var turn = "W";
    if (this.context.moves.length % 2) turn = "B";
    if (cmd === '(help\n)') {
      console.log('Play a move by typing "init_pos next_pos" (ie "e2 e4") ');
      console.log("Commands: ");
      console.log('check   - returns if there is a check or checkmate');
      console.log('history - returns a ordered list of all moves take so far');
      console.log('turn    - tells you who\'s turn it is');
      console.log('board   - prints the current board state');
      console.log('e2 - prints all possible moves for the piece on e2');
      return;
    }
    if (cmd === '(check\n)') {
      var victim = chessEngine.check(chessEngine(this.context.moves));
      if (!victim) return console.log("no check");
      if (victim !== turn) console.log(turn + " is checkmated.");
      console.log(turn + 'is under check');
    }
    if (cmd === '(history\n)') {
      console.log(this.context.moves.map(chessEngine.moveToReadable));
      return;
    }
    if (cmd === '(turn\n)') {
      console.log("It is " + turn +"'s turn.");
      return;
    }
    if (cmd === '(board\n)') {
      renderBoard(chessEngine(this.context.moves));
      return;
    }
    if (/\((..)\n\)/.test(cmd)) {
      var query = cmd.replace('(', '').replace('\n)', '');
      console.log(query);

      console.log(chessEngine.availMoves(
          chessEngine(this.context.moves),
          chessEngine.readableToPosition(query)
        ).map(chessEngine.posToReadable).join(', ')
      );
      return;
    }

    var move = cmd.replace(/\(|\)|\n/g, '').split(" ");
    if (move.length !== 2 ||
      move[0].length !== 2 ||
      move[1].length !== 2) return console.error('invalid move input.', move);

    move = move.map(function (pos) {
      return [(8 - pos[1]), alphaMap[pos[0]]];
    });


    var newHistory = this.context.moves.concat([move]);
    var newBoard;
    try {
      newBoard = chessEngine(newHistory);
      renderBoard(newBoard);
    } catch (err) {
      throw err;
    }
    if (!newBoard) {
      return console.error('illegal move. try: ',
      chessEngine.posToReadable(move[0]),
      '=>', chessEngine.availMoves(
        chessEngine(this.context.moves),
        move[0]).map(chessEngine.posToReadable)
      );
    }

    this.context.moves = newHistory;
  }
}).context = {
  moves: moves
};
