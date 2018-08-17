/*
 * Create a list that holds all of your cards
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* 
 * CARD SHUFFLING FUNCTIONALITY
 */

const deckCards = Array.from(document.querySelectorAll('.deck__card'));

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function displayCards(array) {
  const deck = document.querySelector('.deck');
  const docFragment = document.createDocumentFragment();
  array.forEach(card => {
    docFragment.appendChild(card);
  });
  deck.appendChild(docFragment);
}

displayCards(shuffle(deckCards));

/* 
 * CARD MATCH/MISMATCH FUNCTIONALITY
 */

const deck = document.querySelector('.deck');
deck.addEventListener('click', gameStartInit);
const tempOpenedCards = [];
const finOpenedCards = [];

function gameStartInit(event) {
  if (event.target.nodeName === 'LI') {
    cardsMatchInit(event.target);
    movesCounterInit();
    starRatingInit();
    setTimeout(gameOverInit, 500);
  }
}

function cardsMatchInit(elem) {
  createTempOpenedCardList(elem);
  tempOpenedCards.forEach(card => {
    showCardSymbol(card);
  });
  doCardsMatch(tempOpenedCards);
}

function createTempOpenedCardList(elem) {
  tempOpenedCards.push(elem);
}

function showCardSymbol(elem) {
  removeCardFromDOM(elem);
  elem.classList.add('deck__card--open', 'deck__card--show');
  returnCardToDOM(elem);
}

function removeCardFromDOM(elem) {
  elem.classList.add('deck__card--dom-hide');
}

function returnCardToDOM(elem) {
  elem.classList.remove('deck__card--dom-hide');
}

function doCardsMatch(tempOpenedCards) {
  const arr = tempOpenedCards;

  if (arr.length === 2) { 
    for (const deckCard of deckCards) {
      if (deckCard === arr[0] || deckCard === arr[1]) {
        continue;
      }
      disableCardFromClick(deckCard);
    }
    if (arr[0].innerHTML === arr[1].innerHTML) {
      yesCardsMatch(arr);
    } else {
      noCardsDontMatch(arr);
    }
  }
}

function disableCardFromClick(elem) {
  elem.classList.add('deck__card--disabled');
}

function yesCardsMatch(tempOpenedCards) {
  tempOpenedCards.forEach(card => {
    removeCardFromDOM(card);
    card.classList.remove('deck__card--open', 'deck__card--show');
    card.classList.add('deck__card--match');
    returnCardToDOM(card);
  });
  tempOpenedCards.splice(0);
  finOpenedCards.push('yes');
  for (const deckCard of deckCards) {
    enableCardForClick(deckCard);
  }
}

function noCardsDontMatch(tempOpenedCards) {
  tempOpenedCards.forEach(card => {
    card.classList.add('deck__card--unmatch');
  });
  setTimeout(returnCardsToDefault, 800, tempOpenedCards);
}

function returnCardsToDefault() {
  tempOpenedCards.forEach(card => {
    removeCardFromDOM(card);
    card.classList.remove('deck__card--open', 'deck__card--show', 'deck__card--unmatch');
    returnCardToDOM(card);
  });
  tempOpenedCards.splice(0);
  for (const deckCard of deckCards) {
    enableCardForClick(deckCard);
  }
}

function enableCardForClick(elem) {
  elem.classList.remove('deck__card--disabled');
}

/* 
 * GAME MOVES COUNTER FUNCTIONALITY
 */

let movesCount;

function movesCounterInit() {
  const movesCounter = document.querySelector('.moves__counter');
  movesCount = Number(movesCounter.textContent);
  movesCount += 1;
  movesCounter.textContent = movesCount;
}

/* 
 * PLAYER STAR RATING Functionality
 */

function starRatingInit() {
  if (movesCount == 1) {
    gameTimerInit();
  }

  if (movesCount > 2) {
    removeStarItem(5);
  }

  if (movesCount > 25) {
    removeStarItem(4);
  }

  if (movesCount > 30) {
    removeStarItem(3);
  }

  if (movesCount > 35) {
    removeStarItem(2);
  }
}

