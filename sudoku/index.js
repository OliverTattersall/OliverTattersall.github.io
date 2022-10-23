// variables

const grid = [[8, 4, 9, 0, 0, 5, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 7, 9], [0, 0, 0, 1, 2, 0, 3, 0, 0], [0, 1, 4, 3, 5, 6, 0, 0, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 6, 8, 0, 0, 0, 0, 5], [4, 3, 1, 5, 7, 2, 9, 8, 6], [0, 7, 0, 0, 8, 1, 4, 0, 0], [9, 0, 0, 0, 0, 0, 7, 0, 2]]
const canvas = document.getElementById("sudoku board");
const ctx = canvas.getContext("2d");
const width = canvas.width;
canvas.style.height = width;
const height = canvas.height;


function drawboard(){
    ctx.moveTo(width/3, 0);
    ctx.lineTo(width/3, height);

    ctx.moveTo(2*width/3, 0);
    ctx.lineTo(2*width/3, height);

    ctx.moveTo(0, height/3);
    ctx.lineTo(width, height/3);

    ctx.moveTo(0, 2*height/3);
    ctx.lineTo(width, 2*height/3);
    ctx.stroke();

    ctx.strokeStyle = "#A0A0A0";
    for(let i=1;i<9;i++){
        ctx.moveTo(i*width/9, 0)
        ctx.lineTo(i*width/9, height)

        ctx.moveTo(0, i*height/9);
        ctx.lineTo(width, i*height/9);
    }
    ctx.stroke()
}



// -----------------------------------------------------------------------
//sudoku solving function


// checks if a number can be put in a specific slot
// sudoku is 9x9 2d list of numbers
function possible(sudoku, col, row, num){

    // checks if the number is in the row or column
    for(i=0;i<9;i++){
        if(sudoku[row][i]===num){
            return false
        }
        if(sudoku[i][col]===num){
            return false
        }
    }

    //checks if the number is the grid
    x0 = Math.floor(col/3)*3
    y0 = Math.floor(row/3)*3
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            if(sudoku[y0+i][x0+j]===num){
                return false
            }
        }
    }

    return true

}




// returns next open slot on the sudoku board, return -1, -1 if no empty slots
function open(sudoku) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (sudoku[i][j] === 0) 
                return [i, j];
        }
    }
    return [-1, -1];
}


// recursive function that solves the sudoku board
function solve(sudoku) {  
    let emptySpot = open(sudoku);
    let row = emptySpot[0];
    let col = emptySpot[1];

    // there is no more empty spots
    if (row === -1){
        return sudoku;
    }

    for(let num = 1; num<=9; num++){
        if (possible(sudoku,  col, row, num)){
            sudoku[row][col] = num;
            solve(sudoku);
        }
    }

    if (open(sudoku)[0] !== -1)
        sudoku[row][col] = 0;

    return sudoku;
}










function main(){
    drawboard()
}

main()