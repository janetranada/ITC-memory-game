let disableCards = false;
let cardsOpened = [];
let wrongGuesses = 0;
let $mainContainer = $('#main-container');
let beerList = ["becks.png","bluemoon.png","budlight.png","budweiser.png","busch.png","chang.png","coors.png","corona.png","guinness.png","heineken.png","miller.png","paulaner.png","samuel.png","sanmiguel.png","stella.png","tiger.png"];
let reqdNumPhotos;
let gameLevel;
let gameTheme;
let randomIndex = []; //random index from 1-16
let randomPhotoList = []; //random beer images to be used in the game
let catList = []; 

/* ------------------------
Get cat image from server
---------------------------*/
function getCatImgs () {
    $.get({
        url: "http://aws.random.cat/meow",
        success: function(data) {
            catList.push(data.file);            
        },
    }) 
}

/* ---------------------------
Create array of 16 cat images
------------------------------*/
(function creatCatArray () {
    for (i = 0; i < 17; i++) {
        let cat = getCatImgs();
    }
})();


/* ------------------------
Create initial HTML layout
---------------------------*/
let chooseGameLevel = `<section id="gameLevel-wrapper">
                            <div id="gameLevel-container">
                                <div id="gameLevel-title" class="gameLevel-item">
                                        <h2>Welcome to the Game!!!</h2>
                                </div>
                                <form name="gameTheme-form" class="gameTheme-item"> 
                                    <select name="theme" id="userTheme" size ="1">
                                        <option id="placeholderCat" value="">--Please choose a theme--</option>
                                        <option id="beer" value="beer">Beer</option>
                                        <option id="cat" value="cat">Cat</option>
                                    </select>                                
                                </form>
                                <form name="gameLevel-form" class="gameLevel-item"> 
                                    <select name="level" id="userLevel" size ="1">
                                        <option id="placeholderBeer" value="">--Please choose a level--</option>
                                        <option id="easy" value="easy">EASY - 12 cards</option>
                                        <option id="medium" value="medium">MEDIUM - 18 cards</option>
                                        <option id="hard" value="hard">HARD - 24 cards</option>
                                    </select>                                
                                </form>
                                <button id="gameLevel-btn" type="button" class="btn btn-warning btn-lg gameLevel-item">start game</button>
                                <button id="see-scoreboard-btn" type="button" class="btn btn-dark btn-sm gameLevel-item">see score board</button>                           
                            </div>
                        </section>`

let infoContainer = `<section id="info-container" class="info-container">
                        <button id="newgame-btn" type="button" class="btn btn-warning btn-lg">new game</button>
                        <div class="logo-container">
                            <img src="" id="gameLogo" class="logo" alt="">    
                        </div>

                        <div class="wrong-guess-container">Wrong guesses:
                            <span id="wrongGuesses">0</span>
                        </div>
                    </section>`;

let scoreBoardModal = `<section id="scoreboard-wrapper">
                            <div id="scoreboard-container"> 
                                <h2>Top 3 Players</h2>            
                                <div id="scoreboard-data" class="score-item"></div> 
                                <div class="score-item">
                                    <button id="exit-btn" type="button" class="btn btn-warning btn-lg">exit</button>
                                </div> 
                            </div>
                        </section>`

$mainContainer.append(chooseGameLevel);
$mainContainer.append(infoContainer);
$mainContainer.append(scoreBoardModal);

/* --------------------------------
Check chosen level num photo req't
-----------------------------------*/
function levelPhotos (levelInput) {
    switch (levelInput) {
        case "easy":
            reqdNumPhotos = 6;
            break;
        case "medium":
            reqdNumPhotos = 9;
            break;
        case "hard":
            reqdNumPhotos = 12;
    }
}

/* --------------------------------
Get user's chosen theme & level
-----------------------------------*/
document.getElementById("gameLevel-btn").addEventListener('click', function() {
    let levelForm = document.getElementById("userLevel");
    let themeForm = document.getElementById("userTheme")
    let chosenLevel = levelForm.options[levelForm.selectedIndex].value;
    let chosenTheme = themeForm.options[themeForm.selectedIndex].value;
    if (chosenLevel !== "" && chosenTheme !== ""){
        levelPhotos(chosenLevel);        
        gameLevel = chosenLevel;
        gameTheme = chosenTheme;
        document.getElementById('gameLevel-wrapper').style.display = "none";
        createGame();
    }
});

/* ----------------------
See scoreboard
------------------------*/
let scoreBoardWrapper = document.getElementById('scoreboard-wrapper');
let scoreBoardText = document.getElementById('scoreboard-data');

document.getElementById('see-scoreboard-btn').addEventListener('click', function() {
    scoreBoardWrapper.style.display = "block";
    let jsonScoresList = JSON.parse(localStorage.getItem("highScores")) || [];

    if (jsonScoresList.length !== 0) {
        for (i=0; i < jsonScoresList.length; i++) {
            let topPlayerData = document.createElement('p');
            scoreBoardText.append(topPlayerData);
            topPlayerData.innerText = jsonScoresList[i].name + " : " + jsonScoresList[i].score;
        }
    } else {
        let noPlayerData = document.createElement('p');
        scoreBoardText.append(noPlayerData);
        noPlayerData.innerText = "** No data **";
    }
});

