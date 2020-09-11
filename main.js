const maxEnemy = 3;
const audio = document.createElement('embed');
audio.src = './audio.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = 'position: absolute; top: -1000px';

const showBestScore = document.querySelector('.BestScore');

const score = document.querySelector('.score'),
  easy = document.querySelector('.easy'),
  normal = document.querySelector('.normal'),
  hard = document.querySelector('.hard'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div');

car.classList.add('car');


easy.addEventListener('click', easyStart);
normal.addEventListener('click', startGame);
hard.addEventListener('click', hardStart);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function hardStart() {
  setting.speed = 8;
  setting.traffic = 2;
  startGame();
}

function easyStart() {
  setting.speed = 3;
  setting.traffic = 4;
  startGame();
}

function startGame() {
  easy.classList.add('hide');
  normal.classList.add('hide');
  hard.classList.add('hide');
  gameArea.innerHTML = '';

  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    const randomEnemy = Math.floor(Math.random() * maxEnemy) + 1;
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url("./image/enemy${randomEnemy}.png") center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  document.body.append(audio);
  car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    score.style.cssText = 'display: block; margin: 10px';
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y > document.documentElement.clientHeight) {
      line.y = -100;
    }
  })
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      console.warn('DTP');
      easy.classList.remove('hide');
      normal.classList.remove('hide');
      hard.classList.remove('hide');
      audio.remove();
      let theBestScore = localStorage.getItem('bestScore');
      showBestScore.style.cssText = 'display: block; margin: 10px';
      if (theBestScore < setting.score) {
        localStorage.setItem('bestScore', setting.score);
        showBestScore.innerHTML = 'The Best<br>' + setting.score;
      } else {
        showBestScore.innerHTML = 'The Best<br>' + theBestScore;
      }
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}