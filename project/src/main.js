// Evan Laverdiere      Student ID 0860347

class Station{
    //To be filled in once more details are available.
    constructor(stationId, name){
        this.stationId = stationId;
        this.name = name;
    }
}

//#region Variables

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

// Function to asynchronously plan out a REM trip between two specified stations.
async function planTrip(){
    event.preventDefault();
    console.log(event.target);
    if(validateForm()){ // Calls a boolean function to validate the user's input on the submission form.
        // If it returns true, function logs user's inputs for start destination, end destination, and departure time.
        let startStation = startDestination.options[startDestination.selectedIndex].value;
        let endStation = endDestination.options[endDestination.selectedIndex].value;
        let desiredTime = startTime.value;

        console.log("Starting station: " + startStation);
        console.log("Ending station: " + endStation);
        console.log("Departing at: " + desiredTime);

        let departureTime = await getDeparture(startStation, desiredTime);
        console.log(departureTime);
        // console.log("Type of Time property is " + typeof(departureTime[0].Time));   // These two lines show that both properties are registering as strings rather than any sort of date.
        console.log("Type of desiredTime is " + typeof(desiredTime));
    
        let tripPath = await getPath(startStation, endStation); // Start and end destinations are then passed to async function which generates a promise representing the path between these destinations.
        displayPath(tripPath, departureTime); // Function then calls a function to display details of the trip's path.
    
    }
    else{
        alert("You are missing required fields.");  // If validateForm() returns false, the user left at least one field of the form unfilled.
    }
}


// Function which returns a promise representing an array of all stations on the REM network.
// Function is called on page load.
async function getStations(){
    let response = await fetch("http://10.101.0.12:8080/stations/");    // Function gets the Response from this API made by Helen.
    let stations = await response.json();   // The Response object is then parsed as JSON.
    console.log(stations);  // The result is logged for posterity...

    await fillDestinationLists(stations);   // ...and passed to an asynchronous function which fills the destination dropdown lists in the form.

    return stations;    // The parsed promise is finally returned to the caller.
}

// let stationsList = getStations();

// Function which fills the HTML form's destination lists with names from an array of stations.
async function fillDestinationLists(stationsList){

    // Function does the following for each element in the array:
    for (let index = 0; index < stationsList.length; index++) {
        const station = stationsList[index];
        let stationOption = document.createElement("option");   // Creates an <option> element with a value and inner HTML matching the current station's name.
        stationOption.setAttribute("value", station.Name);
        stationOption.innerHTML = station.Name;

        let startOption = stationOption;    // Clones that <option> into a new, identical <option> element.
        let endOption = stationOption.cloneNode(true);

        startDestination.add(startOption);  // The original object is added to one drop-down menu, and its clone is added to the other.
        endDestination.add(endOption);

        // console.log(stationOption);

    }
}
let stationsList = getStations();
// fillDestinationLists(stationsList);

// Function which validates the user's input on the HTML form. Returns true if all fields are filled, or false otherwise.
function validateForm(){
    let startInput = startDestination.options[startDestination.selectedIndex].value;
    let endInput = endDestination.options[endDestination.selectedIndex].value;
    let timeInput = startTime.value;

    if(startInput != "" && endInput != "" && timeInput != ""){
        return true;    // Function returns true as long as all three fields of the form have a non-empty value.
    }
    else{
        return false;
    }
}

// Function which returns a promise representing the path between two stations on the REM network.
// start is a string representing name of the starting station.
// end is a string representing name of the end station.
async function getPath(start, end){
    let response = await fetch("http://10.101.0.12:8080/path/" + start + "/" + end);    // Fetches a response from this API, passing start and end as part of the URL.
    let path = await response.json();   // Parses the Response object as JSON.
    console.log(path);  // Logs the resulting array for posterity.
    return path;
}

function displayPath(path, departureTime){
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

    fillRows(pathTable, path, departureTime);


    pathSection.appendChild(pathTable);
    document.body.appendChild(pathSection);

}

