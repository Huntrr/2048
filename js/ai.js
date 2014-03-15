var playing = false;
var steps = 10;
var gameManager;
var maxScore = 9001;

function playAI() {
    playing = true;
    steps = parseInt(document.getElementById('steps').value) || 10;
    move();
}

function pauseAI() {
    playing = false;
}


function clone(obj) {
    var obj = new GameModel(gameManager.size, gameManager.score, gameManager.grid.getCells());
    return obj;
}

function calcBestMove(model, move, stepsLeft) {
    if(move !== -1) { model.move(move) } ;
    
    if(stepsLeft < 1) {
        return {score: ((!model.won) ? model.score : maxScore), move: move}
    }
    
    if(model.won) { return { score: maxScore, move: move }; }
    
    var winningMove = {score: model.score, move: 0};
    var curMove;
    for(var iter = 0; iter < 4; iter++) { //cycle through all moves
        curMove = calcBestMove(clone(model), iter, stepsLeft - 1);
        
        if(curMove['score'] > winningMove['score']) {
            winningMove = {score: curMove.score, move: iter};
        }
    }
    
    if(stepsLeft === steps) { alert(winningMove['move']) } ;
    return winningMove;
}

function move() {
    if(playing) {
        gameManager.move(Math.floor(Math.random()*4));
        //gameManager.move(calcBestMove(clone(gameManager), -1, steps)['move']);
    }
}