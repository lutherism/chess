var BEGINING_POSITIONS = [
  ["BR",  "BN",  "BB",  "BK",  "BQ",  "BB",  "BN",  "BR"],
  ["BBP", "BBP", "BBP", "BBP", "BBP", "BBP", "BBP", "BBP"],
  ["__",  "__",  "__",  "__",  "__",  "__",  "__",  "__"],
  ["__",  "__",  "__",  "__",  "__",  "__",  "__",  "__"],
  ["__",  "__",  "__",  "__",  "__",  "__",  "__",  "__"],
  ["__",  "__",  "__",  "__",  "__",  "__",  "__",  "__"],
  ["WWP", "WWP", "WWP", "WWP", "WWP", "WWP", "WWP", "WWP"],
  ["WR",  "WN",  "WB",  "WK",  "WQ",  "WB",  "WN",  "WR"]
];

var INITIAL_TURN = "W";

function diag_moves() {
  var moves = [];
  for (var x = -7; x < 8; x++) {
    moves.push([x, x], [-x, x]);
  }
  return moves;
}

function horiz_moves() {
  var moves = [];
  for (var i = 1; i < 8; i++) {
    moves.push([i, 0], [0, i], [i*-1, 0], [0, i*-1]);
  }
  return moves;
}

var ALLOWED_PROGRESSIONS = {
  "R": horiz_moves(),
  "N": [
    [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1],
    [1, -2], [-1, -2], [-2, -1]],
  "B": diag_moves(),
  "K": [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
  "Q": horiz_moves().concat(diag_moves()),
  "BP": [[1, 0], [2, 0]],
  "WP": [[-1, 0], [-2, 0]]
};
var ALLOWED_ATTACKS = {
  "R": ALLOWED_PROGRESSIONS.R,
  "N": ALLOWED_PROGRESSIONS.N,
  "Q": ALLOWED_PROGRESSIONS.Q,
  "K": ALLOWED_PROGRESSIONS.K,
  "B": ALLOWED_PROGRESSIONS.B,
  "BP": [[1, -1], [1, 1]],
  "WP": [[-1, -1], [-1, 1]]
};

function legalProgression(pos, target, board) {
  if (!onBoardDimensions(pos) || !onBoardDimensions(target)) return false;
  var piece = getPiece(board, pos);
  var pieceType = piece.slice(1);
  var legal = false;
  var relMove = [target[0] - pos[0], target[1] - pos[1]];
  ALLOWED_PROGRESSIONS[pieceType].map(function (move) {
    if (relMove[0] === move[0] &&
      relMove[1] === move[1]) {
        legal = true;
      }
  });
  var newBoard = processMove(board, [pos, target]);
  renderBoard(newBoard);
  console.log(legal, isCellOnBoardChecking(newBoard), piece[0]);
  return legal && isCellOnBoardChecking(newBoard) !== piece[0];
}

function legalAttack(pos, target, board) {
  if (!onBoardDimensions(pos) || !onBoardDimensions(target)) return false;
  var piece = getPiece(currBoard, pos);
  var pieceType = piece.slice(1);
  var legal = false;
  var relMove = [target[0] - pos[0], target[1] - pos[1]];
  ALLOWED_ATTACKS[type].map(function (move) {
    if (relMove[0] === move[0] &&
      relMove[1] === move[1]) {
        legal = true;
      }
  });
  if (pieceType === "WP" && whiteEnPass(pos, target, board)) legal = true;
  if (pieceType === "BP" && blackEnPass(pos, target, board)) legal = true;
  return legal && isCellOnBoardChecking(processMove(board, [pos, target])) !== piece[0];
}

function invColor(type) {
  if (type === "W") return "B";
  if (type === "B") return "W";

  throw Error("invalid type");
}

function getPiece(board, pos) {
  return board[pos[0]][pos[1]];
}


//
//  ProcessMove
//
//  param Board is a board state, represented as a matrix of chess cells,
//  ie [["WQ", "__", ...], [...], ...]
//  param move is a tuple of positions.
//    0: initialPosition ie [2, 4]
//    1: nextPosition [3, 4]
//
//  returns Board the board state after executing the inputed move
//
function processMove(board, move) {
  if (typeof nextPosition === 'string') {
    return processCastle(board, move);
  }
  //clone the list of rows
  var newBoard = [].concat(board);
  var initialPosition = move[0];
  var nextPosition = move[1];

  //clone the row we change
  var newFirstRow = [].concat(newBoard[initialPosition[0]]);
  var movingPiece = getPiece(board, initialPosition);

  if (movingPiece === "__") throw Error("tried to move non-existant piece");

  //Leave behind an empty square
  newFirstRow[initialPosition[1]] = "__";

  //Check if we have to edit a second row for the next position
  if (initialPosition[0] !== nextPosition[0]) {
    //if we do, clone that row, and add our piece
    var newNextRow = [].concat(newBoard[nextPosition[0]]);
    newNextRow[nextPosition[1]] = movingPiece;
    newBoard[nextPosition[0]] = newNextRow;
  } else {
    //otherwise add it to the existing new row
    newFirstRow[nextPosition[1]] = movingPiece;
  }
  newBoard[initialPosition[0]] = newFirstRow;

  return newBoard;
}

function processCastle(board, move) {
  var newBoard = [].concat(board);
  var initialPosition = move[0];
  var nextPosition = move[1];
  var color = getPieceColor(board, initialPosition);
  var initKingFile = 3;
  var initRookFile;
  var endRookFile;
  var endKingFile;

  if (nextPosition.slice(1).toUpperCase() === 'QUEEN') {
    initRookFile = 7;
    endRookFile = 4;
    endKingFile = 5;
  }

  if (nextPosition.slice(1).toUpperCase() === 'KING') {
    initRookFile = 0;
    endRookFile = 2;
    endKingFile = 1;
  }

  var newFirstRow = [].concat(newBoard[initialPosition[0]]);
  newFirstRow[endKingFile] = color + "K";
  newFirstRow[endRookFile] = color + "R"
  newFirstRow[initKingFile] = '__';
  newFirstRow[initRookFile] = '__';

  newBoard[initialPosition[0]] = newFirstRow;

  return newBoard;
}

//
//  Unblocked Rook Moves
//
//  param board is a board state, represented as a matrix of chess cells,
//    ie [["WQ", "__", ...], [...], ...]
//  param position is a index tuple specifying a position on the board.
//    0: x index
//    1: y index
//
//  returns Array<Position> positions that the piece on the inputed board's position
//  can move to next turn. Along a rook up/down+sideways paths. Accounts for attacking
//  enemy pieces and allows attacking kings.
//

function unblockedRookMoves(board, pos) {
  var moves = [];
  for (var dir = 0; dir < 4; dir++) {
    var target = [].concat(pos);
    var distance = 0;
    while (distance++ < 7) {
      switch (dir) {
        case 0:
          target[0]++;
          break;
        case 1:
          target[1]++;
          break;
        case 2:
          target[0]--;
          break;
        case 3:
          target[1]--;
          break;
      }
      if (!onBoardDimensions(target) ||
        getPieceColor(board, target) === getPieceColor(board, pos)) {
        distance = 7;
        continue;
      }

      moves.push([].concat(target));

      if (getPieceColor(board, target) ===
        invColor(getPieceColor(board, pos))) {
        distance = 7;
      }
    }
  }

  return moves;
}

function allowedAttack(board, move) {
  return ALLOWED_ATTACKS[getPieceType(board, move[0])].reduce(function(a, mv) {
    return a || (
      mv[0] === move[0][0] - move[1][0] &&
      mv[1] === move[0][1] - move[1][1]
    );
  }, false);
}

function unblockedDiagMoves(board, pos) {
  var moves = [];
  for (var dir = 0; dir < 4; dir++) {
    var target = [].concat(pos);
    var distance = 0;
    while (distance++ < 7) {
      switch (dir) {
        case 0:
          target[0]++;
          target[1]++;
          break;
        case 1:
          target[0]--;
          target[1]++;
          break;
        case 2:
          target[0]++;
          target[1]--;
          break;
        case 3:
          target[0]--;
          target[1]--;
          break;
      }
      if (!onBoardDimensions(target) ||
        getPieceColor(board, target) === getPieceColor(board, pos)) {
        distance = 7;
        continue;
      }

      moves.push([].concat(target));

      if (getPieceColor(board, target) ===
        invColor(getPieceColor(board, pos))) {
        distance = 7;
      }
    }
  }

  return moves;
}

function castleMoves(board, pos, remainingCastles) {
  if (!remainingCastles) return [];
  if (isCellOnBoardChecking(board)) return [];
  var moves = [];
  if (getPiece(board, pos) === "BK") {
    if (remainingCastles.BQueen &&
      getPiece(board, [0,7]) === "BR" &&
      canCastleThrough(board, [0, 2])) {
      moves.push([0, 1]);
    }
    if (remainingCastles.BKing &&
      getPiece(board, [0,0]) === "BR" &&
      canCastleThrough(board, [0, 4])) {
      moves.push([0, 5]);
    }
  }
  if (getPiece(board, pos) === "WK") {
    if (remainingCastles.WQueen &&
      getPiece(board, [7,7]) === "WR" &&
      canCastleThrough(board, [7, 4])) {
      moves.push([7, 5]);
    }
    if (remainingCastles.WKing &&
      getPiece(board, [7,0]) === "WR" &&
      canCastleThrough(board, [7, 2])) {
      moves.push([7, 1]);
    }
  }
  return moves;
}
function canCastleThrough(board, pos) {
  if (getPiece(board, pos) !== '__') return false;
  if (getPiece(board, pos) !== '__') return false;
  if (!(pos[0] === 0 || pos[0] === 7)) return false;

  var kingPos = [pos[0], 3];
  return !!(typeof isCellOnBoardChecking(processMove(board, [kingPos, pos])) !== 'object');
}

function remainingCastles(history) {
  return history.reduce(function(a, mv) {
    var piece = getPiece(BEGINING_POSITIONS, mv[0])
    if (getType(piece) === 'K') {
      delete a[getColor(piece) + 'King'];
      delete a[getColor(piece) + 'Queen'];
    }
    if (getType(piece) === 'R') {
      if (mv[0][1] === 7) {
        delete a[getColor(piece) + 'Queen'];
      }
      if (mv[0][1] === 0) {
        delete a[getColor(piece) + 'King'];
      }
    }
    return a;
  }, {
    BQueen: true,
    BKing: true,
    WQueen: true,
    WKing: true
  });
}

function activeTargets(board, pos, remainingCastles) {
  var piece = getPiece(board, pos);
  var type = piece.slice(1);
  if (type === "_") return [];
  var moves;
  switch (type) {
    case "B":
      moves = unblockedDiagMoves(board, pos);
      break;
    case "Q":
      moves = unblockedRookMoves(board, pos).concat(unblockedDiagMoves(board, pos));
      break;
    case "R":
      moves = unblockedRookMoves(board, pos);
      break;
    default:
      moves = ALLOWED_PROGRESSIONS[type].filter(function(v) {
        return onBoardDimensions(getTarget(pos, v)) &&
          getPiece(board, getTarget(pos, v)) === "__" &&
          //filter double skips for pawns not on a pawn line
          !(type[1] === 'P' && (pos[0] !== 1 && pos[0] !== 6) && (v[0] === 2 || v[0] === -2));
      }).concat(ALLOWED_ATTACKS[type].filter(function(v) {
        return onBoardDimensions(getTarget(pos, v)) &&
          getPieceColor(board, getTarget(pos, v)) === invColor(getColor(piece));
      })).map(function(foundMove) {
        return getTarget(pos, foundMove);
      }) || [];
      break;
  }

  return moves.concat(castleMoves(board, pos, remainingCastles)) || [];
}

function checkFilteredMoves(board, pos, remainingCastles) {
  var moves = activeTargets(board, pos, remainingCastles);
  return moves.filter(function (target) {
    var potentialBoard = processMove(board, [pos, target]);
    var check = isCellOnBoardChecking(potentialBoard);
    return !(
      check &&
      getPieceColor(board, pos) ===
        getPieceColor(potentialBoard, check)
      );
  });
}

function getTarget(pos, relMove) {
  return [pos[0] + relMove[0], pos[1] + relMove[1]];
}

function getKingType(board, pos) {
  if (onBoardDimensions(pos) &&
    getPieceType(board, pos) === "K") {
    return getPieceColor(board, pos);
  }
}

//
//  Depends on activeTargets function, to find if a piece is currently
//  checking an opposing King.
//
//  param Board
//  param Position
//
//  return Bool if piece at teh position is checking opposing king
//

function isCellChecking(board, position) {
  if (getPieceType(board, position) === "_") return false;
  var potentialMoves = activeTargets(board, position);
  return potentialMoves.reduce(function (a, target) {
    if (
      onBoardDimensions(target) &&
      getPieceType(board, target) === "K" &&
      getPieceColor(board, target) ===
        invColor(getPieceColor(board, position))) {
      return target;
    }
    return a;
  }, false);
}

function isCellInRowChecking(board, x) {
  return board[x].reduce(function (a, cell, y) {
    return a || isCellChecking(board, [x, y]);
  }, false);
}

function isCellOnBoardChecking(board) {
  return board.reduce(function (a, row, x) {
    return a || isCellInRowChecking(board, x);
  }, false);
}

var alphaMap = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5,
  'g': 6, 'h': 7};

