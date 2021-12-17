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
let routeSection = document.getElementById("routeSection");

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

        // let departureTime = await getDeparture(startStation, desiredTime);
        // console.log(departureTime);
        // // console.log("Type of Time property is " + typeof(departureTime[0].Time));   // These two lines show that both properties are registering as strings rather than any sort of date.
        // console.log("Type of desiredTime is " + typeof(desiredTime));
    
        try {
            let tripPath = await getPath(startStation, endStation); // Start and end destinations are then passed to async function which generates a promise representing the path between these destinations.
            await displayPath(tripPath, desiredTime); // Function then calls a function to display details of the trip's path.                
        } catch (error) {
            alert(error);
        }
    
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

async function displayPath(path, departureTime){
    let pathSection = document.createElement("section");
    let psHeader = document.createElement("h2");
    psHeader.innerHTML = "Your Route:";
    pathSection.appendChild(psHeader);
    
    let pathTable = document.createElement("table");
    let ptBody = document.createElement("tbody");
    let ptHeader = document.createElement("tr");
    let timeHeader = document.createElement("th");
    let stationHeader = document.createElement("th");
    let directionHeader = document.createElement("th");
    let extraHeader = document.createElement("th");
    let notifHeader = document.createElement("th");

    timeHeader.innerHTML = "Departure/Arrival Time";
    stationHeader.innerHTML = "Station";
    directionHeader.innerHTML = "Direction";
    extraHeader.innerHTML = "Information";
    notifHeader.innerHTML = "Notifications";
    ptHeader.appendChild(timeHeader);
    ptHeader.appendChild(stationHeader);
    ptHeader.appendChild(directionHeader);
    ptHeader.appendChild(extraHeader);
    ptHeader.appendChild(notifHeader);


    pathTable.appendChild(ptHeader);

    await fillRows(ptBody, path, departureTime);        


    pathTable.appendChild(ptBody);
    pathSection.appendChild(pathTable);
    document.body.appendChild(pathSection);
}

async function fillRows(tBody, path, departureTime){
    // let estimatedArrivalTime = new Date(departureTime.getTime());
    // let desiredTime = new Date(departureTime);
    let estimatedArrivalTime = new Date(departureTime);

    let lastSegment = null;

    for (let index = 0; index < path.length; index++) {
        const stop = path[index];
        
        console.log("Current index: " + index);
        let lastStop = null;
        if(index >= 1){
            lastStop = path[index - 1];
            console.log("Last station was " + lastStop.Name + " on segment " + lastStop.SegmentId);

        }
        let row = document.createElement("tr");
        let timeCol = document.createElement("td");
        let nameCol = document.createElement("td");
        let dirCol = document.createElement("td");
        let extraCol = document.createElement("td");
        let notifCol = document.createElement("td");

        if(index == 0 || (lastSegment != null && stop.SegmentId != lastSegment)){ // found a bug. Second condition never triggers because of how lastStop is being set.
            // do something with revised getDepartureTime() method
            if(lastSegment != null && stop.SegmentId != lastSegment){
                console.log("Changing segments. Last segment was " + lastSegment + "; current segment is " + stop.SegmentId + ".");
            }
            estimatedArrivalTime = await getDepartureTime(stop.Name, stop.SegmentId, estimatedArrivalTime);
            timeCol.innerHTML = estimatedArrivalTime.getHours() + ":" + (estimatedArrivalTime.getMinutes() < 10 ? "0" + estimatedArrivalTime.getMinutes() : estimatedArrivalTime.getMinutes());
        }
        else{
            let avgSpeed = await getAvgSpeed();
            let distance = await getDistance(lastStop, stop);

            console.log("Average speed is " + avgSpeed + " km/hr.");
            console.log("Distance between " + stop.Name + " and " + lastStop.Name + " is " + distance + "km.");

            let travelTime = GetTravelTime(distance, avgSpeed);
            console.log("Travel time between " + stop.Name + " and " + lastStop.Name + " is " + travelTime + " milliseconds");

            let realTravelTime = new Date(travelTime);
            console.log("Real travel time: " + realTravelTime);

            estimatedArrivalTime.setTime(estimatedArrivalTime.getTime() + realTravelTime.getTime());

            console.log("Estimated arrival time: " + estimatedArrivalTime);

            timeCol.innerHTML = estimatedArrivalTime.getHours() + ":" + (estimatedArrivalTime.getMinutes() < 10 ? "0" + estimatedArrivalTime.getMinutes() : estimatedArrivalTime.getMinutes());
        }
        nameCol.innerHTML = stop.Name;
        dirCol.innerHTML = stop.SegmentName;

        let infoButton = getInfoButton(stop.StationId);

        extraCol.appendChild(infoButton);

        infoButton.addEventListener("click", getExtraInfo);

        notifCol.innerHTML = await getNotifications(stop.StationId);

        row.appendChild(timeCol);
        row.appendChild(nameCol);
        row.appendChild(dirCol);
        row.appendChild(extraCol);
        row.appendChild(notifCol);

        if(index % 2 == 0){
            row.setAttribute("class", "evenRow");
        }
        else{
            row.setAttribute("class", "oddRow");
        }

        tBody.appendChild(row);        

        lastSegment = stop.SegmentId;


    }
}

