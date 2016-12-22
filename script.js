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

function generatePhraseHTML(phrase){
  return `<p>${phrase.join('<input type="text" autofocus required></input>')}</p>`
}

function getRandomPhrase(){
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function getRandomPromptKey() {
  const keys = Object.keys(prompts);
  return keys[Math.floor(Math.random() * keys.length)];
}

function getRandomPrompt() {
  return prompts[getRandomPromptKey()];
}

function prependNode(newNode, thing) {
  thing.insertBefore(newNode, thing.childNodes[0]);
}

function isDuplicateAnswer(answer) {
  return userInput.includes(answer);
}

function showQuestionPrompt() {
  document.getElementById('phrase').style.display = 'block';
}

function hideQuestionPrompt() {
  document.getElementById('phrase').style.display = 'none';
}

function updateTimer() {
  document.querySelector('#timer p').innerHTML = seconds;
}

function clearTimer(){
  document.querySelector('#timer p').innerHTML = ('');  
}

function hideButton() {
  document.querySelector('#start').style.display = 'none';
}

function showButton() {
  document.querySelector('#start').style.display = 'block';  
}

function clearAnswers() {
  document.querySelector('#answers').innerHTML = '';
  userInput = [];
}

function addASecond() {
  // I know, it's two seconds. But it looks like one.
  seconds += 2;
}

function clearGameOverText() {
  document.querySelector('#gameover').innerHTML = '&nbsp;';
}

function setUpGame() {
  startOfGameScore = parseInt(localStorage.score);
  lastAnswerTimestamp = Date.now();
  hideButton();
  clearTimer();
  clearGameOverText();
  document.querySelector('#phrase').innerHTML = generatePhraseHTML(getRandomPhrase());
  document.querySelector('#timer p').className = 'circle';
  showQuestionPrompt();
  clearAnswers();
  document.querySelector('input').focus();
}

function setGameOverText() {
  const score = parseInt(localStorage.score) - startOfGameScore;
  const gameOverText = `🤓 You got <strong>${score}</strong> points with <strong>${userInput.length}</strong> words!`;
  document.querySelector('#gameover').innerHTML = gameOverText;
}

function tearDownGame() {
  hideQuestionPrompt();
  document.querySelector('#start button').innerHTML = "Play Again"
  document.querySelector('#timer p').className = '';
  clearTimer();
  setGameOverText();
  showButton();
}

function addAnswerToPage(answer, points) {
  const p = document.createElement('p');
  p.innerHTML = `${answer} (${points})`;
  prependNode(p, document.querySelector('#answers'));
}

function clearInput(){
  document.querySelector('input').value = '';
}

function changeTimerColour(colour) {
  document.querySelector('#timer p').style.color = colour;
}

function getInitializedStats(gameType) {  
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
  localStorage[gameType] = localStorage[gameType] || getInitializedStats(gameType);
}

function initializeStats() {
  localStorage.score = localStorage.score || 0;
  
  Object.keys(prompts).forEach(function(gameType) {
    initializeGameTypeStats(gameType);
  });
}

function startGame() {
  seconds = 15;
  setUpGame();
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

// getWord('stop', function(result) {
//   console.log(result);
// });

document.querySelector('#phrase').addEventListener('input', function(e) {
  // Validate the answer

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

  butts.innerHTML = localStorage.score;
  addAnswerToPage(answer, points);
  clearInput();
})

document.querySelector('button').addEventListener('click', function(e) {
  startGame();
})

const prompts = {
  fillTheBlank: [
    ["A piece of ", "."],
    ["A pair of ", "."],
    ["Close the ", "."]
  ],
  metaphor: [
    ["Sticky as (a/an) ", "."],
    ["Round as (a/an) ", "."],
    ["Hard as (a/an) ", "."],
    ["Soft as (a/an) ", "."],
    ["Nimble as (a/an) ", "."]
  ],
  nameGame: [
    ["", " is an animal."],
    ["", " is an item of clothing."],
    ["", " is a food."],
  ]
}

const phrases = getRandomPrompt();

const butts = document.querySelector('#score');
let userInput = [];
let lastAnswerTimestamp, seconds, startOfGameScore;

initializeStats();
butts.innerHTML = localStorage.score;
