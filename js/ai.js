var playing = false;
var steps = 10;
var gameManager;
var maxScore = 9001;
var script = 'Recursive';

//playAI();
function playAI() {
    playing = true;
    steps = parseInt(document.getElementById('steps').value) || 10;
    move(-1);
}

function pauseAI() {
    playing = false;
}

function changeScript() {
    script = document.getElementById('ai').value;
}

function clone(obj) {
    var obj = new GameModel(gameManager.size, gameManager.score, gameManager.grid.getCells());
    return obj;
}

function calcBestMove(model, move, stepsLeft, dont) {
    if(move !== -1) { model.move(move) } ;
    
    if(stepsLeft < 1) {
        return {score: ((!model.won) ? model.score : maxScore), move: move}
    }
    
    if(model.won) { return { score: maxScore, move: move }; }
    
    var winningMove = {score: model.score, move: 0};
    var curMove;
    for(var iter = 0; iter < 4; iter++) { //cycle through all moves
        if(iter !== dont) {
            curMove = calcBestMove(clone(model), iter, stepsLeft - 1, -1);
            if(curMove['score'] > winningMove['score']) {
                winningMove = {score: curMove.score, move: iter};
            }
        }
    }
    
    return winningMove;
}

function move(dont) {
    if(playing) {
        if(script === 'Recursive') {
            gameManager.move(calcBestMove(clone(gameManager), -1, steps, dont)['move']);
        } else if(script === 'Random') {
            gameManager.move(Math.floor(Math.random()*4));
        }
    }
}