// Revised version of above.
async function getDepartureTime(startStation, stationSegment, desiredTime){
    let response = await fetch("http://10.101.0.12:8080/schedule/" + startStation); // Retrieves an array of all schedules for this station, on all segments.
    let allSchedules = await response.json();

    let schedules = allSchedules.filter(schedule => schedule.SegmentId == stationSegment);  // filters the array to only include schedules matching the specified segment.

    let times = schedules.map(schedule => schedule.Time);   // Separate array consisting of just the Time properties for each schedule.
    console.log(times);

    // Function extracts the hours & minutes of the desired time and logs them for the user's benefit.
    let desiredHour = desiredTime.getHours();
    let desiredMinutes = desiredTime.getMinutes();
    console.log("Desired departure time: " + desiredTime);
    console.log("At the hour of " + desiredHour);
    console.log("and " + desiredMinutes);

    let departureTime = null;   // Declare a null variable. This will hold the chosen departure time that will be returned.

    // For every time in the times array, function does the following:
    for(let i = 0; i < times.length; i++){
        const time = new Date(times[i]);    // Create a Date object from the current array element.
        console.log(time);
        let hour = time.getHours(); // Extract its hours and minutes.
        let minute = time.getMinutes();
        // Compare them to the hours and minutes of the desired time.
        // When the for loop finds a time where the hour is greater than the desired hour, or the hour is the same but the minutes are greater than or equal to the desired minutes,
        // it sticks that time into the departureTime variable and breaks out of the loop.
        if(hour > desiredHour || (hour == desiredHour && minute >= desiredMinutes)){
            console.log("FOUND IT! Best time is " + time);
            departureTime = time;
            break;
        }
    }

    if(departureTime != null){
        console.log("Your starting time is " + departureTime);
        return departureTime;   // The chosen time is then returned to the caller.    
    }
    else{
        throw("Your route passes through " + startStation + ". No departures from that station at or after the specified time.");
    }
}

// Async function to get the average speed of a train on the REM network.
async function getAvgSpeed(){
    let speedPromise = await fetch("http://10.101.0.12:8080/averageTrainSpeed");
    let speeds = await speedPromise.json();
    return speeds[0].AverageSpeed;
}

// Async function to get the distance between two stations on the REM network.
async function getDistance(lastStop, currentStop){
    let response = await fetch("http://10.101.0.12:8080/distance/" + lastStop.Name + "/" + currentStop.Name);
    let distance = await response.json();

    return distance;
}

// Async function to calculate travel time based on a passed distance and speed.
function GetTravelTime(distance, speed){
    // time = distance/speed
    let travelTime = distance / speed;
    let timeInMilliseconds = travelTime * (60 * 60 * 1000);
    console.log(travelTime + " hours equals " + timeInMilliseconds + " milliseconds.");

    return timeInMilliseconds;
}

function getInfoButton(stationId){
    let infoButton = document.createElement("button");
    infoButton.innerHTML = "Click for more information";
    infoButton.setAttribute("class", "infoButton");
    infoButton.setAttribute("data-id", stationId);

    return infoButton;
}

async function getExtraInfo(e){
    console.log(e.target);

    let infoContainer = e.target.parentNode;

    let stationId = e.target.dataset.id;

    let response = await fetch("http://10.101.0.12:8080/stations/" + stationId);
    let stationsData = await response.json();   // Resolves to an array with a single element.
    let thisStation = stationsData[0];

    console.log(thisStation);

    let addressPara = document.createElement("p");
    addressPara.innerHTML = "Located at " + thisStation.Number + " " + thisStation.StreetName + " in the city of " + thisStation.City + ".";

    let connectionsPara = document.createElement("p");
    connectionsPara.innerHTML = (thisStation.BusId != null ? "Connects to a bus network" : "No connection to a bus network") + ". " + (thisStation.MetroId != null ? "Connected to a metro network" : "Not connected to a metro network") + ". " + (thisStation.TrainId != null ? "Connected to another train network." : "Not connected to another train network.");

    infoContainer.appendChild(addressPara);
    infoContainer.appendChild(connectionsPara);

    e.target.removeEventListener("click", getExtraInfo);
    e.target.innerHTML = "Click to close.";
    e.target.addEventListener("click", removeExtraInfo);
}

async function removeExtraInfo(e){
    let infoContainer = e.target.parentNode;
    let infoParas = infoContainer.getElementsByTagName("p");

    console.log("Info paragraphs: " + infoParas);
    console.log(infoContainer);

    for(let i = infoParas.length -1; i >= 0; i--){
        infoParas[i].remove();
    }

    e.target.removeEventListener("click", removeExtraInfo);
    e.target.innerHTML = "Click for more information";
    e.target.addEventListener("click", getExtraInfo);
}

async function getNotifications(stationId){
    let response = await fetch("http://10.101.0.12:8080/notifications/" + stationId);
    let notificationsArray = await response.json(); //resolves to an array of notifications.

    console.log(notificationsArray);

    if(notificationsArray.length > 0){
        for(let i = 0; i < notificationsArray.length; i ++){
            const notification = notificationsArray[i];
            console.log(notification);

            let notiPara = document.createElement("p");
            notiPara.innerHTML = notification.Description;
            console.log(notiPara);
        }
    }
    else{
        return "N/A";
    }
}