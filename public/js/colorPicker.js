var colors = [];
var numOfColors = 6;
var rgbValue = document.getElementById("rgbValue");
var squares = document.querySelectorAll(".square");
var msgText = document.getElementById("status");
var jumbo = document.querySelector(".jumbotron");
var reset = document.getElementById("reset");
var easy = document.getElementById("easy");
var hard = document.getElementById("hard");
var answerColor = "";

// set up square listeners
for (i=0; i<squares.length; i++) {
    squares[i].addEventListener("click", function() {
        checkMatch(this);
    })
}

//can refactor these listeners into one array block using querySelectorAll on buttons
// setup New Game listener
reset.addEventListener("click", function() {
    initializeGame();
})

// set up Easy buttom listener
easy.addEventListener("click", function() {
    numOfColors = 3;
    this.classList.add("selected");
    hard.classList.remove("selected");
    initializeGame();
})

// set up Hard buttom listener
hard.addEventListener("click", function() {
    numOfColors = 6;
    this.classList.add("selected");
    easy.classList.remove("selected");
    initializeGame();
})

function getRandomIntInclusive (min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
}

function checkMatch(guess) {
    if (guess.style.background === answerColor) {
        msgText.textContent = "Correct!";
        for (i=0; i<squares.length; i++) {
            squares[i].style.background = answerColor;
        }
        jumbo.style.background = answerColor;  
        reset.style.background = answerColor;
        easy.style.background = answerColor;
        hard.style.background = answerColor;
    }
    else {
        guess.style.background = "rgb(255, 255, 255)";
        msgText.textContent = "Try Again";
    }
}

function initializeGame() {
    colors.length = 0;
    msgText.textContent = "";
    jumbo.style.background = "";
    reset.style.background = "";
    easy.style.background = "";
    hard.style.background = "";
    //initialize colors
    for (i=0; i<numOfColors; i++) {
        var r = getRandomIntInclusive(0,255);
        var g = getRandomIntInclusive(0,255);
        var b = getRandomIntInclusive(0,255);
        var c = r + ", " + g + ", " + b;
        var rgbString = "rgb(" + c + ")";
        colors.push(rgbString);
    }
    //select the answer color
    answerColor = colors[getRandomIntInclusive(0,(colors.length-1))];
    rgbValue.textContent = answerColor;

    // initialize squares with colors
    for (i=0; i<squares.length; i++) {
        squares[i].style.display = "block";
        if (colors[i]) {
            squares[i].style.background = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
}

numOfColors = 6;
hard.classList.add("selected");
easy.classList.remove("selected");
initializeGame();
