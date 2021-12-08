// Evan Laverdiere      Student ID 0860347

class Station{
    //To be filled in once more details are available.
    constructor(stationId, name){
        this.stationId = stationId;
        this.name = name;
    }
}

//#region Variables

// let userRole = document.getElementById("userRole");
let startDestination = document.getElementById("startDestination");
let endDestination = document.getElementById("endDestination");
let startTime = document.getElementById("startTime");
let submitBtn = document.getElementById("submitBtn");

// console.log(userRole);
console.log(startDestination);
console.log(endDestination);
console.log(startTime);
console.log(submitBtn);

//#endregion

submitBtn.addEventListener("click", planTrip);

async function planTrip(){
    event.preventDefault();
    console.log(event.target);
    if(validateForm()){
        // let role = userRole.options[userRole.selectedIndex].value;
        let startStation = startDestination.options[startDestination.selectedIndex].value;
        let endStation = endDestination.options[endDestination.selectedIndex].value;

        // console.log("user role: " + role);
        console.log("Starting station: " + startStation);
        console.log("Ending station: " + endStation);
    
        // if(role == "customer"){
        //     // do something
        // }
        // else if(role == "admin"){
        //     // do something else
        // }

        let tripPath = await getPath(startStation, endStation);
        displayPath(tripPath);
    
    }
    else{
        alert("You are missing required fields.");
    }
}

// let stationsList = fetch("http://10.101.0.12:8080/stations/");
// console.log(stationsList);
// console.log(stationsList.json());

async function getStations(){
    let response = await fetch("http://10.101.0.12:8080/stations/");
    let stations = await response.json();
    console.log(stations);

    await fillDestinationLists(stations);

    return stations;
}

// let stationsList = getStations();

async function fillDestinationLists(stationsList){
    // stationsList.forEach(station => {
    //     let stationOption = document.createElement("option");
    //     stationOption.setAttribute("value", station.Name);

    //     startDestination.appendChild(stationOption);
    //     endDestination.appendChild(stationOption);
    // });

    // let stationsList = await getStations();

    for (let index = 0; index < stationsList.length; index++) {
        const station = stationsList[index];
        let stationOption = document.createElement("option");
        stationOption.setAttribute("value", station.Name);
        stationOption.innerHTML = station.Name;

        let startOption = stationOption;
        let endOption = stationOption.cloneNode(true);

        startDestination.add(startOption);
        endDestination.add(endOption);

        // console.log(stationOption);

    }
}
let stationsList = getStations();
// fillDestinationLists(stationsList);

function validateForm(){
    // let roleInput = userRole.options[userRole.selectedIndex].value;
    let startInput = startDestination.options[startDestination.selectedIndex].value;
    let endInput = endDestination.options[endDestination.selectedIndex].value;

    if(startInput != "" && endInput != ""){
        return true;
    }
    else{
        return false;
    }
}

async function getPath(start, end){
    let response = await fetch("http://10.101.0.12:8080/path/" + start + "/" + end);
    let path = await response.json();
    console.log(path);
    return path;
}

function displayPath(path){
    let pathSection = document.createElement("section");
    let psHeader = document.createElement("h2");
    psHeader.innerHTML = "Your Route:";
    pathSection.appendChild(psHeader);
    
    let pathTable = document.createElement("table");
    let ptHeader = document.createElement("tr");
    let timeHeader = document.createElement("th");
    let stationHeader = document.createElement("th");

    timeHeader.innerHTML = "Departure/Arrival Time";
    stationHeader.innerHTML = "Station";
    ptHeader.appendChild(timeHeader);
    ptHeader.appendChild(stationHeader);


    pathTable.appendChild(ptHeader);

    // fillRows(ptHeader, path);


    pathSection.appendChild(pathTable);
    document.body.appendChild(pathSection);

}