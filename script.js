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

getWord('stop', function(result) {
  console.log(result);
});

const phrases = [
  ["A piece of ", "."],
  ["A pair of ", "."],
  ["Close the ", "."]
];

const butts = document.querySelector('.score');
const userInput = [];

localStorage.score = localStorage.score || 0;
butts.innerHTML = localStorage.score;


document.querySelector('#phrase').addEventListener('input', function(e) {
  // Validate the answer

  const answer = this.querySelector('input').value;
  console.log(answer);
  if (isDuplicateAnswer(answer)) {
    this.querySelector('input').setCustomValidity('butt');
    return;
  }
  this.querySelector('input').setCustomValidity('');  
});

document.querySelector('#phrase').addEventListener('submit', function(e) {
  e.preventDefault();
  const answer = this.querySelector('input').value;

  userInput.push(answer);

  // Increment the score
  localStorage.score = parseInt(localStorage.score) + 1;
  butts.innerHTML = localStorage.score;

  // Put the user's answer somewhere on the page
  const p = document.createElement('p');
  p.innerHTML = answer;
  prependNode(p, document.querySelector('#answers'));
  this.querySelector('input').value = "";
})

butt = generatePhraseHTML(getRandomPhrase());
document.querySelector('#phrase').innerHTML = butt;
