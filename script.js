`use strict`;

// TODO:
// Test during a test needs to be fixed

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
const submitListBtn = document.querySelector(".submit-list-btn");
const listUserName = document.getElementById(".list-name");
const introText = document.querySelector(".intro-text");
const pronChoiceList = document.querySelectorAll(".pron-choice");
const meaningChoiceList = document.querySelectorAll(".mean-choice");
const submitAnswerBtn = document.querySelector(".submit-answer");
const beginTestBtn = document.querySelector(".begin-button");
const simpBtn = document.querySelector(".simplified-btn");
const tradBtn = document.querySelector(".traditional-btn");
const pronPrompt = document.querySelector(".pron-prompt");
const meanPrompt = document.querySelector(".mean-prompt");
const ansPrompt = document.querySelector(".ans-prompt");
const resultString = document.querySelector(".result-string");
const resultsContainer = document.querySelector(".results");
const incorrectHanziTextArea = document.querySelector(".incorrect-hanzi");
const abandonTestBtn = document.querySelector(".abandon-btn");
const continueTestBtn = document.querySelector(".continue-btn");
const chooseListDropdown = document.querySelector(".list-dropdown");
const aboutDropdown = document.querySelector(".about-dropdown");
const helpDropdown = document.querySelector(".help-dropdown");
const dropdown = document.querySelector(".dropdown");
const dropdownToggle = document.querySelector(".menu-toggle");

// Boolean to see if user is currently taking a test
let testInProgress = false;

// This value will be set by the user when they begin the test to determine whether they are presented simplified or traditional characters
let simplifiedCharset = true;

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
let correctAnswers = [];
let incorrectAnswers = [];

function generatePrompt() {
  // Reset the GUI
  ansPrompt.textContent = "Confirm Answer.";
  pronPrompt.textContent = "Select the correct pronunciation:";
  meanPrompt.textContent = "Select the correct definition:";
  submitAnswerBtn.textContent = "I don't know this hanzi";
  pronChoiceList.forEach((btn) => btn.classList.remove("choice-activated"));
  meaningChoiceList.forEach((btn) => btn.classList.remove("choice-activated"));

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
    (hanzi, i) =>
      (meaningChoiceList[i].textContent = trimMeaning(hanzi.meaning))
  );

  // Choose one of the Hanzi to be the correct answer
  const correctHanzi =
    hanziArray[Math.floor(Math.random() * hanziArray.length)];
  hanziPrompt.textContent = simplifiedCharset
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

// For meanings that are too long, delete all content after second semi-colon
function trimMeaning(meaning) {
  // Find the index of the second semicolon
  const secondSemicolonIndex = meaning.indexOf(";", meaning.indexOf(";") + 1);

  // If the second semicolon is found
  if (secondSemicolonIndex !== -1) {
    // Extract the substring before the second semicolon
    return meaning.substring(0, secondSemicolonIndex);
  }

  // If the second semicolon is not found, return the original string
  return meaning;
}

function generateRandomHanzi() {
  const randomNum = Math.round(Math.random() * (max - min)) + min;
  return hanziList[randomNum];
}

// Keeps track of incorrect and correct answers and calculates a new range based on these

// TODO: This algorithm is currently broken as it results in dead-ends....
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
    generateResults();
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

function initializeTest() {
  // Update GUI
  introText.classList.add("hidden");
  appContainer.classList.remove("hidden");
  modalChooseList.style.display = "none";

  // Reset state, in case user has done a test before
  highestCorrectHanzi = 0;
  lowestIncorrectHanzi = 6000;
  currentStreak = 0;
  totalAnswers = 0;
  correctAnswersThisRound = 0;
  incorrectAnswersThisRound = 0;
  min = 0;
  max = 500;
  correctAnswer = false;
  triesUntilTestOver = 100;
  correctAnswers = [];
  incorrectAnswers = [];

  testInProgress = true;
  generatePrompt();
}

function generateResults() {
  const score = estimateSkillLevel();

  // Update GUI
  appContainer.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
  resultString.textContent = `Wow, you know approximately ${score} Hanzi!`;
  incorrectAnswers.forEach(
    (hanziNum) => (incorrectHanziTextArea.value += hanziNum)
  ); // Fix this line to be the actual hanzi info

  // TODO: Add an SNS sharing thing
  testInProgress = false;
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
const modalAbandon = document.querySelector(".modal-abandon");

// Get the <span> element that closes the modal
const closeListModal = document.querySelector(".close-list-modal");
const closeAboutModal = document.querySelector(".close-about-btn");
const closeHelpModal = document.querySelector(".close-help-btn");
const closeAbandonModal = document.querySelector(".close-abandon-btn");

// When the user clicks the link, open the modal
chooseListLink.onclick = function () {
  if (testInProgress) {
    modalAbandon.style.display = "block";
    return;
  }
  modalChooseList.style.display = "block";
};

aboutLink.onclick = function () {
  modalAbout.style.display = "block";
};

helpLink.onclick = function () {
  modalHelp.style.display = "block";
};

// dropdownToggle.addEventListener("click", function () {
//   dropdown.classList.toggle("show");
// });

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("dropdown-item")) {
    const target = event.target;
    if (target === chooseListDropdown) {
      if (testInProgress) {
        modalAbandon.style.display = "block";
        return;
      }
      modalChooseList.style.display = "block";
    } else if (target === aboutDropdown) {
      modalAbout.style.display = "block";
    } else if (target === helpDropdown) {
      modalHelp.style.display = "block";
    }
    dropdown.classList.remove("show");
  }
});

