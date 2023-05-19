`use strict`;

// Selecting Elements
const logo = document.querySelector(".logo");
const title = document.querySelector(".title");
const chooseListLink = document.querySelector(".choose-list-link");
const settingsLink = document.querySelector(".settings-link");
const aboutLink = document.querySelector(".about-link");
const helpLink = document.querySelector(".help-link");
const appContainer = document.querySelector(".app-container");
const hanziPrompt = document.querySelector(".hanzi-prompt");
const answerText = document.querySelector(".answer-text");
const checkAnsBtn = document.querySelector(".check-ans-btn");
const undoBtn = document.querySelector(".undo-btn");
const submitListBtn = document.querySelector(".submit-list-btn");
const listLowerRange = document.querySelector(".lower-range");
const listUpperRange = document.querySelector(".upper-range");
const listUserName = document.getElementById(".list-name");
const introText = document.querySelector(".intro-text");
const pronChoiceList = document.querySelectorAll(".pron-choice");
const meaningChoiceList = document.querySelectorAll(".mean-choice");
const submitAnswerBtn = document.querySelector(".submit-answer");

// This value will be set by the user when they begin the test to determine whether they are presented simplified or traditional characters
let simplified = true;

// The user must select the pronunciation and meaning which match this hanzi object
let currentCorrectHanzi;

// These variables will be used in the calculateRange function
let highestCorrectHanzi = 0;
let lowestIncorrectHanzi = 6000;
let currentStreak = 0;
let totalAnswers = 0;
let correctAnswersThisRound = 0;
let incorrectAnswersThisRound = 0;
let min = 0;
let max = 500;
let correctAnswer;
let triesUntilTestOver = 100;
const correctAnswers = [];
const incorrectAnswers = [];