async function fillRows(table, path, departureTime){
    // path.forEach((stop, index) => {
    //     console.log("Current index: " + index);
    //     let lastStop = null;
    //     if(index >= 1){
    //         lastStop = path[index - 1];
    //         console.log("Last station was " + lastStop.Name + " on segment " + lastStop.SegmentId);

    //     }
    //     if(lastStop == null || stop.Name != lastStop.Name){
    //         let row = document.createElement("tr");
    //         let timeCol = document.createElement("td");
    //         let nameCol = document.createElement("td");
    
    //         if(index == 0 || stop.SegmentId != lastStop.SegmentId){
    //             timeCol.innerHTML = departureTime.getHours() + ":" + departureTime.getMinutes();
    //         }
    //         else{
    //             timeCol.innerHTML = "To be filled";
    //         }
    //         nameCol.innerHTML = stop.Name;
    
    //         row.appendChild(timeCol);
    //         row.appendChild(nameCol);
    
    //         table.appendChild(row);        
    //     }
    //     else{
    //         console.log("Changing segments.");
    //     }

    // });

    for (let index = 0; index < path.length; index++) {
        const stop = path[index];
        
        console.log("Current index: " + index);
        let lastStop = null;
        if(index >= 1){
            lastStop = path[index - 1];
            console.log("Last station was " + lastStop.Name + " on segment " + lastStop.SegmentId);

        }
        if(lastStop == null || stop.Name != lastStop.Name){
            let row = document.createElement("tr");
            let timeCol = document.createElement("td");
            let nameCol = document.createElement("td");
    
            if(index == 0 || stop.SegmentId != lastStop.SegmentId){
                timeCol.innerHTML = departureTime.getHours() + ":" + departureTime.getMinutes();
            }
            else{
                let speedPromise = await fetch("http://10.101.0.12:8080/averageTrainSpeed");
                let speeds = await speedPromise.json();
                console.log(speeds);
                let avgSpeed = speeds[0].AverageSpeed;
                let distancePromise = await fetch("http://10.101.0.12:8080/distance/" + stop.Name + "/" + lastStop.Name);
                let distance = await distancePromise.json();

                console.log("Average speed is " + avgSpeed + " km/hr.");
                console.log("Distance between " + stop.Name + " and " + lastStop.Name + " is " + distance + "km.");

                let travelTime = GetTravelTime(distance, avgSpeed);
                console.log("Travel time between " + stop.Name + " and " + lastStop.Name + " is " + travelTime);

                timeCol.innerHTML = "To be filled";
            }
            nameCol.innerHTML = stop.Name;
    
            row.appendChild(timeCol);
            row.appendChild(nameCol);
    
            table.appendChild(row);        
        }
        else{
            console.log("Changing segments.");
        }
    }
}

async function getDeparture(startStation, desiredTime){
    let response = await fetch("http://10.101.0.12:8080/schedule/" + startStation);
    let schedules = await response.json();

    // let upcomingSchedules = schedules.filter(schedule => schedule.Time.getHours() >= desiredTime.getHours());

    // console.log(upcomingSchedules);
    let times = schedules.map(schedule => schedule.Time);
    console.log(times);

    let desiredDeparture = new Date(desiredTime);
    let desiredHour = desiredDeparture.getHours();
    let desiredMinutes = desiredDeparture.getMinutes();
    console.log("Desired departure time: " + desiredDeparture);
    console.log("At the hour of " + desiredHour);
    console.log("and " + desiredMinutes);

    let startTime = null;

    for(let i = 0; i < schedules.length; i++){
        let time = new Date(schedules[i].Time); // converts the schedule's Time property from a string to an actual date.
        console.log(time);
        let hour = time.getHours();
        let minute = time.getMinutes();
        if(hour > desiredHour || (hour == desiredHour && minute >= desiredMinutes)){
            // do something and break out of loop. We want first time that is >= the user's desired time.
            console.log("FOUND IT! Best time is " + time);
            startTime = time;
            break;
        }
    }

    console.log("Your starting time is: " + startTime);
    return startTime;




}

function GetTravelTime(distance, speed){
    // time = distance/speed
    let travelTime = distance / speed;

    return travelTime;
}