// When the user clicks on <span> (x), close the modal
closeListModal.onclick = function () {
  modalChooseList.style.display = "none";
  simpBtn.classList.remove("choice-activated");
  tradBtn.classList.remove("choice-activated");
  beginTestBtn.classList.add("disabled-button");
};

closeAboutModal.onclick = function () {
  modalAbout.style.display = "none";
};

closeHelpModal.onclick = function () {
  modalHelp.style.display = "none";
};

closeAbandonModal.onclick = function () {
  modalAbandon.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (
    event.target == modalChooseList ||
    event.target == modalAbout ||
    event.target == modalHelp ||
    event.target == modalAbandon
  ) {
    modalChooseList.style.display = "none";
    modalAbout.style.display = "none";
    modalHelp.style.display = "none";
    modalAbandon.style.display = "none";
    simpBtn.classList.remove("choice-activated");
    tradBtn.classList.remove("choice-activated");
    beginTestBtn.classList.add("disabled-button");
  }
};

// Event Listeners

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
      submitAnswerBtn.textContent = "Submit";
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
      submitAnswerBtn.textContent = "Submit";
    } else {
      submitAnswerBtn.textContent = "I don't know";
    }
  });
});

// The "submit answer" button actually has a variety of functions depending on the state
submitAnswerBtn.addEventListener("click", function () {
  // The submit button changes to "next" after the user submits an answer. Clicking next generates next prompt.
  if (submitAnswerBtn.textContent === "Next") {
    window.scrollTo(0, 0);
    generatePrompt();
    return;
  }
  // If the user has completed the test, clicking this button will show results
  if (submitAnswerBtn.textContent === "Show results!") {
    generateResults();
  }

  // If the user entered "I don't know", this block is executed, otherwise answers evaluated
  if (submitAnswerBtn.textContent === "I don't know this hanzi") {
    correctAnswer = false;
    pronPrompt.textContent = 'You submitted "I don\'t know" for this hanzi.';
    meanPrompt.textContent = "";
  }
  // Evaluates answer of pronunciation and meaning, correct answer only set if both are correct
  else {
    const pronSelection = document.querySelector(
      ".pron-choice.choice-activated"
    ).textContent;
    const meanSelection = document.querySelector(
      ".mean-choice.choice-activated"
    ).textContent;

    // Check pronunciation for correctness
    if (currentCorrectHanzi.pronunciation == pronSelection) {
      pronPrompt.textContent = "Pronunciation: correct";
    } else {
      pronPrompt.textContent = "Pronunciation: incorrect";
    }

    // Check meaning for correctness
    if (trimMeaning(currentCorrectHanzi.meaning) == meanSelection) {
      meanPrompt.textContent = "Definition: correct";
    } else {
      meanPrompt.textContent = "Definition: incorrect";
    }

    // Evaluates total answer for correctness.
    // Answers are only correct if user selected correct pronunciation and meaning
    if (
      currentCorrectHanzi.pronunciation == pronSelection &&
      currentCorrectHanzi.meaning == meanSelection
    ) {
      correctAnswer = true;
    } else {
      correctAnswer = false;
    }
  }

  // Update GUI
  ansPrompt.textContent = "Click next to continue.";
  submitAnswerBtn.textContent = "Next";
  calculateRange();
});

simpBtn.addEventListener("click", function () {
  tradBtn.classList.remove("choice-activated");
  simpBtn.classList.add("choice-activated");
  beginTestBtn.classList.remove("disabled-button");
});

tradBtn.addEventListener("click", function () {
  simpBtn.classList.remove("choice-activated");
  tradBtn.classList.add("choice-activated");
  beginTestBtn.classList.remove("disabled-button");
});

beginTestBtn.addEventListener("click", function () {
  if (tradBtn.classList.contains("choice-activated")) {
    simplifiedCharset = false;
  } else {
    simplifiedCharset = true;
  }
  simpBtn.classList.remove("choice-activated");
  tradBtn.classList.remove("choice-activated");
  beginTestBtn.classList.add("disabled-button");
  initializeTest();
});

abandonTestBtn.addEventListener("click", function () {
  appContainer.classList.add("hidden");
  introText.classList.remove("hidden");
  modalChooseList.style.display = "block";
  modalAbandon.style.display = "none";
  testInProgress = false;
});

continueTestBtn.addEventListener("click", function () {
  modalAbandon.style.display = "none";
});