function removeStarItem(n) {
  const star = document.querySelector(`.solid-stars li:nth-child(${n})`);
  star.classList.add('stars__item--remove');
}

/* 
 * GAME TIMER FUNCTIONALITY
 */

const hours = document.querySelector('.timer__hours');
const minutes = document.querySelector('.timer__minutes');
const seconds = document.querySelector('.timer__seconds');
let timeCount = 0;
let timeTracker;

function gameTimerInit() {
  timeTracker = setInterval(gameTimeTracker, 1000);
}

function gameTimeTracker() {
  timeCount++;
  let numOfSeconds = timeCount % 60;
  let numOfMinutes = Number.parseInt(timeCount / 60);
  let numOfHours = Number.parseInt(timeCount / 3600);

  if (numOfMinutes >= 60) {
    numOfMinutes = numOfMinutes % 60;
  }

  seconds.textContent = padTime(numOfSeconds);
  minutes.textContent = padTime(numOfMinutes);
  hours.textContent = padTime(numOfHours);
}

function padTime(num) {
  return (num < 10) ? String(num).padStart(2, '0') : num;
}

window.addEventListener('blur', stopTimer);
window.addEventListener('focus', () => {
  if (movesCount === 0 || movesCount === undefined || isPopupOnPage()) {
    return;
  } else {
    gameTimerInit();
  }
});

function isPopupOnPage() {
  const popup = document.querySelector('.popup');
  if (popup.classList.contains('popup--show')) {
    return true;
  } else {
    return false;
  }
}

function stopTimer() {
  clearInterval(timeTracker);
}

/* 
 * GAME RESTART FUNCTIONALITY
 */

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', gameRestartInit);

function gameRestartInit() {
  resetOpenedCardLists();
  resetDeckCards();
  resetMovesCounter();
  resetTimer();

  for (let i = 5; i > 1; i--) {
    resetStarItem(i);
  }
}

function resetOpenedCardLists() {
  tempOpenedCards.splice(0);
  finOpenedCards.splice(0);
}

function resetDeckCards() {
  const deckResetClasses = [
    'deck__card--open',
    'deck__card--show',
    'deck__card--match'
  ];
  deckCards.forEach(deckCard => {
    deckCard.classList.remove(...deckResetClasses);
  });
  displayCards(shuffle(deckCards));
}

function resetMovesCounter() {
  movesCount = 0;
  const movesCounter = document.querySelector('.moves__counter');
  movesCounter.textContent = movesCount;
}

function resetTimer() {
  timeCount = 0;
  stopTimer();
  const timerContainer = document.querySelectorAll('.timer span');
  timerContainer.forEach(item => {
    item.textContent = '00';
  });
}

function resetStarItem(n) {
  const star = document.querySelector(`.solid-stars li:nth-child(${n})`);
  star.classList.remove('stars__item--remove');
}

/* 
 * GAME OVER FUNCTIONALITY
 */

function gameOverInit() {
  if (finOpenedCards.length === (deckCards.length / 2)) {
    const popup = document.querySelector('.popup');
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal__btn--close');
    const modalRestart = document.querySelector('.modal__btn--restart');

    displayPopup(popup);
    displayGameStats();

    const restartActivators = [overlay, modalClose, modalRestart];
    for (const restartActivator of restartActivators) {
      restartActivator.addEventListener('click', () => {
        popup.classList.remove('popup--show');
        gameRestartInit();
      });
    }
  }
}

function displayPopup(popupHolder) {
  stopTimer();
  popupHolder.classList.add('popup--show');
}

function displayGameStats() {
  const starRating = document.querySelector('.star-rating');
  const numOfMoves = document.querySelector('.no-of-moves');
  const completionTime = document.querySelector('.completion-time');

  starRating.textContent = getStarRating();
  numOfMoves.textContent = movesCount;
  completionTime.textContent = `${hours.textContent}hr : ${minutes.textContent}min : ${seconds.textContent}sec`;
}

function getStarRating() {
  const stars = Array.from(document.querySelectorAll(`.solid-stars li`));
  let numOfStars = stars.filter(star => {
    return !(star.classList.contains('stars__item--remove'));
  });
  numOfStars = numOfStars.length;
  return numOfStars;
}