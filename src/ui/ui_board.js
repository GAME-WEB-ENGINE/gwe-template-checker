let { GWE } = require('gwe');
let { UITile } = require('./ui_tile');

class UIBoard extends GWE.UIWidget {
  constructor() {
    super({
      className: 'UIBoard'
    });

    this.board = null;
    this.uiTiles = [];
    this.selectedTileCoord = null;
  }

  update(ts) {
    for (let uiTile of this.uiTiles) {
      uiTile.update(ts);
    }
  }

  delete() {
    for (let uiTile of this.uiTiles) uiTile.delete();
    super.delete();
  }

  setBoard(board) {
    for (let uiTile of this.uiTiles) uiTile.delete();
    this.uiTiles = [];

    if (board) {
      for (let y = 0; y < board.getRows(); y++) {
        for (let x = 0; x < board.getCols(); x++) {
          let uiTile = new UITile({ color: (x + y) % 2 == 0 ? 'white' : 'black' });
          uiTile.node.addEventListener('click', () => this.handleTileClicked([x, y]));
          uiTile.setTile(board.getTile([x, y]));
          this.node.appendChild(uiTile.node);
          this.uiTiles.push(uiTile);
        }
      }

      this.board = board;
    }
    else {
      this.board = null;
    }
  }

  getTile(coord) {
    return this.uiTiles[coord[0] + coord[1] * this.board.getCols()];
  }

  getSelectedTileCoord() {
    return this.selectedTileCoord;
  }

  selectTile(coord) {
    this.uiTiles[coord[0] + coord[1] * this.board.getCols()].setSelected(true);
    this.selectedTileCoord = coord;
  }

  unselectTile() {
    if (this.selectedTileCoord) {
      this.uiTiles[this.selectedTileCoord[0] + this.selectedTileCoord[1] * this.board.getCols()].setSelected(false);
      this.selectedTileCoord = null;
    }
  }

  focusTile(coord) {
    this.uiTiles[coord[0] + coord[1] * this.board.getCols()].focus();
  }

  unfocusTiles() {
    for (let uiTile of this.uiTiles) {
      uiTile.unfocus();
    }
  }

  handleTileClicked(coord) {
    GWE.eventManager.emit(this, 'E_TILE_CLICKED', { coord });
  }
}

module.exports.UIBoard = UIBoard;