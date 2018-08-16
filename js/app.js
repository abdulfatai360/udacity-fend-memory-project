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
deck.addEventListener('click', cardsMatchInit);
const tempOpenedCards = [];
const finOpenedCards = [];

function cardsMatchInit(event) {
  if (event.target.nodeName === 'LI') {
    cardsMatchFunc(event.target);
    // movesCounterInit();
    // console.log('A LI was clicked.');
  }
}

function cardsMatchFunc(elem) {
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
  const deckCards = Array.from(document.querySelectorAll('.deck__card'));
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
      noCardsDoesntMatch(arr);
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
    enableCardToClick(deckCard);
  }
}

function noCardsDoesntMatch(tempOpenedCards) {
  tempOpenedCards.forEach(card => {
    card.classList.add('deck__card--unmatch');
  })
  setTimeout(returnCardsToDefault, 1000, tempOpenedCards);
}

function returnCardsToDefault() {
  tempOpenedCards.forEach(card => {
    removeCardFromDOM(card);
    card.classList.remove('deck__card--open', 'deck__card--show', 'deck__card--unmatch');
    returnCardToDOM(card);
  });
  tempOpenedCards.splice(0);
  for (const deckCard of deckCards) {
    enableCardToClick(deckCard);
  }
}

function enableCardToClick(elem) {
  elem.classList.remove('deck__card--disabled');
}

/* 
 * Move Counter Functionality
 */
// const movesCounter = document.querySelector('.moves__counter');
// let movesCount = Number(movesCounter.textContent);

// function movesCounterInit() {
//   movesCount += 1;
//   console.log('movesCount', movesCount);
//   movesCounter.textContent = movesCount;
// }