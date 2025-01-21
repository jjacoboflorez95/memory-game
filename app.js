"use strict";

// Store the path of all the images
const imagesArray = [];
// Store the rows and columns with the images of the current game.
let cardsArray = [];
// Store the matched images in the current game.
let matchedImages = [];
// Store the number of images files.
let numberImagesFile = 24;
// Store the player's name.
let playerName = "";
// set the highscore 0.
let highScore = 0;
// Store the total number of tries for matching cards.
let numberOfTries = 0;

// -------------------------------------------------------------------- //
// --------------------------- TABS CONTROL --------------------------- //
// -------------------------------------------------------------------- //
/**
 * Function that controls the display of the tabs
 * @param {*} evt
 */
const tabClicked = function (evt) {
  let tabClicked = $(this);

  if (tabClicked.attr("href") == "#tabs-1") {
    $("#tabs-1").removeClass("hide");
    $("#tabs-2").addClass("hide");
    $("#tabs-3").addClass("hide");
  } else if (tabClicked.attr("href") == "#tabs-2") {
    $("#tabs-2").removeClass("hide");
    $("#tabs-1").addClass("hide");
    $("#tabs-3").addClass("hide");
  } else {
    $("#tabs-3").removeClass("hide");
    $("#tabs-1").addClass("hide");
    $("#tabs-2").addClass("hide");
  }
  evt.preventDefault();
};

// -------------------------------------------------------------------- //
// ---------------------- ARRAY IMAGES--------------------------------- //
// -------------------------------------------------------------------- //
/**
 * Function that load the imagesArray that stores the path of all the images.
 */
const loadImagesArray = () => {
  for (let i = 1; i <= numberImagesFile; i++) {
    imagesArray.push("images/card_" + i + ".png");
  }
};

/**
 * Function that loads the cardsArray that stores the images matched in the current game.
 */
const loadCardsArray = () => {
  const columns = 8;
  const rows = parseInt($("#num_cards").val(), 10) / columns;
  let spotAvailable;
  let imageAlreadyPicked;
  let currentImagePickedCounter = 0;
  let imagesPicked = [];

  cardsArray = new Array(rows);
  for (let i = 0; i < cardsArray.length; i++) {
    cardsArray[i] = new Array(columns);
  }

  do {
    spotAvailable = checkSpotAvailable();
    if (spotAvailable) {
      let imageArrayValue;
      do {
        let imagePosition = randomNumber(numberImagesFile);
        imageArrayValue = imagesArray[imagePosition];
        if (imagesPicked.includes(imageArrayValue)) {
          imageAlreadyPicked = true;
        } else {
          imageAlreadyPicked = false;
        }
      } while (imageAlreadyPicked);
      do {
        let row = randomNumber(rows);
        let column = randomNumber(columns);
        let cardArrayValue = cardsArray[row][column];
        if (cardArrayValue) {
          continue;
        } else {
          currentImagePickedCounter++;
          cardsArray[row][column] = imageArrayValue;
        }
      } while (currentImagePickedCounter < 2);
      imagesPicked.push(imageArrayValue);
      currentImagePickedCounter = 0;
    }
  } while (spotAvailable);
};

/**
 * Functions that validates if there's an available spot in cardsArray to store another image.
 * @returns
 */
