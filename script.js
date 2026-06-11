let quizData = [];
let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

const MAX_QUESTIONS = 20;

// --------------------------- Load selected category

async function startGame(category) {

    try {
        const response = await fetch(`data/${category}.json`);

        if (!response.ok) {
            throw new Error(`Could not load "${category}" questions (${response.status})`);
        }

        quizData = await response.json();

    } catch (err) {
        alert(`Failed to load questions: ${err.message}`);
        return;
    }

    // Shuffle, then cap at MAX_QUESTIONS
    quizData.sort(() => Math.random() - 0.5);
    quizData = quizData.slice(0, MAX_QUESTIONS);

    currentQuestion = 0;
    score = 0;
    wrongAnswers = [];

    document.getElementById("menu").style.display = "none";
    document.getElementById("menuHeader").style.display = "none";
    document.getElementById("menuImage").style.display = "none";
    document.getElementById("game").style.display = "block";

    loadQuestion();
}

// --------------------------- Display Questions

function loadQuestion() {

    const question = quizData[currentQuestion];

    // Update progress bar
    const progressPercent = (currentQuestion / quizData.length) * 100;
    document.getElementById("progressBar").style.width = progressPercent + "%";

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1} of ${quizData.length}`;

    // Swap question image
    const img = document.getElementById("questionImage");
    img.src = question.image;
    img.alt = question.question;

    document.getElementById("questionText").textContent =
        question.question;

    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    question.choices.forEach(choice => {

        const button = document.createElement("button");
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        choicesContainer.appendChild(button);
    });

    document.getElementById("feedback").textContent = "";
}

// --------------------------- Check Answers

function checkAnswer(selectedAnswer) {

    const question = quizData[currentQuestion];
    const feedback = document.getElementById("feedback");

    // Disable all buttons on first click to prevent multiple answers
    const buttons = document.querySelectorAll("#choices button");
    buttons.forEach(button => button.disabled = true);

    if (selectedAnswer === question.answer) {

        score++;
        feedback.textContent = "Correct!";

    } else {

        feedback.textContent = `Incorrect. Correct answer: ${question.answer}`;

        wrongAnswers.push({
            question: question.question,
            image: question.image,
            yourAnswer: selectedAnswer,
            correctAnswer: question.answer
        });
    }

    document.getElementById("score").textContent = score;

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

    // Fill progress bar to 100% when done
    document.getElementById("progressBar").style.width = "100%";

    document.getElementById("game").style.display = "none";
    document.getElementById("results").style.display = "block";

    document.getElementById("finalScore").textContent =
        `You scored ${score} out of ${quizData.length}.`;

    const wrongContainer = document.getElementById("wrongAnswers");
    wrongContainer.innerHTML = "";

    if (wrongAnswers.length === 0) {

        wrongContainer.innerHTML = "<p>Perfect score — no missed questions!</p>";

    } else {

        wrongAnswers.forEach(item => {

            const div = document.createElement("div");
            div.className = "wrong-answer";
            div.innerHTML = `
                <img src="${item.image}" alt="${item.question}">
                <p><strong>Q:</strong> ${item.question}</p>
                <p><strong>Your answer:</strong> ${item.yourAnswer}</p>
                <p><strong>Correct answer:</strong> ${item.correctAnswer}</p>
            `;
            wrongContainer.appendChild(div);
        });
    }
}
