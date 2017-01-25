/* jshint browser:true */

'use strict';

module.exports = catcher => {

  const tetrisEvents = require('tetris/tetrisEvents');

  const eventManager = require('patterns/tx-event');

  const KEY_EVENTS = {
    37: tetrisEvents.left,
    39: tetrisEvents.right,
    40: tetrisEvents.drop,
    38: tetrisEvents.rotateccw,
    81: tetrisEvents.rotatecw,
    87: tetrisEvents.rotateccw,
  };

  function onKeydown(event) {
    const keyCode = event.keyCode;
    if (KEY_EVENTS[keyCode]) {
      event.preventDefault();
      event.stopPropagation();
      eventManager.trigger(catcher, KEY_EVENTS[keyCode], false, 'UIEvent');
    }
  }

  document.addEventListener('keydown', onKeydown);

};
