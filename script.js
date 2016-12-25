function getWord(word, callback) {
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      callback(JSON.parse(this.responseText));
    }
  });

  xhr.open("GET", `https://wordsapiv1.p.mashape.com/words/${word}/synonyms`);
  xhr.setRequestHeader("x-mashape-key", "g7B8bWxv79msheukI22LHR5HLzfAp1q9AnXjsn498UxGJ7JMLt");
  xhr.setRequestHeader("accept", "application/json");

  xhr.send(data); 
}

// ************************************************
// ************* DEV
// ************************************************

function resetScores() {
  Object.keys(prompts).forEach(function(gameType) {
    localStorage[gameType] = JSON.stringify({
      highScore: 0,
      mostWords: 0,
      longestLife: 0
    });
  });

  localStorage.allTime = JSON.stringify({
    highScore: 0,
    mostWords: 0,
    longestLife: 0
  });
}

// ************************************************
// ************* GET PHRASE
// ************************************************

function generatePhraseHTML(phrase){
  return `<p>${phrase.join('<input type="text" autofocus required></input>')}</p>`
}

function getRandomQuestion(questions){
  return questions[Math.floor(Math.random() * questions.length)];
}

function getRandomGameType() {
  const gameTypes = Object.keys(prompts);
  return gameTypes[Math.floor(Math.random() * gameTypes.length)];
}

function isDuplicateAnswer(answer) {
  return userInput.includes(answer);
}

// ************************************************
// ************* PAGE HELPERS
// ************************************************

function showQuestionPrompt() {
  document.getElementById('phrase').style.display = 'block';
}

function hideQuestionPrompt() {
  document.getElementById('phrase').style.display = 'none';
}

function hideButton() {
  document.querySelector('#start').style.display = 'none';
}

function showButton() {
  document.querySelector('#start').style.display = 'block';  
}

function showScoreBoard() {
  document.querySelector('#gametype-section').style.display = 'inline-block';
  document.querySelector('#right-now-section').style.display = 'inline-block';
}

function prependNode(newNode, thing) {
  thing.insertBefore(newNode, thing.childNodes[0]);
}

function addAnswerToPage(answer, points) {
  const p = document.createElement('p');
  p.innerHTML = `${answer} (${points})`;
  document.querySelector('#word-container').appendChild(p);
}

function addStatToPage(selector, stat) {
  document.querySelector(selector).innerHTML = stat;
}

function addStatsToPage() {
  let stats = JSON.parse(localStorage[gameType]);
  let allTimeStats = JSON.parse(localStorage.allTime);
  console.log(allTimeStats);

  // Add the all time scores
  addStatToPage('#high-score-ever .score', allTimeStats.highScore);
  addStatToPage('#longest-life-ever .score', allTimeStats.longestLife);
  addStatToPage('#most-words-ever .score', allTimeStats.mostWords);

  // Add the game-type specific scores
  document.querySelector('#high-score-gametype .score').innerHTML = stats.highScore;
  document.querySelector('#longest-life-gametype .score').innerHTML = stats.longestLife; 
  document.querySelector('#most-words-gametype .score').innerHTML = stats.mostWords;
  document.querySelector('#high-score-gametype .which-score').innerHTML = prettifyGametype[gameType];
  document.querySelector('#longest-life-gametype .which-score').innerHTML = prettifyGametype[gameType];
  document.querySelector('#most-words-gametype .which-score').innerHTML = prettifyGametype[gameType];
}

// ************************************************
// ************* TIMER
// ************************************************

function updateTimer() {
  document.querySelector('#timer p').innerHTML = seconds;
}

function clearTimer(){
  document.querySelector('#timer p').innerHTML = ('');  
  document.querySelector('#timer').style.display = 'none';
}

function changeTimerColour(colour) {
  document.querySelector('#timer p').style.color = colour;
}

function addASecond() {
  // I know, it's two seconds. But it looks like one.
  seconds += 2;
  lifeLength += 2;
}

// ************************************************
// ************* RESET 
// ************************************************

