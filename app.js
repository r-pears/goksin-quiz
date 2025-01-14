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

startBtn.addEventListener("click", async function beginGame() {
  await getQuestions();
  displayNext();
});

async function getQuestions() {
  const url =
    "https://opentdb.com/api.php?amount=15&category=9&difficulty=medium&type=multiple";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error getting questions");

    const questionsData = await response.json();
    questions = questionsData.results; // Store questions
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
  const allAnswers = [
    questions[currentIndex].correct_answer,
    ...questions[currentIndex].incorrect_answers,
  ];

  shuffle(allAnswers);

  if (currentIndex < questions.length) {
    correctAnswer.classList.remove("clicked");
    currentQuestion.innerHTML = questions[currentIndex].question;
    console.log("Question:", questions[currentIndex].question);
    console.log("Answer:", questions[currentIndex].correct_answer);

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
          currentScore.innerHTML = `Score: ${score}`; // Update score display
          console.log("Correct! Score is now:", score);
          answerElement.style.color = "green"; // Show correct answer in green
        } else {
          console.log("Wrong answer!");
          answerElement.style.color = "red"; // Show incorrect answer in orange
        }
        answerElements.forEach((el) => (el.style.pointerEvents = "none"));
      });
    });

    currentIndex++;
  } else {
    console.log("No more questions!");
  }
}

correctAnswer.addEventListener("click", function () {
  if (!correctAnswer.classList.contains("clicked")) {
    correctAnswer.classList.add("clicked"); // Mark as clicked
    score++; // Increment score
    console.log("Score:", score);
    currentScore.innerHTML = `Score: ${score}`; // Update the score display
  }
});

nextBtn.addEventListener("click", displayNext);
