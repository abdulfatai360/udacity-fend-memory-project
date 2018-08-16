/* 
 * Card Shuffling Functionality
 */

// Create a list that holds all of your cards
const deckCards = Array.from(document.querySelectorAll('.deck__card'));

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

  console.log(array)
}

displayCards(shuffle(deckCards));

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
 * Card Match/Mismatch Functionality
 */

const deck = document.querySelector('.deck');
deck.addEventListener('click', gameStartInit);
const tempOpenedCards = [];
const finOpenedCards = [];

function gameStartInit(event) {
  if (event.target.nodeName === 'LI') {
    cardsMatchInit(event.target);
    // console.log('A LI was clicked.');
    starRatingInit();
    setTimeout(gameOverInit, 500);
  }
}

function cardsMatchInit(elem) {
  createTempOpenedCardList(elem);

  tempOpenedCards.forEach(card => {
    showCardSymbol(card);
  })

  doCardsMatch(tempOpenedCards);
}

function createTempOpenedCardList(elem) {
  tempOpenedCards.push(elem);
  console.log('Initial Cards List', tempOpenedCards);
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
  // const deckCards = Array.from(document.querySelectorAll('.deck__card'));
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
    console.log('After Card Matching', tempOpenedCards);
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
  })
  tempOpenedCards.splice(0);
  finOpenedCards.push('yes');
  for (const deckCard of deckCards) {
    enableCardForClick(deckCard);
  }
}

function noCardsDontMatch(tempOpenedCards) {
  tempOpenedCards.forEach(card => {
    card.classList.add('deck__card--unmatch');
  })
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
 * Move Counter Functionality
 */

function movesCounterInit() {
  const movesCounter = document.querySelector('.moves__counter');
  let movesCount = Number(movesCounter.textContent);
  movesCount += 1;
  movesCounter.textContent = movesCount;
  console.log('movesCount', movesCount);
  return movesCount;
}

/* 
 * Star Rating Functionality
 */

function starRatingInit() {
  let movesCount = movesCounterInit();
  if (movesCount > 2) {
    hideStarItem(5);
  }

  if (movesCount > 25) {
    hideStarItem(4);
  }

  if (movesCount > 30) {
    hideStarItem(3);
  }

  if (movesCount > 35) {
    hideStarItem(2);
  }
}

function hideStarItem(n) {
  const star = document.querySelector(`.solid-stars li:nth-child(${n})`);
  star.classList.add('stars__item--remove');
}

/* 
 * Game Restart Functionality
 */

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', gameRestartInit);

function gameRestartInit() {
  tempOpenedCards.splice(0);
  finOpenedCards.splice(0);

  // Catch-all class list
  const classArr = [
    'deck__card--open',
    'deck__card--show',
    'deck__card--match'
  ]
  deckCards.forEach(deckCard => {
    deckCard.classList.remove(...classArr);
  })
  displayCards(shuffle(deckCards));

  const movesCounter = document.querySelector('.moves__counter');
  movesCounter.textContent = 0;

  for (let i = 5; i > 1; i--) {
    showStarItem(i)
  }
}

function showStarItem(n) {
  const star = document.querySelector(`.solid-stars li:nth-child(${n})`);
  star.classList.remove('stars__item--remove');
}

/* 
 * Game Over Functionality
 */

function gameOverInit() {
  if (finOpenedCards.length === 2) {
    window.alert('Congratulations');
  }
}