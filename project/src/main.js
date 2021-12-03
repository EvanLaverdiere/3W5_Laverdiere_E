// Evan Laverdiere      Student ID 0860347

class Station{
    //To be filled in once more details are available.
}

//#region Variables

let userRole = document.getElementById("userRole");
let startDestination = document.getElementById("startDestination");
let endDestination = document.getElementById("endDestination");
let startTime = document.getElementById("startTime");
let submitBtn = document.getElementById("submitBtn");

console.log(userRole);
console.log(startDestination);
console.log(endDestination);
console.log(startTime);
console.log(submitBtn);

//#endregion

submitBtn.addEventListener("click", planTrip);

function planTrip(){
    console.log(event.target);
}