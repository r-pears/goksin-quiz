let questions = [];
let currentIndex = 0;
let score = 0;

const startBtn = document.getElementById("start-game-btn");
const nextBtn = document.getElementById("next-question-btn");
const currentQuestion = document.getElementById("current-question");
const currentScore = document.getElementById("current-score");
const answersContainer = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const finalScoreDisplay = document.getElementById("final-score");

nextBtn.style.visibility = "hidden"; // Hide Next button initially

startBtn.addEventListener("click", async function beginGame() {
  currentIndex = 0;
  score = 0;

  currentScore.style.display = "none"; // Hide live score
  finalScoreDisplay.style.display = "none"; // Hide final score

  nextBtn.style.visibility = "visible";
  nextBtn.disabled = true;

  await getQuestions();
  updateProgress();
  displayNext();
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

function displayNext() {
  if (currentIndex >= questions.length) {
    displayFinalScore();
    nextBtn.style.visibility = "hidden";
    return;
  }

  nextBtn.disabled = true;

  const currentQ = questions[currentIndex];

  const allAnswers = [currentQ.correct_answer, ...currentQ.incorrect_answers];
  shuffle(allAnswers);

  currentQuestion.innerHTML = currentQ.question;

  answersContainer.innerHTML = allAnswers
    .map(
      (answer) => `
        <div class="answer" data-correct="${
          answer === currentQ.correct_answer
        }">
          ${answer}
        </div>`
    )
    .join("");

  const answerElements = document.querySelectorAll(".answer");
  answerElements.forEach((answerElement) => {
    answerElement.addEventListener("click", function () {
      if (nextBtn.disabled) {
        const isCorrect = answerElement.dataset.correct === "true";

        if (isCorrect) {
          score++;
          answerElement.style.color = "green";
        } else {
          answerElement.style.color = "red";
        }

        answerElements.forEach((el) => (el.style.pointerEvents = "none"));
        nextBtn.disabled = false;
      }
    });
  });

  updateProgress();
}

function updateProgress() {
  const progressPercent = ((currentIndex / questions.length) * 100).toFixed(0);
  progressBar.style.width = `${progressPercent}%`;
  progressBar.innerText = `${progressPercent}%`;
}

function displayFinalScore() {
  toggleVisibility(currentScore, true);
  toggleVisibility(finalScoreDisplay, true);
  finalScoreDisplay.innerHTML = `<h2>Final Score: ${score} / ${questions.length}</h2>`;
}

nextBtn.addEventListener("click", function () {
  if (!nextBtn.disabled) {
    currentIndex++;
    displayNext();
  }
});

// moved utility functions to the bottom
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

// utility: Toggle visibility of an element
function toggleVisibility(element, isVisible) {
  element.style.display = isVisible ? "block" : "none";
}
