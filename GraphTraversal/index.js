// variables
//how many nodes horizontally
const lengthx=25
//how many nodes vertically
const lengthy=20

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const canvasData = canvas.getBoundingClientRect()

var sidelength = 450
const boxlength = 25
canvas.style.height = lengthy*boxlength;
canvas.style.width = lengthx*boxlength;
const height = lengthy*boxlength;
const width = lengthx*boxlength;
const relativeWidth = 300;
const relativeHeight = 150;
var currentbox = null;
const bufferx = canvasData.x
const buffery = canvasData.y



class Node{
    constructor(x, y, weight, edges, start=false, goal=false ){
        this.x=x
        this.y=y
        this.weight=weight
        this.edges=edges
        this.start=start
        this.goal=false
    }
}


var graph =[]


for(y=0;y<lengthy;y++){
    row=[]
    for(x=0; x<lengthx; x++){
        edges=[]
        if(x!=0){
            edges.push([-1,0])
        }if(x!=lengthx-1){
            edges.push([1,0])
        }if(y!=0){
            edges.push([0,-1])
        }if(y!=lengthy-1){
            edges.push([0,1])
        }
        row.push(new Node(x*boxlength,y*boxlength, Math.ceil(Math.random() * 5), edges))
    }
    graph.push(row)
}

graph[Math.floor(Math.random() * lengthy)][Math.floor(Math.random() * lengthx)]

console.log(graph)



function drawlines(){


    ctx.beginPath()
    ctx.strokeStyle = "#00BFFF";


    ctx.beginPath()
    ctx.lineWidth = 0.5;
    // ctx.strokeStyle = "#A0A0A0";
    for(let x=1;x<lengthx;x++){
        ctx.moveTo(x*relativeWidth/lengthx, 0)
        ctx.lineTo(x*relativeWidth/lengthx, relativeHeight)

    }

    for(let y=1;y<lengthy;y++){
        ctx.moveTo(0, y*relativeHeight/lengthy);
        ctx.lineTo(relativeWidth, y*relativeHeight/lengthy);
        
    }

    ctx.stroke()
    ctx.closePath();
}

function fillNodes(){
    colors={
        1:"#0f1cd1", // blue
        2:"#7906b8", // purple
        3:"#b8062a", // red
        4:"#FAEBD7", // yellow
        5:"#03a323"  // green

    }

    for(y=0;y<lengthy;y++){
        for(x=0; x<lengthx; x++){
            item = graph[y][x]
            console.log(item.x, item.y)
            // ctx.fillStyle = colors[item.weight.toString()]
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(item.x*relativeWidth/width, item.y*relativeHeight/height, boxlength*relativeWidth/width, (boxlength+2)*relativeHeight/height)

        }

    }
}






function main(){
    fillNodes()
    drawlines()
    
}


main()



document.getElementById("graph").addEventListener("click", (event)=>{
    x = event.clientX-bufferx
    y = event.clientY-buffery
    console.log(x,y)
})