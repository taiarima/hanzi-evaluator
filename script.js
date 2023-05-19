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

const firstHanzi = hanziList[0].Simplified;
hanziPrompt.textContent = firstHanzi;

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

// submitListBtn.onclick = function () {
//   appContainer.classList.remove("hidden");
//   introText.classList.add("hidden");
//   modalChooseList.style.display = "none";
// };
