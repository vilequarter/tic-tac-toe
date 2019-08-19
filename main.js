var player = {
    wins : 0,
    losses: 0,
    draws: 0,
    isX: true    
}

var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var sessionGamesPlayed = 0;


function loadGame(){
    player.wins = parseInt(localStorage["wins"]);
    player.losses = parseInt(localStorage["losses"]);
    player.draws = parseInt(localStorage["draws"]);
    if(isNaN(player.wins)){
        player.wins = 0;
    }
    if(isNaN(player.losses)){
        player.losses = 0;
    }
    if(isNaN(player.draws)){
        player.draws = 0;
    }
    $("#wins").html(player.wins);
    $("#losses").html(player.losses);
    $("#draws").html(player.draws);
}

function saveGame(){
    localStorage["wins"] = player.wins;
    localStorage["losses"] = player.losses;
    localStorage["draws"] = player.draws;
}

function clearData(){
    localStorage.removeItem("wins");
    localStorage.removeItem("losses");
    localStorage.removeItem("draws");
    $("#wins").html(0);
    $("#losses").html(0);
    $("#draws").html(0);
    player.wins = 0;
    player.losses = 0;
    player.draws = 0;
}

function newGame(){
    clearBoard();
    $("#choosePlayer").removeClass("invisible");
}

function clearBoard(){
    //Object.keys(board).forEach(e => board[e] = 0);

    for(var i = 0; i < 9; i++){
        board[i] = 0;
    }

    $("#boardGrid img").attr('src','');
}

function checkForDraw(arr){
    for (var i = 0; i < 9; i++){
        if(arr[i] == 0){
            return false;
        }
    }
    return true;
}

function checkForWin(arr){
    var copy = [...arr];
    var twoD = convertTo2D(copy);

    for(var i = 0; i < 3; i++){
        var rowSum = 0;
        for(var j = 0; j < 3; j++){
            rowSum += twoD[i][j];
        }
        if(rowSum === 3)
            return 1;
        else if(rowSum === -3)
            return -1;
    }

    for(var i = 0; i < 3; i++){
        var colSum = 0;
        for(var j = 0; j < 3; j++){
            colSum += twoD[j][i];
        }
        if(colSum === 3)
            return 1;
        else if(colSum === -3)
            return -1;
    }

    if(twoD[0][0] + twoD[1][1] + twoD[2][2] === 3)
        return 1;
    else if(twoD[0][0] + twoD[1][1] + twoD[2][2] === -3)
        return -1;

    if(twoD[2][0] + twoD[1][1] + twoD[0][2] === 3)
        return 1;
    else if(twoD[2][0] + twoD[1][1] + twoD[0][2] === -3)
        return -1;

    return 0
}

function convertTo2D(arr){
    var newArr = new Array(3);
    for(var i = 0; i < 3; i++){
        newArr[i] = new Array(3);
    }

    var x = 0;
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            newArr[i][j] = arr[x];
            x++;
        }
    }
    return newArr;
}

function choosePlayerX(){
    player.isX = true;
}

function choosePlayerO(){
    player.isX = false;
}

function playerPlay(box){
    var boxid = $(box).attr("id");
    var i = parseInt(boxid[3]);

    if(board[i] != 0){
        return;
    }

    board[i] = -1;

    if(player.isX){
        $("#" + boxid + " img").attr("src", "images/playX-green.png")
    }
    else{
        $("#" + boxid + " img").attr("src", "images/playO-green.png")
    }

    if(!endGameCheck()){
        compPlay();
    }
}

function startGame(){
    $("#boardGrid button").click(function(){
        playerPlay(this);
    })
    if(!player.isX){
        compPlay();
    }
}

function compPlay(){
    var compImg;
    if(player.isX){
        compImg = "images/playO-green.png";
    }
    else{
        compImg = "images/playX-green.png";
    }

    var best = minimax(board);

    if(best != -1){
        board[best] = 1;
        $("#box" + best + " img").attr("src", compImg);
    }
    endGameCheck();
}

function minimax(arr) {
    var score = Number.NEGATIVE_INFINITY;
    var bestMove = -1;

    for(var i = 0; i < 9; i++){
        if(arr[i] == 0){
            var simulatedBoard = [...arr];
            simulatedBoard[i] = 1;

            const move = minVal(simulatedBoard);
            if(move > score){
                score = move;
                bestMove = i;
            }
        }
    }
    return bestMove;
  }

  function minVal(arr) {
    var winner = checkForWin(arr);
    if(winner == -1){
        return -1;
    }
    else if(winner == 1){
        return 1;
    }
    if(checkForDraw(arr)){
        return 0;
    }

    var score = Number.MAX_VALUE;
    for(var i = 0; i < 9; i++){
        if(arr[i] == 0){
            var simulatedBoard = [...arr];
            simulatedBoard[i] = -1;
            const move = maxVal(simulatedBoard);
            if(move < score){
                score = move;
            }
        }
    }
    return score;
  }

  function maxVal(arr) {
    var winner = checkForWin(arr);
    if(winner == 1){
        return 1;
    }
    else if(winner == -1){
        return -1;
    }
    if(checkForDraw(arr)){
        return 0;
    }

    var score = Number.NEGATIVE_INFINITY;
    for(var i = 0; i < 9; i++){
        if(arr[i] == 0){
            var simulatedBoard = [...arr];
            simulatedBoard[i] = 1;
            var move = minVal(simulatedBoard);
            if(move > score){
                score = move;
            }
        }
    }
    return score;
}

function endGameCheck(){
    var winState = checkForWin(board);

    if(winState != 0){ 
        clearClickEvents();
        if(winState == -1){
            player.wins++;
            $("#wins").html(player.wins);
        }
        else{
            player.losses++;
            $("#losses").html(player.losses);
        }
    }
    else if(checkForDraw(board)){ 
        clearClickEvents();
        player.draws++;
        $("#draws").html(player.draws);
    }
    else{ 
        return false;
    }
    sessionGamesPlayed++;
    if(sessionGamesPlayed >= 3 && $("#taunt").html() == ""){
        displayTaunt();
    }
    reddenWins();
    saveGame();
    return true;
}

function displayTaunt(){
    var text = "The only winning move is not to play";
    var speed = 100;
    var i = 0;

    function typewriter(){
        if(i < text.length){
            document.getElementById("taunt").innerHTML += text.charAt(i);
            i++;
            setTimeout(typewriter,speed);
        }
    }
    typewriter();
}

function clearClickEvents(){
    $("#boardGrid button").off("click");
}

$(document).ready(function(){
    loadGame();

    $("#newGame").click(newGame);
    $("#clearData").click(clearData);
    $("#startGame").click(startGame);

    $("input[type=radio][name=player]").change(function(){
        if(this.id == "playAsX"){
            choosePlayerX();
        }
        else if(this.id == "playAsO"){
            choosePlayerO();
        }
    })




})