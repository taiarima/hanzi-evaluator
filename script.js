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

// These variables will be used in the calculateRange function, initialized in initailizeTest function
let highestCorrectHanzi;
let lowestIncorrectHanzi;
let currentStreak;
let totalAnswers;
let correctAnswersThisRound;
let incorrectAnswersThisRound;
let min;
let max;
let correctAnswer;
let triesUntilTestOver;
let correctAnswers;
let incorrectAnswers;
let honingRangeBool;

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
    let nextHanzi;
    // This do:while loop should prevent us from seeing any hanzi twice in the same test
    do {
      nextHanzi = generateRandomHanzi();
    } while (
      incorrectAnswers.includes(hanziList.indexOf(nextHanzi)) ||
      correctAnswers.includes(hanziList.indexOf(nextHanzi)) ||
      hanziArray.includes(nextHanzi)
    );
    hanziArray.push(nextHanzi);
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

// Going to try to implement improved function from Japanese version, so commenting this all out for now
// Keeps track of incorrect and correct answers and calculates a new range based on these
// function calculateRange() {
//   totalAnswers++;
//   // Update value based on whether user answered correctly
//   const currentHanziIndex = hanziList.indexOf(currentCorrectHanzi);
//   if (correctAnswer) {
//     highestCorrectHanzi = Math.max(currentHanziIndex, highestCorrectHanzi);
//     currentStreak = currentStreak > 0 ? ++currentStreak : 1;
//     correctAnswers.push(currentHanziIndex);
//     correctAnswersThisRound++;
//   } else {
//     lowestIncorrectHanzi = Math.min(currentHanziIndex, lowestIncorrectHanzi);
//     currentStreak = currentStreak < 0 ? --currentStreak : -1;
//     incorrectAnswersThisRound++;
//     incorrectAnswers.push(currentHanziIndex);
//   }
//   console.log(
//     `totalAnswers = ${totalAnswers}\n currentStreak = ${currentStreak}\n min = ${min}\n max = ${max}`
//   );

//   // If user has gone through 100 hanzi, the test is over
//   if (totalAnswers >= triesUntilTestOver) {
//     if (incorrectAnswers.length === 0) {
//       triesUntilTestOver += 10;
//     } else {
//       generateResults();
//       return;
//     }
//   }

//   // Otherwise, determine new top and bottom if necessary according to user's current performance
//   else if (
//     Math.abs(currentStreak) >= 5 ||
//     correctAnswersThisRound + incorrectAnswersThisRound >= 15
//   ) {
//     if (currentStreak >= 5) {
//       // Set new bottom, push top up
//       min = highestCorrectHanzi;
//       max = Math.min(max + 650, hanziList.length);
//     } else if (currentStreak <= -5) {
//       // Set new top, push bottom down
//       max = Math.max(highestCorrectHanzi - 100, 50);
//       min = min / 2;
//     } else if (correctAnswersThisRound + incorrectAnswersThisRound >= 10) {
//       // Adjust top and bottom accordingly
//       if (highestCorrectHanzi > lowestIncorrectHanzi) {
//         min = highestCorrectHanzi;
//         max = Math.min(max + 250, hanziList.length);
//       } else {
//         max = highestCorrectHanzi;
//         min = lowestIncorrectHanzi;
//       }
//     }
//     if (min >= max || max - min < 50) {
//       // This will give the user a perfect score if they deserve it
//       if (min > 5900 && incorrectAnswers.length === 0) {
//         min = 6000;
//         max = 6000;
//         generateResults();
//         return;
//       }
//       min = Math.max(0, max - 250);
//     }
//     currentStreak = 0;
//     incorrectAnswersThisRound = 0;
//     correctAnswersThisRound = 0;
//   }
//   updateProgressBar();
// }