const checkSpotAvailable = () => {
  for (let i = 0; i < cardsArray.length; i++) {
    for (let j = 0; j < cardsArray[i].length; j++) {
      if (!cardsArray[i][j]) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Functions that returns a random number.
 * @param {*} ceilNumber
 * @returns
 */
const randomNumber = (ceilNumber) => {
  let random = Math.random();
  random = Math.floor(random * ceilNumber);
  return random;
};

// --------------------------------------------------------------------------------- //
// ---------------------- CREATE DIV ELEMENTS AND MATCHING ------------------------- //
// --------------------------------------------------------------------------------- //
/**
 * Functions that creates the div elements with the images
 */
const createDivImageElements = () => {
  const divCards = $("#cards");
  $(cardsArray).each((rowIndex, rowItem) => {
    const newDivCards = $('<div class="divCardsRow"></div>');
    $(rowItem).each((columnIndex, columnItem) => {
      const idAnchorElement = columnItem;
      const srcImgElement = "images/back.png";
      newDivCards.append(
        `<a id="${idAnchorElement}" href="#"><img src="${srcImgElement}" alt=""></a>`
      );
    });
    divCards.append(newDivCards);
  });
};

// --------------------------------------------------------------------------------- //
// ---------------------- PRELOAD AND MATCHING IMAGES ------------------------------ //
// --------------------------------------------------------------------------------- //
/**
 * Functions that preload the images and create event handlers for the images
 */
const preloadValidationImages = () => {
  let currentImagesSelected = [];

  $("#cards a").each((index, link) => {
    const image = new Image();
    image.src = link.id;
  });

  $("#cards a").click((evt) => {
    const link = evt.currentTarget;
    if (matchedImages.length != parseInt($("#num_cards").val(), 10) / 2) {
      if (!matchedImages.includes(link.id)) {
        $(link).fadeOut(500, function () {
          $(link).find("img").attr("src", link.id);
          $(link).fadeIn(500);
        });

        if (currentImagesSelected.length < 2) {
          currentImagesSelected.push(link);
        }

        if (currentImagesSelected.length == 2) {
          numberOfTries++;
          checkMatchingImages(currentImagesSelected);
        }
      }
    } else {
      console.log("Game finished");
    }

    evt.preventDefault();
  });
};

/**
 * Function that checks if the selected images match or not.
 */
const checkMatchingImages = (currentImagesSelected) => {
  console.log("Inicio currentImagesSelected: ", currentImagesSelected);
  if (currentImagesSelected[0].id == currentImagesSelected[1].id) {
    setTimeout(() => {
      $(currentImagesSelected[0]).slideUp(500, function () {
        $(currentImagesSelected[0]).find("img").attr("src", "images/blank.png");
        $(currentImagesSelected[0]).slideDown(500);
      });
      $(currentImagesSelected[1]).slideUp(500, function () {
        $(currentImagesSelected[1]).find("img").attr("src", "images/blank.png");
        $(currentImagesSelected[1]).slideDown(500, () => {
          matchedImages.push(currentImagesSelected[0].id);
          currentImagesSelected.length = 0;
          console.log("Fin currentImagesSelected: ", currentImagesSelected);
          updateGameStats();
        });
      });
    }, 1000);
  } else {
    setTimeout(() => {
      $(currentImagesSelected[0]).fadeOut(500, () => {
        $(currentImagesSelected[0]).find("img").attr("src", "images/back.png");
        $(currentImagesSelected[0]).fadeIn(500);
      });
      $(currentImagesSelected[1]).fadeOut(500, () => {
        $(currentImagesSelected[1]).find("img").attr("src", "images/back.png");
        $(currentImagesSelected[1]).fadeIn(500, () => {
          currentImagesSelected.length = 0;
          console.log("Fin currentImagesSelected: ", currentImagesSelected);
          updateGameStats();
        });
      });
    }, 2000);
  }
};

/**
 * Function that updates the game statistics after each turn.
 */
const updateGameStats = () => {
  const correctCount = matchedImages.length;
  const percentageCorrect = (correctCount / numberOfTries) * 100;
  $("#correct").text("Correct: " + correctCount);
  $("#try").text("Number Of try: " + numberOfTries);
  if (percentageCorrect > highScore) {
    highScore = percentageCorrect;
    $("#high_score").text("High Score: " + highScore.toFixed(2) + "%");
    localStorage.setItem("highScore", highScore.toFixed(2));
  }
  if (correctCount == parseInt($("#num_cards").val(), 10) / 2) {
    console.log("Game completed");
  }
};

/**
 * Function that saves the player name and number of cards in session storage.
 */
const saveSettings = () => {
  playerName = $("#player_name").val();
  sessionStorage.setItem("playerName", playerName);
  sessionStorage.setItem("numCards", $("#num_cards").val());
  location.reload();
};

/**
 * Function that initializes the game.
 */
const initializeGame = () => {
  $("#tabs-links a").click(tabClicked);

  playerName = sessionStorage.getItem("playerName");
  highScore = localStorage.getItem("highScore");
  let numCards = sessionStorage.getItem("numCards");

  if (playerName) {
    $("#player").text("Player: " + playerName);
  }

  if (highScore) {
    $("#high_score").text("High Score: " + highScore + "%");
  }

  if (numCards) {
    $("#num_cards").val(numCards);
  }

  loadImagesArray();
  loadCardsArray();
  createDivImageElements();
  preloadValidationImages();

  $("#save_settings").click(saveSettings);
};

/**
 * Function that starts a new game.
 */
const startNewGame = () => {
  matchedImages = [];
  numberOfTries = 0;
  $("#cards").empty();
  initializeGame();
};

$(document).ready(() => {
  initializeGame();

  $("#new_game a").click((evt) => {
    evt.preventDefault();
    startNewGame();
  });
});
