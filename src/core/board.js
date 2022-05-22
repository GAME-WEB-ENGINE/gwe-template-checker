let { COLOR } = require('./enums');
let { CREATE_PAWN } = require('./pieces_store');
let { Tile } = require('./tile');

class Board {
  constructor() {
    this.rows = 10;
    this.cols = 10;
    this.tiles = [];

    for (let y = 0; y < this.rows; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.cols; x++) {
        if (y < 4 && (x + y) % 2) {
          this.tiles[y][x] = new Tile(CREATE_PAWN(COLOR.BLACK));
        }
        else if (y > 5 && (x + y) % 2) {
          this.tiles[y][x] = new Tile(CREATE_PAWN(COLOR.WHITE));
        }
        else {
          this.tiles[y][x] = new Tile();
        }
      }
    }
  }

  getRows() {
    return this.rows;
  }

  getCols() {
    return this.cols;
  }

  getTile(coord) {
    return this.tiles[coord[1]][coord[0]];
  }

  isValidCoord(coord) {
    return coord[0] < this.cols && coord[0] >= 0 && coord[1] < this.rows && coord[1] >= 0;
  }

  getPossiblePoints(coord, onlyChainable = false) {
    let possiblePoints = [];
    let piece = this.tiles[coord[1]][coord[0]].getPiece();

    for (let move of piece.getMoves()) {
      if (onlyChainable && !move.isChainable()) {
        continue;
      }

      let numCapture = 0;
      let lastEncounterPiece = null;

      for (let vector of move.getPath()) {
        let x = coord[0] + vector[0];
        let y = coord[1] + vector[1];
        if (!this.isValidCoord([x, y])) {
          break;
        }

        let encounterPiece = this.tiles[y][x].getPiece();
        let encounterElement = this.tiles[y][x].getElement();

        let isBlockedByElement = encounterElement && encounterElement != piece.getElement();
        let isBlockedByCollate = encounterPiece && encounterPiece.getColor() != piece.getColor() && lastEncounterPiece && lastEncounterPiece.getColor() != piece.getColor() && !move.isCollateCapturable();
        let isBlockedByAlly = encounterPiece && encounterPiece.getColor() == piece.getColor();
        if (isBlockedByElement || isBlockedByCollate || isBlockedByAlly) {
          break;
        }

        if (encounterPiece && encounterPiece.getColor() != piece.getColor()) {
          numCapture++;
        }

        if (!encounterPiece && move.getNumCapture() == numCapture) {
          possiblePoints.push({ x, y, mustCapture: move.isForceCapture() });
        }

        lastEncounterPiece = encounterPiece;
      }
    }

    let mustCapture = possiblePoints.find(p => p.mustCapture);
    let i = possiblePoints.length;
    while (i--) {
      if (mustCapture && !possiblePoints[i].mustCapture) {
        possiblePoints.splice(i, 1);
      }
    }

    return possiblePoints;
  }
}

module.exports.Board = Board;