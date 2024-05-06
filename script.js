const cards = document.querySelectorAll('.memory-card');
const tryCountElement = document.getElementById('try-count');
const timerElement = document.getElementById('timer');
const gridSizeSelect = document.getElementById('grid-size');


let gridSize = parseInt(gridSizeSelect.value);
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let tryCount = 0;
let timer = null;
let matchedCards = 0;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  tryCount++;
  tryCountElement.textContent = tryCount;

  checkForMatch();
}

function startTimer() {
  let seconds = 0;
  let minutes = 0;

  timer = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString().padStart(2, '0')}`;
    timerElement.textContent = formattedTime;

    if (minutes === 1) {
      clearInterval(timer);
      timer = null;
      endGame('Time is up!');
    }
  }, 1000);
}

function checkForMatch() {
  let isMatch = firstCard.dataset.flower === secondCard.dataset.flower;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
  matchedCards++;
  if (matchedCards === gridSize * gridSize / 2) {
    clearInterval(timer);
    timer = null;
    endGame('Congratulations! You matched all pairs!');
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function endGame(message) {
  console.log(message);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffleCards() {
  cards.forEach((card) => {
    let random = Math.floor(Math.random() * cards.length);
    card.style.order = random;
  });
}

function updateGridSize() {
  gridSize = parseInt(gridSizeSelect.value);
  cards.forEach((card, index) => {
    if (index < gridSize * gridSize) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  shuffleCards();
}

gridSizeSelect.addEventListener('change', updateGridSize);
cards.forEach((card) => card.addEventListener('click', flipCard));

updateGridSize();
startTimer();