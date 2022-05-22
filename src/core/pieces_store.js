let { COLOR, PIECE_TYPE, ELEMENT } = require('./enums');
let { Move } = require('./move');
let { Piece } = require('./piece');

let PATH_FORWARD_1XRIGHT = [[+1, +1]];
let PATH_FORWARD_1XLEFT = [[-1, +1]];
let PATH_BACKWARD_1XRIGHT = [[+1, -1]];
let PATH_BACKWARD_1XLEFT = [[-1, -1]];
let PATH_FORWARD_2XRIGHT = [[+1, +1], [+2, +2]];
let PATH_FORWARD_2XLEFT = [[-1, +1], [-2, +2]];
let PATH_BACKWARD_2XRIGHT = [[+1, -1], [+2, -2]];
let PATH_BACKWARD_2XLEFT = [[-1, -1], [-2, -2]];
let PATH_DIAG_FORWARD_RIGHT = [[+1, +1], [+2, +2], [+3, +3], [+4, +4], [+5, +5], [+6, +6], [+7, +7], [+8, +8], [+9, +9]];
let PATH_DIAG_FORWARD_LEFT = [[-1, +1], [-2, +2], [-3, +3], [-4, +4], [-5, +5], [-6, +6], [-7, +7], [-8, +8], [-9, +9]];
let PATH_DIAG_BACKWARD_RIGHT = [[+1, -1], [+2, -2], [+3, -3], [+4, -4], [+5, -5], [+6, -6], [+7, -7], [+8, -8], [+9, -9]];
let PATH_DIAG_BACKWARD_LEFT = [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], [-9, -9]];

function CREATE_PAWN(color) {
  return new Piece({
    color: color,
    type: PIECE_TYPE.PAWN,
    element: ELEMENT.DARK,
    moves: [
      new Move({ path: color == COLOR.BLACK ? PATH_FORWARD_1XRIGHT : PATH_BACKWARD_1XRIGHT, numCapture: 0, mustCapture: false, chainable: false }),
      new Move({ path: color == COLOR.BLACK ? PATH_FORWARD_1XLEFT : PATH_BACKWARD_1XLEFT, numCapture: 0, mustCapture: false, chainable: false }),
      new Move({ path: PATH_FORWARD_2XRIGHT, numCapture: 1, mustCapture: true, chainable: true }),
      new Move({ path: PATH_FORWARD_2XLEFT, numCapture: 1, mustCapture: true, chainable: true }),
      new Move({ path: PATH_BACKWARD_2XRIGHT, numCapture: 1, mustCapture: true, chainable: true }),
      new Move({ path: PATH_BACKWARD_2XLEFT, numCapture: 1, mustCapture: true, chainable: true })
    ]
  });
}

function CREATE_QUEEN(color) {
  return new Piece({
    color: color,
    type: PIECE_TYPE.QUEEN,
    element: ELEMENT.DARK,
    moves: [
      new Move({ path: PATH_DIAG_FORWARD_RIGHT, numCapture: 0, mustCapture: false, chainable: false }),
      new Move({ path: PATH_DIAG_FORWARD_LEFT, numCapture: 0, mustCapture: false, chainable: false }),
      new Move({ path: PATH_DIAG_BACKWARD_RIGHT, numCapture: 0, mustCapture: false, chainable: false }),
      new Move({ path: PATH_DIAG_BACKWARD_LEFT, numCapture: 0, mustCapture: false, chainable: false }),
      new Move({ path: PATH_DIAG_FORWARD_RIGHT, numCapture: 1, mustCapture: true, chainable: true }),
      new Move({ path: PATH_DIAG_FORWARD_LEFT, numCapture: 1, mustCapture: true, chainable: true }),
      new Move({ path: PATH_DIAG_BACKWARD_RIGHT, numCapture: 1, mustCapture: true, chainable: true }),
      new Move({ path: PATH_DIAG_BACKWARD_LEFT, numCapture: 1, mustCapture: true, chainable: true }),
    ]
  });
}

module.exports.CREATE_PAWN = CREATE_PAWN;
module.exports.CREATE_QUEEN = CREATE_QUEEN;