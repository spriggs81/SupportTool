var moment = require("moment");


var date3 = moment();

function hideThis(num){
        switch(num){
            case 1: document.querySelector("#inProduction").classList.remove("bye"); document.querySelector("#inTesting").classList.add("bye"); document.querySelector("#inactive").classList.add("bye");
            break;
            
            case 2: document.querySelector("#inTesting").classList.remove("bye"); document.querySelector("#inProduction").classList.add("bye"); document.querySelector("#inactive").classList.add("bye");
            break;
            
            case 3: document.querySelector("#appServers").classList.remove("bye"); document.querySelector("#dbServers").classList.add("bye"); document.querySelector("#inactServers").classList.add("bye"); 
            break;
           
            case 4: document.querySelector("#dbServers").classList.remove("bye"); document.querySelector("#appServers").classList.add("bye"); document.querySelector("#inactServers").classList.add("bye"); 
            break;
            
            case 5: document.querySelector("#inactive").classList.remove("bye"); document.querySelector("#inProduction").classList.add("bye"); document.querySelector("#inTesting").classList.add("bye");
            break;
           
            case 6: document.querySelector("#inactServers").classList.remove("bye"); document.querySelector("#dbServers").classList.add("bye"); document.querySelector("#appServers").classList.add("bye");
            break;
            
            default: console.log("There was an error in the Switch Statement");
        }
        
    }
    
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var p = checkAmPm(h);
    h = checkHour(h);
    m = checkTime(m);
    s = checkTime(s);

    document.getElementById('myTime').innerHTML = "Current Time:  " + h + ":" + m + ":" + s + " " + p;
    var t = setTimeout(startTime, 500);
}

function checkTime(i){
    if(i < 10) {
    i = "0" + i
    }
    //add zero in front of numbers
    return i;
}

function checkHour(g){
    g = Number(g);
    if(g > 13){
        g = g - 12;
        return g;
    } else if(g === 0) {
        g = 12;
        return g;
    } else {
        return g;
    }
}

function checkAmPm(h) {
    if(h < 13) {
        var p = "AM";
    } else {
        p = "PM";
    }
    return p;
    
}