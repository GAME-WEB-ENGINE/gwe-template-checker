let { GWE } = require('gwe');

let PIECE_TO_BG = {
  'BLACK_PAWN': './assets/textures/black_pawn.png',
  'BLACK_QUEEN': './assets/textures/black_queen.png',
  'WHITE_PAWN': './assets/textures/white_pawn.png',
  'WHITE_QUEEN': './assets/textures/white_queen.png'
};

class UIPiece extends GWE.UIWidget {
  constructor() {
    super({
      className: 'UIPiece',
      template: `
      <div class="UIPiece-bg js-bg"></div>`
    });

    this.piece = null;
  }

  update() {
    if (this.piece) {
      this.node.querySelector('.js-bg').style.backgroundImage = `url(${PIECE_TO_BG[this.piece.getColor() + '_' + this.piece.getType()]})`;
    }
    else {
      this.node.querySelector('.js-bg').style.backgroundImage = '';
    }
  }

  setPiece(piece) {
    this.piece = piece ? piece : null;
  }
}

module.exports.UIPiece = UIPiece;