


const Game2048 = Object.create(null);

/**
 * A Board is an rectangular grid that tokens can be placed into one at a time.
 * Tokens fill up empty positions from the bottom of a column upwards.
 * It is implemented as an array of columns (rather than rows) of tokens
 * (or empty positions)
 * @memberof Game2048
 * @typedef {number[][]} Board
 */


Game2048.empty_board = function(width = 4, height = 4){
    return new Array(height).fill(new Array(width).fill(null))
}

const randbelow = function(n){
    return Math.floor(Math.random()*n) 
}

Game2048.start = function(table){
    var board0 = Game2048.empty_board()
    for(var i = 0; i < board0.length; i++){
        for(var j = 0; j < board0[0].length; j++){
            var grid = document.createElement('div')
            grid.className = "grid"
            grid.style = "top: " + (20 + 120 * i) + "px; left: " + (20 + 120 * j) + "px;"
            table.appendChild(grid)
        }
    }
}

Game2048.randgrid = function(board){
    var n = 0;
    var list = [[]];
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[0].length; j++){
            if(board[i][j] == null){
                list[n] = [i,j]
                n++
            }
        }
    }
    var q = randbelow(n)
    board[list[q][0],list[q][1]] = (randbelow(2) + 1) * 2
}

Game2048.display = function(board, table){
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[0].length; j++){
            if(board[i][j] != null){
                var number = document.createElement('number')
                number.className = "number"
                number.style = "top: " + (20 + 120 * i) + "px; left: " + (20 + 120 * j) + "px;"
                table.appendChild(number)
            }
        }
    }
}

Game2048.move_left = function(){
    
}

export default Object.freeze(Game2048);