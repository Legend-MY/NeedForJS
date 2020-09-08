const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea');


start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


function startGame() {
  start.classList.add('hide');
}

function startRun(event) {
  event.preventDefault();
  console.log(event);
}

function stopRun(event) {
  console.log('stop');
}