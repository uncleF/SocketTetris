/* jshint browser:true */

'use strict';

module.exports = _ => {

  const tetrisEvents = require('tetris/tetrisEvents');

  const socket = require('socket.io-client')();

  const TIMEOUT_DELAY = 500;
  const INTREVAL_DELAY = 40;

  const D_PAD_UP_ID = 'dPadUp';
  const D_PAD_RIGHT_ID = 'dPadRight';
  const D_PAD_DOWN_ID = 'dPadDown';
  const D_PAD_LEFT_ID = 'dPadLeft';
  const BUTTON_A_ID = 'buttonA';
  const BUTTON_B_ID = 'buttonB';

  const dPadUp = document.getElementById(D_PAD_UP_ID);
  const dPadRight = document.getElementById(D_PAD_RIGHT_ID);
  const dPadDown = document.getElementById(D_PAD_DOWN_ID);
  const dPadLeft = document.getElementById(D_PAD_LEFT_ID);
  const buttonA = document.getElementById(BUTTON_A_ID);
  const buttonB = document.getElementById(BUTTON_B_ID);

  let repeatTimeout;
  let repeatInterval;

  function emitEvent(event) {
    socket.emit(tetrisEvents[event]);
  }

  function startRepeat(event) {
    repeatTimeout = setTimeout(_ => {
      repeatInterval = setInterval(_ => emitEvent(event), INTREVAL_DELAY);
    }, TIMEOUT_DELAY);
  }

  function onUpTouch(event) {
    event.preventDefault();
    emitEvent('rotatecw');
    startRepeat('rotatecw');
  }

  function onRightTouch(event) {
    event.preventDefault();
    emitEvent('right');
    startRepeat('right');
  }

  function onDownTouch(event) {
    event.preventDefault();
    emitEvent('drop');
    startRepeat('drop');
  }

  function onLeftTouch(event) {
    event.preventDefault();
    emitEvent('left');
    startRepeat('left');
  }

  function onATouch(event) {
    event.preventDefault();
    emitEvent('rotatecw');
    startRepeat('rotatecw');
  }

  function onBTouch(event) {
    event.preventDefault();
    emitEvent('rotateccw');
    startRepeat('rotateccw');
  }

  function onTouchend() {
    clearTimeout(repeatTimeout);
    clearInterval(repeatInterval);
  }

  dPadUp.addEventListener('touchstart', onUpTouch);
  dPadUp.addEventListener('touchend', onTouchend);
  dPadRight.addEventListener('touchstart', onRightTouch);
  dPadRight.addEventListener('touchend', onTouchend);
  dPadDown.addEventListener('touchstart', onDownTouch);
  dPadDown.addEventListener('touchend', onTouchend);
  dPadLeft.addEventListener('touchstart', onLeftTouch);
  dPadLeft.addEventListener('touchend', onTouchend);
  buttonA.addEventListener('touchstart', onATouch);
  buttonA.addEventListener('touchend', onTouchend);
  buttonB.addEventListener('touchstart', onBTouch);
  buttonB.addEventListener('touchend', onTouchend);

};
