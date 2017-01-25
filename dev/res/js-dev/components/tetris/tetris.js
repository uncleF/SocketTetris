/* jshint browser:true */

'use strict';

module.exports = _ => {

  const canvas = document.getElementById('tetris');
  const context = canvas.getContext('2d');

  const tetrisEvents = require('tetris/tetrisEvents');
  const keyboard = require('input/keyboard');
  const socket = require('input/socket');

  context.scale(20, 20);

  function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; y -= 1) {
      for (let x = 0; x < arena[y].length; x += 1) {
        if (arena[y][x] === 0) {
          continue outer;
        }
      }
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      y += 1;
      player.score += rowCount * 10;
      rowCount *= 2;
    }
  }

  function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y += 1) {
      for (let x = 0; x < m[y].length; x += 1) {
        if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  function createMatrix(width, height) {
    const matrix = [];
    while (height -= 1) {
      matrix.push(new Array(width).fill(0));
    }
    return matrix;
  }

  function createPiece(type) {
    if (type === 'T') {
      return [
              [0, 0, 0],
              [1, 1, 1],
              [0, 1, 0]
      ];
    } else if (type === 'O') {
      return [
              [2, 2],
              [2, 2]
      ];
    } else if (type === 'L') {
      return [
              [0, 3, 0],
              [0, 3, 0],
              [0, 3, 3]
      ];
    } else if (type === 'J') {
      return [
              [0, 4, 0],
              [0, 4, 0],
              [4, 4, 0]
      ];
    } else if (type === 'I') {
      return [
              [0, 5, 0, 0],
              [0, 5, 0, 0],
              [0, 5, 0, 0],
              [0, 5, 0, 0]
      ];
    } else if (type === 'Z') {
      return [
              [6, 6, 0],
              [0, 6, 6],
              [0, 0, 0]
      ];
    } else if (type === 'S') {
      return [
              [0, 7, 7],
              [7, 7, 0],
              [0, 0, 0]
      ];
    }
  }

  function draw() {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
  }

  function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = colors[value ];
          context.fillRect((x + offset.x), (y + offset.y), 1, 1);
        }
      });
    });
  }

  function merge(arena, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }

  function playerDrop() {
    player.pos.y += 1;
    if (collide(arena, player)) {
      player.pos.y -= 1;
      merge(arena, player);
      playerReset();
      arenaSweep();
      updateScore();
    }
    dropCounter = 0;
  }

  function playerMove(direction) {
    player.pos.x += direction;
    if (collide(arena, player)) {
      player.pos.x -= direction;
    }
  }

  function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
      arena.forEach(row => row.fill(0));
      player.score = 0;
      updateScore();
    }
  }

  function playerRotate(direction) {
    let pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, direction);
    while (collide(arena, player)) {
      player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > player.matrix[0].length) {
        rotate(player.matrix, -direction);
        player.pos.x = pos;
        return;
      }
    }
  }

  function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < y; x += 1) {
        [
          matrix[x][y],
          matrix[y][x]
        ] = [
          matrix[y][x],
          matrix[x][y]
        ];
      }
    }
    if (direction > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  let dropCounter = 0;
  let dropInterval = 1000;

  let lastTime = 0;

  function update(time = 0) {
    const delatTime = time - lastTime;
    lastTime = time;
    dropCounter += delatTime;
    if (dropCounter > dropInterval) {
      playerDrop();
    }
    draw();
    requestAnimationFrame(update);
  }

  function updateScore() {
    console.log(player.score);
  }

  const colors = [
    null,
    '#ff0d72',
    '#0dC2ff',
    '#0dff72',
    '#f538ff',
    '#ff8E0d',
    '#ffe138',
    '#3877ff',
  ];

  const arena = createMatrix(12, 20);

  const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0
  };

  function onLeft() {
    playerMove(-1);
  }

  function onRight() {
    playerMove(1);
  }

  function onDrop() {
    playerDrop();
  }

  function onRotateCW() {
    playerRotate(1);
  }

  function onRotateCCW() {
    playerRotate(-1);
  }

  canvas.addEventListener(tetrisEvents.left, onLeft);
  canvas.addEventListener(tetrisEvents.right, onRight);
  canvas.addEventListener(tetrisEvents.drop, onDrop);
  canvas.addEventListener(tetrisEvents.rotatecw, onRotateCW);
  canvas.addEventListener(tetrisEvents.rotateccw, onRotateCCW);

  keyboard(canvas);
  socket(canvas);
  playerReset();
  update();

};
