async function getQuestions() {
  const url =
    "https://opentdb.com/api.php?amount=10&category=10&difficulty=medium&type=multiple";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error getting questions");

    const questionsData = await response.json();

    console.log(questionsData); // Log questionsData here
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

getQuestions();
