var uNames = []
var pWords = []

var url="https://raw.githubusercontent.com/OliverTattersall/OliverTattersall.github.io/main/authdemo/logindata.json"
var jsondata;
//fetch -> returns a promise
//promise is an object that you can check before you do things
//then -> only run code when fetch is done

fetch(url)
    .then( (response) => response.json())
    .then((data)=>{
        console.log(data)
        for(i=0;i<data.length;i++){
            uNames.push(data[i]['id'])
            pWords.push(data[i]['password'])
        }
        console.log(uNames)
        jsondata=data
    })

function login(user, pword){
    let val=false
    for(i=0;i<uNames.length;i++){
        if(user === uNames[i]){
            if(pword === pWords[i]){
                val=true
            }
        }
    };
    console.log(val)
    $('.modal').modal('close');
    $("#login-email").val("");
    $("#login-password").val("");

    changepage(user)
    // return val
}

function register(user, pword){
    console.log(jsondata)
    jsondata.push({
        "id":user,
        "password":pword
    })
    console.log(jsondata)
    $('.modal').modal('close');
    $("#login-email").val("");
    $("#login-password").val("");
    changepage(user)
}


function changepage(user){
    document.getElementById("landing").style.display="none";
    document.getElementById("home").style.display="";

    document.getElementById("welcome").innerHTML="Welcome "+user
}