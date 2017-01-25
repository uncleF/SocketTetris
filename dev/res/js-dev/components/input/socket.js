/* jshint browser:true */

'use strict';

module.exports = catcher => {

  const tetrisEvents = require('tetris/tetrisEvents');

  const socket = require('socket.io-client')();
  const eventManager = require('patterns/tx-event');

  function onLeft() {
    eventManager.trigger(catcher, tetrisEvents.left, false, 'UIEvent');
  }

  function onRight() {
    eventManager.trigger(catcher, tetrisEvents.right, false, 'UIEvent');
  }

  function onDrop() {
    eventManager.trigger(catcher, tetrisEvents.drop, false, 'UIEvent');
  }

  function onRotateCW() {
    eventManager.trigger(catcher, tetrisEvents.rotatecw, false, 'UIEvent');
  }

  function onRotateCCW() {
    eventManager.trigger(catcher, tetrisEvents.rotateccw, false, 'UIEvent');
  }

  socket.on(tetrisEvents.left, onLeft);
  socket.on(tetrisEvents.right, onRight);
  socket.on(tetrisEvents.drop, onDrop);
  socket.on(tetrisEvents.rotatecw, onRotateCW);
  socket.on(tetrisEvents.rotateccw, onRotateCCW);

};
