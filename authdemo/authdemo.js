var uNames = ["user1","user2","user3"]
var pWords = ["pword1","pword2","pword3"]

function login(user, pword){
    let val=false
    for(i=0;i<uNames.length;i++){
        if(user === uNames[i]){
            if(pword === pWords[i]){
                val=true
            }
        }
    };
    return val
}