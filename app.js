let questions = [];
let currentIndex = 0;
let score = 0;

const startBtn = document.getElementById("start-game-btn");
const nextBtn = document.getElementById("next-question-btn");
const currentQuestion = document.getElementById("current-question");
const currentAnswer = document.getElementById("current-answer");
const currentIncorrectAnswer = document.getElementById("incorrect-answers");
const currentScore = document.getElementById("current-score");
const incorrectAnswers = document.getElementById("incorrect-answers");
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

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function displayNext() {
  // Combine correct and incorrect answers
  const allAnswers = [
    questions[currentIndex].correct_answer,
    ...questions[currentIndex].incorrect_answers,
  ];

  // Shuffle answers
  shuffle(allAnswers);

  if (currentIndex < questions.length) {
    currentAnswer.classList.remove("clicked");
    currentQuestion.innerHTML = questions[currentIndex].question;
    console.log("Question:", questions[currentIndex].question);
    console.log("Answer:", questions[currentIndex].correct_answer);

    // Display shuffled answers
    incorrectAnswers.innerHTML = allAnswers
      .map(
        (answer) => `
          <div class="answer" data-correct="${
            answer === questions[currentIndex].correct_answer
          }">
            ${answer}
          </div>`
      )
      .join("");
    currentIndex++;
  } else {
    console.log("No more questions!");
  }
  shuffle(allAnswers);
}

currentAnswer.addEventListener("click", function () {
  // Check if already clicked
  if (!currentAnswer.classList.contains("clicked")) {
    currentAnswer.classList.add("clicked"); // Mark as clicked
    score++; // Increment score
    console.log("Score:", score);
    currentScore.innerHTML = `Score: ${score}`; // Update the score display
  }
});

nextBtn.addEventListener("click", displayNext);

/* 
const mockQuestions = {
  results: [
    {
      question: "What is the capital of France?",
      correct_answer: "Paris",
      incorrect_answers: ["London", "Berlin", "Madrid"],
    },
    {
      question: "Which planet is known as the Red Planet?",
      correct_answer: "Mars",
      incorrect_answers: ["Earth", "Jupiter", "Venus"],
    },
    {
      question: "43",
      correct_answer: "343",
      incorrect_answers: ["Earth", "Jupiter", "Venus"],
    },
  ],
};

async function getMockQuestions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockQuestions); // Simulate API delay
    }, 1000);
  });
}

startBtn.addEventListener("click", async function getQuestions() {
  try {
    const questionsData = await getMockQuestions();

    questions = questionsData.results;
    currentQuestion.innerHTML = questions[currentIndex].question;
    currentAnswer.innerHTML = questions[currentIndex].correct_answer;
    currentIndex++;

    console.log("Questions Array (Mocked):", questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
});

function displayNext() {
  if (currentIndex < questions.length) {
    currentQuestion.innerHTML = questions[currentIndex].question;
    currentAnswer.innerHTML = questions[currentIndex].correct_answer;
    console.log("Question:", questions[currentIndex].question);
    console.log("Answer:", questions[currentIndex].correct_answer);
    currentIndex++;
  } else {
    console.log("No more questions!");
  }

  currentAnswer.addEventListener("click", function () {
    // Check if already clicked
    if (!currentAnswer.classList.contains("clicked")) {
      currentAnswer.classList.add("clicked"); // Mark as clicked
      score++; // Increment score
      console.log("Score:", score);
      currentScore.innerHTML = `Score: ${score}`; // Update the score display
    }
  });
}
*/
nextBtn.addEventListener("click", displayNext);