var numMap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function moveToReadable(move) {
  return move.map(posToReadable).join(' => ');
}

function posToReadable(pos) {
  return '' + numMap[pos[1]] + (8-pos[0]);
}

function getPieceColor(board, pos) {
  return getColor(getPiece(board, pos));
}

function getColor(cell) {
  return cell[0];
}

function getPieceType(board, pos) {
  return getType(getPiece(board, pos));
}

function getType(cell) {
  return cell.slice(1);
}

function onBoardDimensions(pos) {
  return (
    pos[0] > -1 &&
    pos[0] < 8 &&
    pos[1] > -1 &&
    pos[1] < 8
  );
}

function renderBoard(board) {
  if (!board) console.error("I cannot render this board.");

  board.map(function(row, i) {
    process.stdout.write(8-i + ' ');
    row.map(function(cell) {
      if (cell.length > 2) cell = cell.slice(cell.length - 2);
      process.stdout.write("["+cell+"] ");
    });
    process.stdout.write("\n\n");
  });
  console.log(['   a','b','c','d','e','f','g','h'].join('    '));
}

function chessEngine(history) {
  var turn = INITIAL_TURN;
  var currBoard = [].concat(BEGINING_POSITIONS);
  if (history.length === 0) return currBoard;
  var remainingCastles = {
    BQueen: true,
    BKing: true,
    WQueen: true,
    WKing: true
  };

  console.log("running through moves: \n", history.map(moveToReadable).join('\n'));

  var valid = history.reduce(function(board, move) {
    if (!board) return board;
    var initialPosition = move[0];
    var nextPosition = move[1];
    var piece = getPiece(board, initialPosition);
    var pieceType = getType(piece);
    var target = getPiece(board, initialPosition);
    var targetType = getType(piece);

    if (piece[0] !== turn) return false;
    turn = turn === "W" ? "B" : "W";
    var potentialMoves = checkFilteredMoves(board, initialPosition, remainingCastles);
    //console.log("found moves for position:", posToReadable(initialPosition), "=>", potentialMoves.map(posToReadable).join(' '));
    if (potentialMoves.map(posToReadable).indexOf(posToReadable(nextPosition)) > -1) {
      return processMove(board, move);
    } else {
      return false;
    }
  }, currBoard);
  if (valid && isCellOnBoardChecking(valid) === invColor(turn)) return false;
  return valid;
}

function readableToPosition(str) {
  if (str.length > 2) throw Error("this doesn't look like a position");

  return [(8 - str[1]), alphaMap[str[0]]];
}

chessEngine.BEGINING_POSITIONS = BEGINING_POSITIONS;
chessEngine.ALLOWED_ATTACKS = ALLOWED_ATTACKS;
chessEngine.ALLOWED_PROGRESSIONS = ALLOWED_PROGRESSIONS;
chessEngine.check = isCellOnBoardChecking;
chessEngine.posToReadable = posToReadable;
chessEngine.moveToReadable = moveToReadable;
chessEngine.availMoves = checkFilteredMoves;
chessEngine.processMove = processMove;
chessEngine.renderBoard = renderBoard;
chessEngine.getPiece = getPiece;
chessEngine.readableToPosition = readableToPosition;
chessEngine.remainingCastles = remainingCastles;


module.exports = chessEngine;
