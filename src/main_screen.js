let { GWE } = require('gwe');
let { COLOR } = require('./core/enums');
let { Game } = require('./core/game');
let { UIBoard } = require('./ui/ui_board');

class MainScreen extends GWE.Screen {
  constructor(app) {
    super(app);
    this.game = null;
    this.uiTitle = null;
    this.uiBoard = null;
    this.chaining = false;
  }

  update() {
    this.uiTitle.textContent = `AU TOUR DES ${this.game.getCurrentPlayer() == COLOR.BLACK ? 'NOIRS' : 'BLANCS'} DE JOUER`;
  }

  onEnter() {
    this.game = new Game();

    this.uiTitle = document.createElement('div');
    GWE.uiManager.addNode(this.uiTitle, 'position:absolute; top: 10%; left: 50%; transform: translateX(-50%)');

    this.uiBoard = new UIBoard();
    this.uiBoard.setBoard(this.game.getBoard());
    GWE.uiManager.addWidget(this.uiBoard, 'position: absolute;inset: 0px;top: 50%;left: 50%;width: 400px;height: 400px;transform: translate(-50%, -50%)');
    GWE.uiManager.focus(this.uiBoard);

    GWE.eventManager.subscribe(this.game, 'E_NEW_TURN', this, this.handleGameNewTurn);
    GWE.eventManager.subscribe(this.game, 'E_START_CHAINING', this, this.handleGameStartChaining);
    GWE.eventManager.subscribe(this.game, 'E_STOP_CHAINING', this, this.handleGameStopChaining);
    GWE.eventManager.subscribe(this.uiBoard, 'E_TILE_CLICKED', this, this.handleUIBoardTileClicked);
  }

  handleGameNewTurn() {
    this.uiBoard.unselectTile();
    this.uiBoard.unfocusTiles();
  }

  handleGameStartChaining(data) {
    this.chaining = true;
    this.uiBoard.unselectTile();
    this.uiBoard.unfocusTiles();
    this.uiBoard.selectTile(data.coord);

    for (let point of data.points) {
      this.uiBoard.focusTile([point.x, point.y]);
    }
  }

  handleGameStopChaining() {
    this.chaining = false;
  }

  handleUIBoardTileClicked(data) {
    if (this.chaining) { 
      this.handleUIChainingClick(data.coord);
    }
    else {
      if (this.uiBoard.getSelectedTileCoord()) this.handleUISecondClick(data.coord);        
      else this.handleUIFirstClick(data.coord);
    }
  }

  handleUIChainingClick(coord) {
    let uiTile = this.uiBoard.getTile(coord);
    if (uiTile.isFocused()) {
      this.game.operationMove(this.uiBoard.getSelectedTileCoord(), coord);
      this.uiBoard.unselectTile();
      this.uiBoard.unfocusTiles();
    }
  }

  handleUIFirstClick(coord) {
    let board = this.game.getBoard();
    let tile = board.getTile(coord);
    let piece = tile.getPiece();

    if (piece && piece.getColor() == this.game.getCurrentPlayer()) {
      this.uiBoard.selectTile(coord);
      for (let point of board.getPossiblePoints(coord)) {
        this.uiBoard.focusTile([point.x, point.y]);
      }
    }
  }

  handleUISecondClick(coord) {
    let uiTile = this.uiBoard.getTile(coord);
    if (uiTile.isFocused()) {
      this.game.operationMove(this.uiBoard.getSelectedTileCoord(), coord);
    }
    else {
      this.uiBoard.unselectTile();
      this.uiBoard.unfocusTiles();
    }
  }
}

module.exports.MainScreen = MainScreen;