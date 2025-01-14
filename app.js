let questions = [];
let currentIndex = 0;
let score = 0;

const startBtn = document.getElementById("start-game-btn");
const nextBtn = document.getElementById("next-question-btn");
const currentQuestion = document.getElementById("current-question");
const correctAnswer = document.getElementById("correct-answer");
const currentScore = document.getElementById("current-score");
const answersContainer = document.getElementById("answers");
const generalKnowledgeBtn = document.getElementById("general-knowledge-btn");
const booksBtn = document.getElementById("books-btn");
const moviesBtn = document.getElementById("movies-btn");
const historyBtn = document.getElementById("history-btn");
const progressBar = document.getElementById("progress-bar");
const finalScoreDisplay = document.getElementById("final-score");

startBtn.addEventListener("click", async function beginGame() {
  currentIndex = 0;
  score = 0;
  await getQuestions();
  updateProgress();
  displayNext();
  finalScoreDisplay.style.display = "none";
});

async function getQuestions() {
  const url =
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error getting questions");

    const questionsData = await response.json();
    questions = questionsData.results;
    console.log("Questions fetched:", questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function displayNext() {
  if (currentIndex >= questions.length) {
    displayFinalScore();
    return;
  }

  const allAnswers = [
    questions[currentIndex].correct_answer,
    ...questions[currentIndex].incorrect_answers,
  ];

  shuffle(allAnswers);

  currentQuestion.innerHTML = questions[currentIndex].question;

  answersContainer.innerHTML = allAnswers
    .map(
      (answer) => `
        <div class="answer" data-correct="${
          answer === questions[currentIndex].correct_answer
        }">
          ${answer}
        </div>`
    )
    .join("");

  const answerElements = document.querySelectorAll(".answer");
  answerElements.forEach((answerElement) => {
    answerElement.addEventListener("click", function () {
      const isCorrect = answerElement.dataset.correct === "true";

      if (isCorrect) {
        score++;
        currentScore.innerHTML = `Score: ${score}`;
        answerElement.style.color = "green";
      } else {
        answerElement.style.color = "red";
      }
      answerElements.forEach((el) => (el.style.pointerEvents = "none"));
    });
  });

  currentIndex++;
  updateProgress();
}

function updateProgress() {
  const progressPercent = ((currentIndex / questions.length) * 100).toFixed(0);
  progressBar.style.width = `${progressPercent}%`;
  progressBar.innerText = `${progressPercent}%`;
}

function displayFinalScore() {
  finalScoreDisplay.style.display = "block";
  finalScoreDisplay.innerHTML = `<h2>Final Score: ${score} / ${questions.length}</h2>`;
}

nextBtn.addEventListener("click", displayNext);