function calculateRange() {
  totalAnswers++;

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
    if (!honingRangeBool) {
      honingRangeBool = true;
      min = Math.max(hanziList.indexOf(currentCorrectHanzi) - 25, 0);
      max = hanziList.indexOf(currentCorrectHanzi) + 25;
    }
  }

  // For Debugging purposes
  // console.log(
  //   `totalAnswers = ${totalAnswers}\n currentStreak = ${currentStreak}\n min = ${min}\n max = ${max}`
  // );

  // If user has gone through 50 Hanzi, the test is over
  if (totalAnswers >= triesUntilTestOver) {
    if (incorrectAnswers.length === 0) {
      triesUntilTestOver += 10;
    } else {
      generateResults();
      return;
    }
  }

  // Otherwise, determine new top and bottom if necessary according to user's current performance
  // Only if the user has a current streak of abs(5) or 15 total answers this round

  // Condition 1 -- The user is on a positive streak so they probably know all the Hanzi in the range
  // This allows the range to quickly shoot up as long as the user consistently answers correctly
  if (currentStreak >= 5 && !honingRangeBool) {
    // Set new bottom, push top up
    min = highestCorrectHanzi;
    max = Math.min(max + 650, hanziList.length);
    endCalcRangeRound();
  }
  // Condition 2 -- The user is on a negative streak, so they might need the range bumped down otherwise they'll terminate early
  else if (currentStreak <= -5) {
    // Set new top, push bottom down
    max = highestCorrectHanzi + 50;
    min = highestCorrectHanzi;
    honingRangeBool = false;
    endCalcRangeRound();
  }

  // Condition 3 -- The user isn't on any streaks, but they've answered 15 prompts this round
  else if (correctAnswersThisRound + incorrectAnswersThisRound >= 15) {
    // If the user got at least 10 out of 15 correct, they can keep playing
    if (correctAnswersThisRound >= 10) {
      min = highestCorrectHanzi;
      max = Math.min(max + 100, hanziList.length);
      honingRangeBool = false;
      endCalcRangeRound();
    }
    // Otherwise we assume we have narrowed in on the user's proper level
    else {
      generateResults();
      return;
    }
  }

  // If, in calculating the new range, the min has dropped below the max or the range has gone too small
  if (min >= max || max - min < 50) {
    min = Math.max(0, max - 50);
  }

  // Special end game conditions
  // Perfect score
  if (min > 5900 && incorrectAnswers.length === 0) {
    min = 6000;
    max = 6000;
    generateResults();
    return;
  }
  // User doesn't know enough Hanzi to calculate a score
  if (incorrectAnswers.length >= 15 && correctAnswers.length === 0) {
    generateResults();
    return;
  }
  updateProgressBar();
}

function endCalcRangeRound() {
  currentStreak = 0;
  incorrectAnswersThisRound = 0;
  correctAnswersThisRound = 0;
}

// For testing application only, not for users
let testResults = []; // Array to hold the final scores of simulated tests using the function below
function testValue(maxHanziKnown, testRepetitions) {
  // maxHanziKnown simulates a user's current level, testRepetitions is how many times to simulate a test
  initializeTest();
  let incorrectAnswerCounter = 0; // this is used to simulate users randomly not knowing some hanzi, can be used by adjusting first if statement below
  for (let i = 0; i < testRepetitions; i++) {
    initializeTest();
    while (testInProgress) {
      currentCorrectHanzi = generateRandomHanzi();
      if (hanziList.indexOf(currentCorrectHanzi) <= maxHanziKnown) {
        correctAnswer = true;
      } else {
        correctAnswer = false;
      }
      calculateRange();
      incorrectAnswerCounter =
        incorrectAnswerCounter === 9 ? 0 : incorrectAnswerCounter + 1;
    }
  }
  const testsAverage =
    testResults.reduce((a, b) => a + b, 0) / testResults.length;
  let outlierCount = 0;
  testResults.forEach((val) => {
    if (Math.abs(val - maxHanziKnown) > maxHanziKnown / 10) {
      outlierCount++;
    }
  });
  console.log(`outlierCount = ${outlierCount}`);
  console.log(`testaverage = ${testsAverage}`);
  console.log(testResults);
  testResults = [];
}

// This function is to remove outliers from the incorrectAnswers Array at the end of the test
// This should help by not overly penalizing users who got some lower level kanji incorrect.
function removeOutliers(arr) {
  // Calculate mean
  const mean = arr.reduce((sum, value) => sum + value, 0) / arr.length;

  // Calculate standard deviation
  const squaredDifferences = arr.map((value) => (value - mean) ** 2);
  const variance =
    squaredDifferences.reduce((sum, value) => sum + value, 0) / arr.length;
  const standardDeviation = Math.sqrt(variance);

  // Remove outliers
  const threshold = 2;
  const filteredArr = arr.filter(
    (value) => Math.abs(value - mean) <= threshold * standardDeviation
  );

  // Get minimum value of the filtered array
  const minValue = Math.min(...filteredArr);

  return minValue;
}

function initializeTest() {
  // Update GUI
  introText.classList.add("hidden");
  appContainer.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  modalChooseList.style.display = "none";
  progressBar.style.width = 0;

  // Initialize variables for new test
  highestCorrectHanzi = 0;
  lowestIncorrectHanzi = 6000;
  currentStreak = 0;
  totalAnswers = 0;
  correctAnswersThisRound = 0;
  incorrectAnswersThisRound = 0;
  min = 0;
  max = 250;
  correctAnswer = false;
  triesUntilTestOver = 50;
  correctAnswers = [];
  incorrectAnswers = [];

  testInProgress = true;
  generatePrompt();
}

