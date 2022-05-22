let { GWE } = require('gwe');
let { UIPiece } = require('./ui_piece');

let ELEMENT_TO_BG = {
  'DARK': './assets/textures/tile_dark.png',
  'LIGHT': './assets/textures/tile_light.png',
  'FIRE': './assets/textures/tile_fire.png',
  'WATER': './assets/textures/tile_water.png'
};

class UITile extends GWE.UIWidget {
  constructor(options = {}) {
    super({
      className: 'UITile',
      template: `
      <div class="UITile-bg js-bg"></div>
      <div class="UITile-piece js-piece"></div>`
    });

    this.tile = null;
    this.uiPiece = new UIPiece();

    this.node.querySelector('.js-piece').replaceWith(this.uiPiece.node);
    this.node.classList.add(options.color == 'white' ? 'UITile--white' : 'UITile--black');
  }

  update(ts) {
    if (this.tile) {
      let bg = ELEMENT_TO_BG[this.tile.getElement()];
      this.node.querySelector('.js-bg').style.backgroundImage = bg ? `url(${bg})` : '';
      this.uiPiece.setPiece(this.tile.getPiece());
    }
    else {
      this.node.querySelector('.js-bg').style.backgroundImage = '';
    }

    this.uiPiece.update(ts);
  }

  delete() {
    this.uiPiece.delete();
    super.delete();
  }

  setTile(tile) {
    this.tile = tile ? tile : null;
  }
}

module.exports.UITile = UITile;