/* GLOBALS */
var playing = false;
var steps = 10;
var gameManager;
var maxScore = 100000;
var script = 'Recursive';
var wait = 200;

/* CORE */
function playAI() {
    playing = true;
    changeSteps();
    
    updateWait();
    changeScript();
    
    move(-1);
}

function pauseAI() {
    playing = false;
}

function changeScript() {
    script = document.getElementById('ai').value;
}

function changeSteps() {
    steps = parseInt(document.getElementById('steps').value) || 10;
}

function updateWait() {
    wait = parseInt(document.getElementById('wait').value) || 200;
}

/* MOVE */
function move(dont) {
    if(playing) {
        if(script === 'Recursive') {
            gameManager.move(calcBestMove(clone(gameManager), -1, steps, dont)['move']);
        } else if(script === 'Random') {
            gameManager.move(getRandomMove());
        } else if(script === 'Never Down') {
            gameManager.move(notDown());
        } else if(script === 'Degrading Recursion') {
            gameManager.move(calcBestMoveDegrade(clone(gameManager), -1, steps, dont)['move']);
        }
    }
}


/* ALGORITHMS */
//Degrading Recursion
function calcBestMoveDegrade(model, move, stepsLeft, dont) {
    var score = model.score;
    if(move !== -1) { model.move(move) } ;
    var modScore = model.score * (stepsLeft);
    if(move === 3) { return {score: model.score, move: move}; }
    
    
    if(model.score === score && stepsLeft !== steps) { 
        if(!model.couldMove) {
            return {score: model.score, move: move};
        }
    }
    
    if(move === 2) { model.score -= model.score / (steps - stepsLeft + 1); }
    
    if(model.lost()) {
        return {score: score, move: move};
    }
    
    if(stepsLeft < 1) {
        return {score: ((!model.won) ? model.score : maxScore), move: move}
    }
    
    if(model.won) { return { score: maxScore + stepsLeft, move: move }; }
    
    var winningMove = {score: model.score, move: -1};
    var curMove;
    for(var iter = 0; iter < 4; iter++) { //cycle through all moves
        if(iter !== dont) {
            curMove = calcBestMoveDegrade(clone(model), iter, stepsLeft - 1, -1);
            if(curMove['score'] > winningMove['score']) {
                winningMove = {score: curMove.score, move: iter};
            }
        }
    }
    
    if(winningMove['move'] === -1) {
        return {score: maxScore, move: getWeightedRandomMove()};
    }
    
    return winningMove;
}

//Recursive
function calcBestMove(model, move, stepsLeft, dont) {
    var score = model.score;
    if(move !== -1) { model.move(move) } ;
    if(move === 3) { return {score: model.score, move: move}; }
    
    
    if(model.score === score && stepsLeft !== steps) { 
        if(!model.couldMove) {
            return {score: model.score, move: move};
        }
    }
    
    if(move === 2) { model.score -= model.score / (steps - stepsLeft + 1); }
    
    if(model.lost()) {
        return {score: score, move: move};
    }
    
    if(stepsLeft < 1) {
        return {score: ((!model.won) ? model.score : maxScore), move: move}
    }
    
    if(model.won) { return { score: maxScore + stepsLeft, move: move }; }
    
    var winningMove = {score: model.score, move: -1};
    var curMove;
    for(var iter = 0; iter < 4; iter++) { //cycle through all moves
        if(iter !== dont) {
            curMove = calcBestMove(clone(model), iter, stepsLeft - 1, -1);
            if(curMove['score'] > winningMove['score']) {
                winningMove = {score: curMove.score, move: iter};
            }
        }
    }
    
    if(winningMove['move'] === -1) {
        return {score: maxScore, move: getWeightedRandomMove()};
    }
    
    return winningMove;
}

//Total randomness
function getRandomMove() {
    return Math.floor(Math.random()*4);
}

//Weighted random
function getWeightedRandomMove() {
    var rand = Math.floor(Math.random()*100);
    
    if(rand < 25) {
        return 0;
    }
    
    if(rand < 50) {
        return 1;
    }
    if(rand < 85 ) {
        return 2;
    }
    
    return 3;
}

//Anything but down
function notDown() {
    var moves = [];
    
    for(var i = 0; i < 3; i++) {
        if(canMove(gameManager, i)) {
            moves.push(i);
        }
    }
    if(contains(moves, 0) || contains(moves, 1) || contains(moves, 3)) {
        if(contains(moves, 0) && contains(moves, 1)) {
            return Math.floor(Math.random() * 2);
        } else if(contains(moves, 1)) {
            return 1;
        } else {
            return 3;
        }
    } else {
        return 2;
    }
}






/* HELPERS */
function clone(obj) {
    var obj = new GameModel(gameManager.size, gameManager.score, gameManager.grid.getCells());
    return obj;
}

function contains(array, val) {
    return array.indexOf(val) > -1;
}

function canMove(model, direction) {
    var gmodel = clone(model);
    
    gmodel.move(direction);
    return gmodel.couldMove;
}
