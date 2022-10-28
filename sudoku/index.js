// variables

const grid = [[8, 4, 9, 0, 0, 5, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 7, 9], [0, 0, 0, 1, 2, 0, 3, 0, 0], [0, 1, 4, 3, 5, 6, 0, 0, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 6, 8, 0, 0, 0, 0, 5], [4, 3, 1, 5, 7, 2, 9, 8, 6], [0, 7, 0, 0, 8, 1, 4, 0, 0], [9, 0, 0, 0, 0, 0, 7, 0, 2]]
const canvas = document.getElementById("sudoku board");
const ctx = canvas.getContext("2d");
const canvasData = canvas.getBoundingClientRect()
var sidelength = 450
canvas.style.height = sidelength;
canvas.style.width = sidelength;
const height = sidelength;
const width = sidelength;
const relativeWidth = 300;
const relativeHeight = 150;
var currentbox = null;
const bufferx = canvasData.x
const buffery = canvasData.y

var sudokuGrid = []
for(i=0;i<9;i++){
    sudokuGrid.push([0,0,0,0,0,0,0,0,0])
}




// ------------------------------------------------
// canvas functions
function clearboard(){
    ctx.fillStyle = "#FAEBD7";
    ctx.fillRect(0,0,1000,1000);
    ctx.fillStyle = '#000000'
}


function drawlines(){


    ctx.beginPath()
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.moveTo(relativeWidth/3, 0);
    ctx.lineTo(relativeWidth/3, relativeHeight);

    ctx.moveTo(2*relativeWidth/3, 0);
    ctx.lineTo(2*relativeWidth/3, relativeHeight);

    ctx.moveTo(0, relativeHeight/3);
    ctx.lineTo(relativeWidth, relativeHeight/3);

    ctx.moveTo(0, 2*relativeHeight/3);
    ctx.lineTo(relativeWidth, 2*relativeHeight/3);
    
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath()
    ctx.lineWidth = 1;
    // ctx.strokeStyle = "#A0A0A0";
    for(let i=1;i<9;i++){
        if(i%3!=0){
            ctx.moveTo(i*relativeWidth/9, 0)
            ctx.lineTo(i*relativeWidth/9, relativeHeight)
    
            ctx.moveTo(0, i*relativeHeight/9);
            ctx.lineTo(relativeWidth, i*relativeHeight/9);
        }

    }
    ctx.stroke()
    ctx.closePath();
}


function editBoard(sudokuGrid){
    // drawboard()
    ctx.fillStyle = '#000000'
    ctx.font = "13px Arial";
    for(i=0;i<9;i++){
        for(j=1; j<10;j++){
            if(sudokuGrid[i][j-1]!=0){
                ctx.fillText(sudokuGrid[i][j-1], i*relativeWidth/9+10, j*relativeHeight/9-3)
            }
        }
    }

}

function highlightarea(posx, posy){
    let bigsquare = [Math.floor(posx/3)*relativeWidth/3, Math.floor(posy/3)*relativeHeight/3]
    // console.log(bigsquare)
    ctx.fillStyle = '#ADD8E6'
    ctx.fillRect(bigsquare[0], bigsquare[1], 100, 50)
    // ctx.stroke()

    ctx.fillRect(posx*relativeWidth/9, 0, relativeWidth/9, relativeHeight)
    ctx.fillRect(0, posy*relativeHeight/9, relativeWidth, relativeHeight/9)

    ctx.fillStyle= '#5272f2'
    ctx.fillRect(posx*relativeWidth/9, posy*relativeHeight/9, relativeWidth/9, relativeHeight/9)

}



// -----------------------------------------------------------------------
//sudoku functions


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


function validSolution(sudokuGrid){

    for(i=0;i<9;i++){
        testSetrow = new Set()
        testSetcol = new Set()
        for(j=0;j<9;j++){
            if(sudokuGrid[i][j]!=0){
                testSetrow.add(sudokuGrid[i][j])
            }else{
                return "Seems it isn't filled out"
            }
            if(sudokuGrid[j][i]!=0){
                testSetcol.add(sudokuGrid[j][i])
            }else{
                return "Seems it isn't filled out"
            }
            
        }

        if(testSetrow.size!=9 || testSetcol.size!=9){
            return "Seems it isn't quite right"
        }

    }

    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            x0 = Math.floor(j/3)*3
            y0 = Math.floor(i/3)*3
            testBox = new Set()
            for(k=0;k<3;k++){
                for(l=0;l<3;l++){
                    if(sudokuGrid[y0+k][x0+l]!=0){
                        testBox.add(sudokuGrid[y0+k][x0+l])
                    }else{
                        return "Seems it isn't filled out"
                    }

                }
            }
            if(testBox.size!=9){
                return "Seems it isn't quite right"            }
        }
    }

    return "Well done!"

}

function checkSolution(){
    x = validSolution(sudokuGrid)
    alert(x)
}

function fillSolution(){
    clearboard(); 
    drawlines(); 
    solve(sudokuGrid); 
    editBoard(sudokuGrid); 

}


function getSudoku(diff){
    

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9ccc3c7238mshf5892d50c1b6370p1a801ejsn94e2e64506e7',
            'X-RapidAPI-Host': 'sudoku-board.p.rapidapi.com'
        }
    };
    
    fetch('https://sudoku-board.p.rapidapi.com/new-board?diff='+diff+'&stype=list&solu=true', options)

        .then(response => response.json())
        .then(response => {
            // console.log(response)
            let resp = response.response
            // console.log(resp)
            clearboard()
            drawlines()
            sudokuGrid = resp['unsolved-sudoku']
            // console.log(sudokuGrid)
            editBoard(sudokuGrid)

        })
        .catch(err => console.error(err));
}




// -----------------------------------------------------------------------------------------------

function main(){
    clearboard()
    drawlines()
    editBoard(sudokuGrid)
}

main()


document.getElementById("sudoku board").addEventListener("click", (event)=>{
    clearboard()
    
    let boxx = Math.floor((event.clientX-bufferx)/(width/9))
    let boxy = Math.floor((event.clientY-buffery)/(height/9))
    currentbox = [boxx, boxy]
    // console.log(event.clientX, event.clientY)
    highlightarea(boxx, boxy)
    drawlines()
    editBoard(sudokuGrid)
})



window.addEventListener('keydown', (e) => {

    if (49<= e.keyCode && e.keyCode<=57){
        if(currentbox!=null){
            sudokuGrid[currentbox[0]][currentbox[1]]=e.keyCode-48
            clearboard()
            drawlines()
            editBoard(sudokuGrid)
        }
        // console.log("all good")
    }
    if(e.keyCode==8){
        if(currentbox!=null){
            sudokuGrid[currentbox[0]][currentbox[1]]=0
            clearboard()
            drawlines()
            editBoard(sudokuGrid)
        }
    }

    // console.log(e.keyCode)

 });


