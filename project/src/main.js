// Evan Laverdiere      Student ID 0860347

class Station{
    //To be filled in once more details are available.
    constructor(stationId, name){
        this.stationId = stationId;
        this.name = name;
    }
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
    event.preventDefault();
    console.log(event.target);
    let role = userRole.options[userRole.selectedIndex].value;

    console.log(role);

    if(role == "customer"){
        // do something
    }
    else if(role == "admin"){
        // do something else
    }
    else{
        alert("Role is a required field.");
    }
}

// let stationsList = fetch("http://10.101.0.12:8080/stations/");
// console.log(stationsList);
// console.log(stationsList.json());

async function getStations(){
    let response = await fetch("http://10.101.0.12:8080/stations/");
    let stations = await response.json();
    console.log(stations);
    return stations;
}

let stationsList = getStations();

async function fillDestinationLists(stationsList){
    // stationsList.forEach(station => {
    //     let stationOption = document.createElement("option");
    //     stationOption.setAttribute("value", station.Name);

    //     startDestination.appendChild(stationOption);
    //     endDestination.appendChild(stationOption);
    // });

    for (let index = 0; index < stationsList.length; index++) {
        const station = stationsList[index];
        let stationOption = document.createElement("option");
        stationOption.setAttribute("value", station.Name);

        startDestination.appendChild(stationOption);
        endDestination.appendChild(stationOption);

    }
}

fillDestinationLists(stationsList);