function generateResults() {
  lowestIncorrectHanzi = removeOutliers(incorrectAnswers);
  if (highestCorrectHanzi < max) {
    min = highestCorrectHanzi;
  }
  if (lowestIncorrectHanzi > highestCorrectHanzi) {
    max = lowestIncorrectHanzi;
  }
  const score = Math.floor((max + min) / 2);
  testResults.push(score);

  // Update GUI
  appContainer.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
  window.scrollTo(0, 0);
  resultString.textContent = `Wow, you know approximately ${score} Hanzi!`;
  if (incorrectAnswers.length > 0) {
    incorrectHanziTextArea.value = "Hanzi you answered incorrectly:\n";
    incorrectAnswers.forEach((hanziNum, idx) => {
      currHanzi = hanziList[hanziNum];
      incorrectHanziTextArea.value += `\n${idx + 1}. ${
        simplifiedCharset ? currHanzi.simplified : currHanzi.traditional
      } : ${currHanzi.pronunciation} -- ${trimMeaning(currHanzi.meaning)}\n`;
    });
  } else {
    incorrectHanziTextArea.value =
      "You answered every question correctly! You're a HANZI HERO! 💯😮🎉\n";
  }
  // TODO: Add an SNS sharing thing
  testInProgress = false;
}

// Progress bar
const progressBar = document.getElementById("progress-bar");
function updateProgressBar() {
  const percentage = (totalAnswers / triesUntilTestOver) * 100;
  progressBar.style.width = `${percentage}%`;
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
      submitAnswerBtn.textContent = "I don't know this hanzi";
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
      submitAnswerBtn.textContent = "I don't know this hanzi";
    }
  });
});

// The "submit answer" button actually has a variety of functions depending on the state
submitAnswerBtn.addEventListener("click", function () {
  meaningChoiceList.forEach((ele) => ele.classList.add("disabled-choice"));
  pronChoiceList.forEach((ele) => ele.classList.add("disabled-choice"));
  // The submit button changes to "next" after the user submits an answer. Clicking next generates next prompt.
  if (submitAnswerBtn.textContent === "Next") {
    pronChoiceList.forEach((ele) => {
      ele.classList.remove("incorrect-style");
      ele.classList.remove("correct-style");
      ele.classList.remove("disabled-choice");
    });
    meaningChoiceList.forEach((ele) => {
      ele.classList.remove("incorrect-style");
      ele.classList.remove("correct-style");
      ele.classList.remove("disabled-choice");
    });
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
    pronChoiceList.forEach((ele) => {
      if (ele.textContent === currentCorrectHanzi.pronunciation) {
        ele.classList.add("correct-style");
      }
    });
    meaningChoiceList.forEach((ele) => {
      if (ele.textContent === trimMeaning(currentCorrectHanzi.meaning)) {
        ele.classList.add("correct-style");
      }
    });
  }

  // Evaluates answer of pronunciation and meaning, correct answer only set if both are correct
  else {
    const pronSelection = document.querySelector(
      ".pron-choice.choice-activated"
    );
    const meanSelection = document.querySelector(
      ".mean-choice.choice-activated"
    );

    // Check pronunciation for correctness
    if (currentCorrectHanzi.pronunciation == pronSelection.textContent) {
      pronPrompt.textContent = "Pronunciation: Correct";
      pronSelection.classList.add("correct-style");
    } else {
      pronPrompt.textContent = "Pronunciation: Incorrect";
      pronSelection.classList.add("incorrect-style");
      pronChoiceList.forEach((ele) => {
        if (ele.textContent === currentCorrectHanzi.pronunciation) {
          ele.classList.add("correct-style");
        }
      });
    }

    // Check meaning for correctness
    if (trimMeaning(currentCorrectHanzi.meaning) == meanSelection.textContent) {
      meanPrompt.textContent = "Definition: Correct";
      meanSelection.classList.add("correct-style");
    } else {
      meanPrompt.textContent = "Definition: Incorrect";
      meanSelection.classList.add("incorrect-style");
      meaningChoiceList.forEach((ele) => {
        if (ele.textContent === trimMeaning(currentCorrectHanzi.meaning)) {
          ele.classList.add("correct-style");
        }
      });
    }

    // Evaluates total answer for correctness.
    // Answers are only correct if user selected correct pronunciation and meaning
    if (
      currentCorrectHanzi.pronunciation == pronSelection.textContent &&
      trimMeaning(currentCorrectHanzi.meaning) == meanSelection.textContent
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