function clearAnswers() {
  document.querySelector('#word-container').innerHTML = '';
  userInput = [];
}

function clearGameOverText() {
  document.querySelector('#gameover').innerHTML = '&nbsp;';
}

function clearHurray() {
  document.querySelector('#hurray').innerHTML = '';
}

function clearInput(){
  document.querySelector('input').value = '';
}

function resetScoreBoard() {
  // Reset right now stats to zero
  document.querySelector('#high-score-right-now .score').innerHTML = 0;
  document.querySelector('#longest-life-right-now .score').innerHTML = 0;
  document.querySelector('#most-words-right-now .score').innerHTML = 0;
  // Set display none to board blocks

  document.querySelector('#gametype-section').style.display = 'none';
  document.querySelector('#right-now-section').style.display = 'none';
}

function clearOldGame(){
  clearAnswers();
  clearTimer();
  clearGameOverText();
  clearHurray();
}

// ************************************************
// ************* INITIALIZE GAME
// ************************************************

function getInitializedStats() {  
  // This function returns a string to be saved in localStorage
  return JSON.stringify({
    highScore: 0,
    mostWords: 0,
    longestLife: 0
  });
}

function initializeGameTypeStats(gameType) {
  // New user: Initialize stats to zero
  // Existing user: do nothing.
  console.log('hello');
  localStorage[gameType] = localStorage[gameType] || getInitializedStats(gameType);
}

function initializeStats() {
  Object.keys(prompts).forEach(function(gameType) {
    initializeGameTypeStats(gameType);
  });

  initializeGameTypeStats('allTime');
}

function setUpGame() {
  startOfGameScore = parseInt(localStorage.score);
  lastAnswerTimestamp = Date.now();
  hideButton();
  clearOldGame();
  gameType = getRandomGameType();
  showScoreBoard();
  document.querySelector('#phrase').innerHTML = generatePhraseHTML(getRandomQuestion(prompts[gameType]));
  document.querySelector('#timer p').className = 'circle';
  showQuestionPrompt();
  document.querySelector('input').focus();
}

// ************************************************
// ************* SCORE
// ************************************************

function userBeatTheirHighScoreForThisGameType(stats) {
  return getEndOfGameScore() > parseInt(stats.highScore);
}

function userBeatTheirHighScoreOfAllTime(){
  return getEndOfGameScore() > parseInt(localStorage.highScore);
}

function userBeatTheirMostWordsForThisGameType(stats) {
  return userInput.length > parseInt(stats.mostWords);
}

function userBeatTheirMostWordsOfAllTime() {
  return userInput.length > parseInt(localStorage.mostWords);
}

function userBeatTheirLongestLifeForThisGameType(stats) {
  return lifeLength > parseInt(stats.longestLife);
}

function userBeatTheirLongestLifeOfAllTime() {
  return lifeLength > parseInt(localStorage.longestLife);
}

function celebrate(hurray) {
  const p = document.createElement('p');
  p.innerHTML = hurray;
  prependNode(p, document.querySelector('#hurray'));
}

function updateEndOfGameStatsAndCelebrateAccordingly() {
  let stats = JSON.parse(localStorage[gameType]);
  let allTimeStats = JSON.parse(localStorage.allTime);

  if (userBeatTheirHighScoreForThisGameType(stats)) {
    // celebrate(`You beat your high score with <strong>${getEndOfGameScore()}</strong> points!`);
    stats.highScore = getEndOfGameScore();
  }

  if (userBeatTheirHighScoreOfAllTime) {
    allTimeStats.highScore = getEndOfGameScore();
  }

  if (userBeatTheirLongestLifeForThisGameType(stats)) {
    // celebrate(`<strong>${lifeLength}</strong> seconds! That was your longest game ever!`);
    stats.longestLife = lifeLength;
  }

  if (userBeatTheirLongestLifeOfAllTime) {
    allTimeStats.longestLife = lifeLength;    
  }

  if (userBeatTheirMostWordsForThisGameType(stats)) {
    // celebrate(`<strong>${userInput.length}</strong> words! That's the most you've ever gotten!`);
    stats.mostWords = userInput.length;
  }

  if (userBeatTheirMostWordsOfAllTime) {
    allTimeStats.mostWords = userInput.length;
  }

  localStorage[gameType] = JSON.stringify(stats);
  localStorage.allTime = JSON.stringify(allTimeStats);
  
  setGameOverText();
}

