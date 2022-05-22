let { COLOR, PIECE_TYPE, ELEMENT } = require('./enums');

class Piece {
  constructor(options = {}) {
    this.color = options.color ?? COLOR.BLACK;
    this.type = options.type ?? PIECE_TYPE.PAWN;
    this.element = options.element ?? ELEMENT.WATER;
    this.moves = options.moves ?? [];
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }

  getType() {
    return this.type;
  }
  
  setType(type) {
    this.type = type;
  }

  getElement() {
    return this.element;
  }

  setElement(element) {
    this.element = element;
  }

  getMoves() {
    return this.moves;
  }
}

module.exports.Piece = Piece;