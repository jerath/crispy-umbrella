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

function updateTimerText(seconds) {
  document.querySelector('#timer p').innerHTML = seconds;
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

function setUpGame() {
  startOfGameScore = parseInt(localStorage.score);
  lastAnswerTimestamp = Date.now();
  hideButton();
  updateTimerText('');
  document.querySelector('#phrase').innerHTML = generatePhraseHTML(getRandomPhrase());
  document.querySelector('#timer p').className = 'circle';
  showQuestionPrompt();
  clearAnswers();
  document.querySelector('input').focus();
}

function tearDownGame() {
  const score = parseInt(localStorage.score) - startOfGameScore;
  hideQuestionPrompt();
  document.querySelector('#start button').innerHTML = "Play Again"
  document.querySelector('#timer p').className = '';
  updateTimerText(`🤓 You got <strong>${score}</strong> points with <strong>${userInput.length}</strong> words!`);
  showButton();
}

function startGame() {
  let seconds = 15;
  setUpGame();
  countdown();
  const intervalId = setInterval(countdown, 1000);

  function countdown(){
    if(seconds < 0){
      document.querySelector('#timer p').style.color = '#f1c40f';
      tearDownGame();
      clearInterval(intervalId);
    } else {
      if(seconds < 11){
        document.querySelector('#timer p').style.color = '#e74c3c';
      } else {
        document.querySelector('#timer p').style.color = '#3498db';
      }
      updateTimerText(seconds);
      seconds--;
    }
  }
}

// getWord('stop', function(result) {
//   console.log(result);
// });

const phrases = [
  ["A piece of ", "."],
  ["A pair of ", "."],
  ["Close the ", "."],
  ["", " is an animal."],
  ["", " is a food."],
];

const butts = document.querySelector('#score');
let userInput = [];
let lastAnswerTimestamp;

localStorage.score = localStorage.score || 0;
let startOfGameScore;

butts.innerHTML = localStorage.score;

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
  localStorage.score = Math.round(parseInt(localStorage.score) + points);

  butts.innerHTML = localStorage.score;

  // Put the user's answer somewhere on the page
  const p = document.createElement('p');
  p.innerHTML = `${answer} (${points})`;
  prependNode(p, document.querySelector('#answers'));
  this.querySelector('input').value = "";
})

document.querySelector('button').addEventListener('click', function(e) {
  startGame();
})

// https://chrome.google.com/webstore/detail/mleildoepealeaifeedjkgglnbdfflpn


