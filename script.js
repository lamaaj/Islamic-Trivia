let quizData = [];
let currentQuestion = 0;
let score = 0;

// Load selected category
async function startGame(category) {

    const response = await fetch(`data/${category}.json`);
    quizData = await response.json();

    // Shuffle questions
    quizData.sort(() => Math.random() - 0.5);

    currentQuestion = 0;
    score = 0;

    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";

    loadQuestion();
}

// ---------------------------  Display Questions


function loadQuestion() {
  
    const question = quizData[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1}`;

    document.getElementById("questionText").textContent =
        question.question;

    const choicesContainer =
        document.getElementById("choices");

    choicesContainer.innerHTML = "";

    question.choices.forEach(choice => {

        const button =
            document.createElement("button");

        button.textContent = choice;

        button.onclick = () =>
            checkAnswer(choice);

        choicesContainer.appendChild(button);
    });

    document.getElementById("feedback").textContent = "";
}


// ---------------------------  Check Answers

const buttons = document.querySelectorAll("#choices button"); // disbale clicking multiple answers

buttons.forEach(button => {
    button.disabled = true;
});


function checkAnswer(selectedAnswer) {

    const question = quizData[currentQuestion];

    const feedback =
        document.getElementById("feedback");

    if (selectedAnswer === question.answer) {

        score++;

        feedback.textContent =
            "Correct!";

    } else {

        feedback.textContent =
            `Incorrect. Correct answer: ${question.answer}`;
    }

    document.getElementById("score").textContent =
        score;

    currentQuestion++;

    setTimeout(() => {

        if (currentQuestion < quizData.length) {

            loadQuestion();

        } else {

            endGame();
        }

    }, 1500);
}

// --------------------------- End Game


function endGame() {

    document.getElementById("game").innerHTML = `
        <h2>Quiz Complete!</h2>

        <p>
            Final Score:
            ${score} / ${quizData.length}
        </p>

        <button onclick="location.reload()">
            Play Again
        </button>
    `;
}
