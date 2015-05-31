var createStore = require('dispatchr/addons/createStore');
var validMoveHistory = require('../util/validMoveHistory');

var Moves = createStore({
  //**
  //  A Position: [Rank, File]
  //  A Move: [previous Position, next Position]
  //  Move History: [Moves]
  //**

  initialize: function() {
    this._moveHistory = [];
  },
  storeName: 'MOVE_STORE',
  handlers: {
    'VIEW': this.handleViewPayload.bid(this),
    'HYDRATE': this.handleHydrationPayload.bind(this)
  },
  handleViewPayload: function(payload) {
    switch (payload.type) {
      case 'move':
        this.handleMove(payload);
        break;
    }
  },
  handleMove: function(payload) {
    var newHistory = this._moveHistory.concat(payload.data);
    if (validMoveHistory(newHistory)) {
      this._moveHistory = newHistory;
      this.emitChange();
    }
  },
  handleHydrationPayload: function(payload) {
    if (payload.data.hasOwnProperty(this.storeName)) {
      this._moveHistory = payload.data[this.storeName];
      this.emitChange();
    }
  }
});