/* ----------------------
Exit scoreboard
------------------------*/
let exitScoreBoard = document.getElementById('exit-btn');
exitScoreBoard.addEventListener('click', function() {
    while (scoreBoardText.hasChildNodes()) {  
        scoreBoardText.removeChild(scoreBoardText.firstChild);
    };
    scoreBoardWrapper.style.display = "none";
});


/* --------------------------
Start Game (ends in line 421)
-----------------------------*/
function createGame() {
    /* --------------------------------
    Populate front face based on theme
    -----------------------------------*/ 
    function generatePhotoList(theme, randomIndex){
        switch(theme) {
            case "beer":
                randomPhotoList.push(beerList[randomIndex]);
                randomPhotoList.push(beerList[randomIndex]);
                break;
            case "cat":
                randomPhotoList.push(catList[randomIndex]);
                randomPhotoList.push(catList[randomIndex]);    
        }
    }

    /* ---------------------------
    Create logo based on theme
    ------------------------------*/
    (function () {
        let logoContainer = document.getElementById('gameLogo');
        switch(gameTheme) {
            case 'cat':
                logoContainer.src = "./images/png/whitecat.png";
                logoContainer.classList.add('cat');                  
                break;
            case 'beer' :
                logoContainer.src = "./images/png/brewery-logo.png";
                logoContainer.classList.add('brewery');         
        } 
    })();

    /* ---------------------------------
    Get random img to use from img array
    ------------------------------------*/
    while (randomIndex.length < reqdNumPhotos){
        let randIndex = Math.floor(Math.random() * 16);
        if (!randomIndex.includes(randIndex)){
            randomIndex.push(randIndex);
            generatePhotoList(gameTheme, randIndex);
        }
    }

    /* ----------------------
    Create other HTML layout
    -------------------------*/
    let $gameboard = $(`<div id="gameboard" class="gameboard">`);
    $gameboard.addClass(gameLevel);

    let youWonContainer = `<section id="you-won-wrapper">
                                <div id="you-won-container">
                                    <div id="you-won-title" class="yon-won-item">
                                        <h1>Well Done!!!</h1>
                                    </div>
                                    <div class="you-won-wrong-container" class="yon-won-item">Wrong guesses:
                                        <span id="you-won-wrongGuesses">0</span>
                                    </div>
                                    <div id="you-won-wrongGuesses" class="yon-won-item"></div>
                                    <button id="you-won-newgame-btn" type="button" class="btn btn-warning btn-lg you-won-item">new game</button>
                                    <button id="you-won-save-btn" type="button" class="btn btn-dark btn-lg you-won-item">save score</button>
                                </div>
                            </section>`
    
    let saveScore = `<section id="score-wrapper">
                        <div id="score-container">            
                            <div class="score-item">
                                <label>Your name: 
                                    <input id="username" type="text">
                                </label>                
                            </div>   
                            <div class="score-item">Your wrong guesses:
                                <span id="scoreboard-wrong"></span>
                            </div>  
                            <div class="score-item">
                                <button id="scoreboard-save-btn" type="button" class="btn btn-warning btn-lg">save my score</button>
                            </div> 
                        </div>
                    </section>`    
    
    $mainContainer.append($gameboard);
    $mainContainer.append(youWonContainer);
    $mainContainer.append(saveScore);

    for (let i = 0; i < (reqdNumPhotos * 2); i ++) {
        let $cardDiv = $('<div class="card unmatched"></div>').attr("id", "card" + (i+1));
        $cardDiv.addClass(gameLevel);
        $gameboard.append($cardDiv);
    }

   /* ------------------------------------------
    Create front face img based on chosen theme
    --------------------------------------------*/
    for (let i = 0; i < (reqdNumPhotos * 2); i++){
        let $parentCard = $(`#card${i+1}`);
        switch(gameTheme) {
            case "beer":
                let $cardImgBeer = $(`<img src="./images/png/beers/${randomPhotoList[i]}" alt="" class='front-face beerTheme ${gameLevel}'>
                                <img src="" alt="" class='back-face happyhour'></img>`);
                $parentCard.append($cardImgBeer);
                break;
            case "cat":
                let $cardImgCat = $(`<img src="${randomPhotoList[i]}" alt="" class='front-face catTheme ${gameLevel}'>
                                <img src="" alt="" class='back-face catPaw'></img>`)
                $parentCard.append($cardImgCat);
        }        
    }

    /* -------------------
    Add eventlisteners
    ----------------------*/
    let $cards = $('.unmatched');
    let cardsArray = [...$cards] //Convert HTML collection to nodelist using spread syntax
    cardsArray.forEach(card => card.addEventListener('click', flipCard));
    document.getElementById("newgame-btn").addEventListener('click', () => location.reload());
    document.getElementById("you-won-newgame-btn").addEventListener('click', () => location.reload());
    document.getElementById("you-won-save-btn").addEventListener('click', function() {
        document.getElementById('you-won-wrapper').style.display = "none";
        document.getElementById('score-wrapper').style.display = "block";
    })
   
    /* ---------------------
    Saving to local storage
    ------------------------*/
    const highscores = JSON.parse(localStorage.getItem("highScores")) || [];
    const nameInput = document.getElementById('username');
    let username = nameInput.value;
        
    nameInput.addEventListener("keyup", function() {
        username = nameInput.value;
    })

    document.getElementById("scoreboard-save-btn").addEventListener('click', function(){
        if (username !=="") {
            const scoreObj = {
                name: username,
                score: wrongGuesses,            
            }
            highscores.push(scoreObj);
            highscores.sort((a,b) => a.score - b.score);
            highscores.splice(3);
            localStorage.setItem("highScores", JSON.stringify(highscores));
            document.getElementById('score-wrapper').style.display = "none";
            location.reload();
        }
    })

    /* --------------------------------
    Shuffle cards (randomize position)
    -----------------------------------*/
    (function shuffleCards() {
        cardsArray.forEach(card => {
            let randomPosition = Math.floor(Math.random() * 12);
            card.style.order = randomPosition;
        })
    })();

    /* -----------------------------
    Flip selected cards
    - NOT if same card is clicked
    - NOT if 2 are already flipped
    --------------------------------*/
    function flipCard(){
        if (disableCards) return; 
        $(this).addClass('flip');
        let numCardsFlipped = flippedCardsCounter();
        twoCardsFlipped(numCardsFlipped);
    }

    /* -----------------------------
    Get the number of flipped cards
    --------------------------------*/
    function flippedCardsCounter() {
        let flippedCardsCount = document.getElementsByClassName('flip').length;
        return flippedCardsCount;
    }

    /* ----------------------------
    Check if 2 cards are flipped
    -------------------------------*/
    function twoCardsFlipped(numCardsFlipped) {
        if (numCardsFlipped === 2) {
            disableCards = true;  
            checkCardMatch();      
        }
    }

    /* -----------------------------------
    Remove click listener of matched cards
    --------------------------------------*/
    function disableClickListener (cardsToDisable) {
        for (let i = 0; i < cardsToDisable.length; i++){
            cardsToDisable[i].removeEventListener('click', flipCard);
        }
    }

    /* ----------------------------------------------------------------
    Edit classes of MATCHED cards
    - Matched: to stay flipped
    - Flip: card is flipped; used to identify cards for match checking
    - Unmatched: used to identify cards not yet matched
    -------------------------------------------------------------------*/
    function manageMatchClasses (cardsToDisable) {
        for (let i = 0; i < cardsToDisable.length; i++){
            cardsToDisable[i].classList.add('matched');
            cardsToDisable[i].classList.remove('flip', 'unmatched');
        }
    }

    /* ----------------------------------------------------------------
    Edit classes of UNMATCHED cards; 
    - Flip: card is flipped; used to identify cards for match checking
    Increase wrong guess counter;
    Make all cards clickable;
    -------------------------------------------------------------------*/
    function unflipCards (cardsToUnflip){
        setTimeout(function(){
            for (let i = 0; i < cardsToUnflip.length; i++){
                cardsToUnflip[i].classList.remove('flip');
            }
            wrongGuesses++;
            $('#wrongGuesses').html(wrongGuesses);
            disableCards = false;
        }, 1200)
    }

    /* -----------------------------------------------------------------
    Check if 2 flipped cards match
    - Matched: stay unflip; remove event listener; other cards clickable
    - Unmatched: unflip card; increase wrong guess counter
    Check if game is finished then enable pop-up
    --------------------------------------------------------------------*/
    function checkCardMatch (){
        let flippedCardsImg = [];
        let flippedCards = $(".card.flip");
        let flippedCardsToCheck = $(".card.flip>img.front-face");
        for(let i = 0; i < flippedCardsToCheck.length; i++) {
            flippedCardsImg.push(flippedCardsToCheck[i].src);
        }
        if (flippedCardsImg[0] === flippedCardsImg[1]) {
            disableClickListener(flippedCards);
            manageMatchClasses(flippedCards);  
            cardsOpened.push(flippedCardsImg[0]);
            cardsOpened.push(flippedCardsImg[1]);          
            disableCards = false;    
        } else {
            unflipCards(flippedCards);         
        }    
        gameFinModal();
    }

    /* --------------------------------------------
    Check if game is finished based on number
    of cards flipped (enable pop-up after 1.5 sec)
    -----------------------------------------------*/
    function gameFinModal () {
        let numCardsOpened = cardsOpened.length;
        if (numCardsOpened === (reqdNumPhotos * 2)) {        
            $('#you-won-wrongGuesses').html(wrongGuesses); 
            $('#scoreboard-wrong').html(wrongGuesses); 
            setTimeout(() => document.getElementById('you-won-wrapper').style.display = "block", 1500);
        }
    }
} //end of createPage function