function getEndOfGameScore() {
  return parseInt(localStorage.score) - startOfGameScore;
}

function updateRightNowStats(points) {
  document.querySelector('#high-score-right-now .score').innerHTML = getEndOfGameScore();
  document.querySelector('#longest-life-right-now .score').innerHTML = lifeLength;
  document.querySelector('#most-words-right-now .score').innerHTML = userInput.length;
}

// ************************************************
// ************* GAME OVER
// ************************************************

function setGameOverText() {
  const score = getEndOfGameScore();
  const gameOverText = `&#129299; You got <strong>${score}</strong> points with <strong>${userInput.length}</strong> words!`;
  document.querySelector('#gameover').innerHTML = gameOverText;
}

function tearDownGame() {
  hideQuestionPrompt();
  document.querySelector('#start button').innerHTML = "Play Again"
  document.querySelector('#timer p').className = '';
  clearTimer();
  updateEndOfGameStatsAndCelebrateAccordingly();
  setGameOverText();
  showButton();
}

function startGame() {
  seconds = 15;
  lifeLength = seconds;
  setUpGame();
  addStatsToPage();
  document.querySelector('#timer').style.display = 'block';
  countdown();
  const intervalId = setInterval(countdown, 1000);

  function countdown(){
    if(seconds < 0){
      tearDownGame();
      clearInterval(intervalId);
    } else {
      if(seconds < 11){
        changeTimerColour('#e74c3c');
      } else {
        changeTimerColour('#3498db');
      }
      updateTimer();
      seconds--;
    }
  }
}

// ************************************************
// ************* LISTENERS
// ************************************************

document.querySelector('#phrase').addEventListener('input', function(e) {
  const answer = this.querySelector('input').value;
  if (isDuplicateAnswer(answer)) {
    this.querySelector('input').setCustomValidity('You already said that one!');
    return;
  }
  this.querySelector('input').setCustomValidity('');  
});

document.querySelector('#phrase').addEventListener('submit', function(e) {
  e.preventDefault();
  const answer = this.querySelector('input').value;

  userInput.push(answer);

  // Increment the score
  const points = Math.round(Math.max(5 - ((Date.now() - lastAnswerTimestamp) / 1000), 1));
  lastAnswerTimestamp = Date.now();
  addASecond();
  localStorage.score = Math.round(parseInt(localStorage.score) + points);

  addAnswerToPage(answer, points);
  updateRightNowStats(points);
  clearInput();
})

document.querySelector('button').addEventListener('click', function(e) {
  startGame();
})

// ************************************************
// ************* GLOBALS 
// ************************************************

const prompts = {
  fillTheBlank: [
    ["A piece of ", "."],
    ["A pair of ", "."],
    ["Close the ", "."]
  ],
  metaphor: [
    ["As sticky as ", "."],
    ["As round as ", "."],
    ["As hard as ", "."],
    ["As soft as ", "."],
    ["As nimble as ", "."]
  ],
  nameGame: [
    ["", " is an animal."],
    ["", " is an item of clothing."],
    ["", " is a food."],
  ]
}

const prettifyGametype = {
  fillTheBlank: 'fill the blank',
  metaphor: 'metaphor',
  nameGame: 'name game'
}

let userInput = [];
let lastAnswerTimestamp, seconds, startOfGameScore, gameType, lifeLength;

initializeStats();

// TODO:
// let the game-specific score and all time score run at the same time
// edit the beat high score text so that it makes more sense.
// hook up the game specific scores to show when you start the game
// - populates the heading with the correct (pretty) gametype
// - populates the square with the number
// hook up the right now, game specific scores to update automatically
// refactor the HTML/CSS