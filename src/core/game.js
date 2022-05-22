let { GWE } = require('gwe');
let { COLOR, PIECE_TYPE } = require('./enums');
let { CREATE_QUEEN } = require('./pieces_store');
let { Board } = require('./board');

class Game {
  constructor() {
    this.board = new Board();
    this.currentPlayer = COLOR.BLACK;
  }

  getBoard() {
    return this.board;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  isChaining() {
    return this.chaining;
  }

  operationNewTurn() {
    let y = this.currentPlayer == COLOR.BLACK ? this.board.getRows() - 1 : 0;
    for (let x = 0; x < this.board.getCols(); x++) {
      let tile = this.board.getTile([x, y]);
      let piece = tile.getPiece();
      if (piece && piece.getColor() == this.currentPlayer && piece.getType() == PIECE_TYPE.PAWN) {
        tile.setPiece(CREATE_QUEEN(piece.getColor()));
      }
    }

    this.currentPlayer = this.currentPlayer == COLOR.BLACK ? COLOR.WHITE : COLOR.BLACK;
    GWE.eventManager.emit(this, 'E_NEW_TURN');
  }

  operationStartChaining(coordFrom, points) {
    GWE.eventManager.emit(this, 'E_START_CHAINING', { coord: coordFrom, points: points });
  }

  operationStopChaining() {
    GWE.eventManager.emit(this, 'E_STOP_CHAINING');
  }

  operationKill(coord) {
    let tile = this.board.getTile(coord);
    tile.setPiece(null);
  }

  operationReplace(coordFrom, coordTo) {
    let tileFrom = this.board.getTile(coordFrom);
    let tileTo = this.board.getTile(coordTo);
    let piece = tileFrom.getPiece();
    tileFrom.setPiece(null);
    tileTo.setPiece(piece);
  }

  operationPromoteToQueen(coord) {
    let tile = this.board.getTile(coord);
    let piece = tile.getPiece();
    tile.setPiece(CREATE_QUEEN(piece.color));
  }

  operationMove(coordFrom, coordTo) {
    let tileFrom = this.board.getTile(coordFrom);
    let tileTo = this.board.getTile(coordTo);
    let piece = tileFrom.getPiece();
    let pieceMoves = piece.getMoves();
    tileFrom.setPiece(null);
    tileTo.setPiece(piece);

    let move = pieceMoves.find(m => m.hasVector(GWE.Utils.VEC2_SUBSTRACT(coordTo, coordFrom)));

    for (let vector of move.getPath()) {
      let coord = GWE.Utils.VEC2_ADD(coordFrom, vector);
      if (GWE.Utils.VEC2_ISEQUAL(coord, coordTo)) {
        break;
      }

      let encounterTile = this.board.getTile(coord);
      let encounterPiece = encounterTile.getPiece();
      if (encounterPiece && encounterPiece.getColor() != piece.getColor()) {
        encounterTile.setPiece(null);
      }
    }

    if (!move.isChainable()) {
      this.operationNewTurn();
      return;
    }

    let chainablePoints = this.board.getPossiblePoints(coordTo, true);
    if (chainablePoints.length > 0) {
      this.operationStartChaining(coordTo, chainablePoints);
    }
    else {
      this.operationStopChaining();
      this.operationNewTurn();
    }
  }
}

module.exports.Game = Game;