function generatePrompt() {
  // This array will hold the four random hanzi objects which make up the choices
  const hanziArray = [];
  for (let i = 0; i < pronChoiceList.length; i++) {
    hanziArray.push(generateRandomHanzi(min, max));
  }

  // Fill up the pronunciation choices
  hanziArray.forEach(
    (hanzi, i) => (pronChoiceList[i].textContent = hanzi.pronunciation)
  );

  // Shuffle the array so that the meaning and pronunciations are not in the same columns
  shuffleArray(hanziArray);

  // Fill up the meaning choices
  hanziArray.forEach(
    (hanzi, i) => (meaningChoiceList[i].textContent = hanzi.meaning)
  );

  // Choose one of the Hanzi to be the correct answer
  const correctHanzi =
    hanziArray[Math.floor(Math.random() * hanziArray.length)];
  hanziPrompt.textContent = simplified
    ? correctHanzi.simplified
    : correctHanzi.traditional;
  currentCorrectHanzi = correctHanzi;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
generatePrompt();

function generateRandomHanzi() {
  const randomNum = Math.round(Math.random() * (max - min)) + min;
  return hanziList[randomNum];
}

function calculateRange() {
  // Update value based on whether user answered correctly
  const currentHanziIndex = hanziList.indexOf(currentCorrectHanzi);
  if (correctAnswer) {
    highestCorrectHanzi = Math.max(currentHanziIndex, highestCorrectHanzi);
    currentStreak = currentStreak > 0 ? ++currentStreak : 1;
    correctAnswers.push(currentHanziIndex);
    correctAnswersThisRound++;
  } else {
    lowestIncorrectHanzi = Math.min(currentHanziIndex, lowestIncorrectHanzi);
    currentStreak = currentStreak < 0 ? --currentStreak : -1;
    incorrectAnswersThisRound++;
    incorrectAnswers.push(currentHanziIndex);
  }

  // If user has gone through 100 hanzi, the test is over
  if (totalAnswers >= triesUntilTestOver) {
    // Test is over, determine user's score
    // Maybe call a game over function
    const userScore = estimateSkillLevel();
  }

  // Otherwise, determine new top and bottom if necessary according to user's current performance
  else {
    if (currentStreak >= 5) {
      // Set new bottom, push top up
      min = highestCorrectHanzi;
      max = Math.min(max * 2, hanziList.length);
    } else if (currentStreak <= -5) {
      // Set new top, push bottom down
      max = lowestIncorrectHanzi;
      min = min / 2;
    } else if (correctAnswersThisRound + incorrectAnswersThisRound >= 15) {
      // Adjust top and bottom accordingly
      if (highestCorrectHanzi > lowestIncorrectHanzi) {
        min = lowestIncorrectHanzi;
        max = highestCorrectHanzi;
      } else {
        max = highestCorrectHanzi;
        min = lowestIncorrectHanzi;
      }
    }
  }
}

function estimateSkillLevel() {
  // Calculate average difficulty level of correct answers
  const sumCorrect = correctAnswers.reduce((acc, level) => acc + level, 0);
  const avgCorrect = sumCorrect / correctAnswers.length;

  // Calculate average difficulty level of incorrect answers
  const sumIncorrect = incorrectAnswers.reduce((acc, level) => acc + level, 0);
  const avgIncorrect = sumIncorrect / incorrectAnswers.length;

  // Determine the range of difficulty levels covered by incorrect answers
  const lowestIncorrect = Math.min(...incorrectAnswers);
  const highestIncorrect = Math.max(...incorrectAnswers);
  const rangeIncorrect = highestIncorrect - lowestIncorrect;

  // Determine the range of difficulty levels covered by correct answers
  const lowestCorrect = Math.min(...correctAnswers);
  const highestCorrect = Math.max(...correctAnswers);
  const rangeCorrect = highestCorrect - lowestCorrect;

  // Compare the ranges of correct and incorrect answers
  if (rangeCorrect > rangeIncorrect) {
    return avgCorrect;
  } else {
    return avgIncorrect;
  }
}

// Coding Modal windows
// Get the modal
const modalChooseList = document.querySelector(".modal-choose-list");
const modalAbout = document.querySelector(".modal-about");
const modalHelp = document.querySelector(".modal-help");

// Get the <span> element that closes the modal
const closeListModal = document.querySelector(".close-list-modal");
const closeAboutModal = document.querySelector(".close-about-btn");
const closeHelpModal = document.querySelector(".close-help-btn");

// When the user clicks the link, open the modal
chooseListLink.onclick = function () {
  modalChooseList.style.display = "block";
};

aboutLink.onclick = function () {
  modalAbout.style.display = "block";
};

helpLink.onclick = function () {
  modalHelp.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
closeListModal.onclick = function () {
  modalChooseList.style.display = "none";
};

closeAboutModal.onclick = function () {
  modalAbout.style.display = "none";
};

closeHelpModal.onclick = function () {
  modalHelp.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (
    event.target == modalChooseList ||
    event.target == modalAbout ||
    event.target == modalHelp
  ) {
    modalChooseList.style.display = "none";
    modalAbout.style.display = "none";
    modalHelp.style.display = "none";
  }
};

// Makes sure only one pronunciation choice can be selected at once
pronChoiceList.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (event.target.classList.contains("choice-activated")) {
      event.target.classList.remove("choice-activated");
    } else {
      // Remove 'choice-activated' class from all buttons
      pronChoiceList.forEach((btn) => btn.classList.remove("choice-activated"));

      // Add 'choice-activated' class to the clicked button
      button.classList.toggle("choice-activated");
    }

    if (
      document.querySelector(".pron-choice.choice-activated") &&
      document.querySelector(".mean-choice.choice-activated")
    ) {
      submitAnswerBtn.textContent = "Submit Answer";
    } else {
      submitAnswerBtn.textContent = "I don't know";
      console.log("I am getting here");
    }
  });
});

// Makes sure only one meaning choice can be selected at once
meaningChoiceList.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (event.target.classList.contains("choice-activated")) {
      event.target.classList.remove("choice-activated");
    } else {
      // Remove 'choice-activated' class from all buttons
      meaningChoiceList.forEach((btn) =>
        btn.classList.remove("choice-activated")
      );

      // Add 'choice-activated' class to the clicked button
      button.classList.toggle("choice-activated");
    }

    if (
      document.querySelector(".pron-choice.choice-activated") &&
      document.querySelector(".mean-choice.choice-activated")
    ) {
      submitAnswerBtn.textContent = "Submit Answer";
    } else {
      submitAnswerBtn.textContent = "I don't know";
      console.log("I am getting here");
    }
  });
});

submitAnswerBtn.addEventListener("click", function () {
  if (submitAnswerBtn.textContent === "I don't know") {
    // mark it incorrect
  } else {
    const pronSelection = document.querySelector(
      ".pron-choice.choice-activated"
    ).textContent;
    const meanSelection = document.querySelector(
      ".mean-choice.choice-activated"
    ).textContent;
    if (
      currentCorrectHanzi.pronunciation == pronSelection &&
      currentCorrectHanzi.meaning == meanSelection
    ) {
      console.log("Correct answer!");
      correctAnswer = true;
    } else {
      console.log("Incorrect answer :(");
      correctAnswer = false;
    }
    calculateRange();
  }
});
