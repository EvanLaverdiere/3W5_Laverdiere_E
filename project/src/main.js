// Evan Laverdiere      Student ID 0860347
// WEB PROGRAMMING I, FALL 2021
// FINAL PROJECT

// class Station{
//     //To be filled in once more details are available.
//     constructor(stationId, name){
//         this.stationId = stationId;
//         this.name = name;
//     }
// }

//#region Variables

let startDestination = document.getElementById("startDestination");
let endDestination = document.getElementById("endDestination");
let startTime = document.getElementById("startTime");
let submitBtn = document.getElementById("submitBtn");
let routeSection = document.getElementById("routeSection");
let AccuAside = document.getElementById("AccuWeather");
let weatherHeader = document.getElementById("weatherHeader");
let dayForecastDiv = document.getElementById("dayForecastDiv");
let nightForecastDiv = document.getElementById("nightForecastDiv");
let headlinesDiv = document.getElementById("headlinesDiv");

// console.log(userRole);
console.log(startDestination);
console.log(endDestination);
console.log(startTime);
console.log(submitBtn);

//#endregion

submitBtn.addEventListener("click", planTrip);

//#region REM API Functions

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
            // await displayPath(tripPath, desiredTime); // Function then calls a function to display details of the trip's path. 
            await displayPathV2(tripPath, desiredTime); // Function then calls a function to display details of the trip's path. 
            let endPostalCode = await getPostalCodeByName(endStation);
            console.log(endPostalCode);
            let externalData = await getExternalData(endPostalCode);
            await displayWeatherData(endStation, externalData);
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

async function displayPathV2(path, departureTime){
    let pathTable = routeSection.getElementsByTagName("table")[0];
    let ptBody = pathTable.getElementsByTagName("tbody")[0];
    let ptHeader = ptBody.firstElementChild;

    trimTableRows(ptBody);

    await fillRows(ptBody, path, departureTime);

    console.log(ptHeader);
    routeSection.style.display = "inline-block";
    routeSection.style.width = "80%";
}

function trimTableRows(tBody){
    let rows = tBody.getElementsByTagName("tr");
    console.log(rows);

    if(rows.length > 1){
        for(let i = rows.length - 1; i >= 1; i --){
            rows[i].remove();
        }
    }
}

// async function displayPath(path, departureTime){
//     let pathSection = document.createElement("section");
//     let psHeader = document.createElement("h2");
//     psHeader.innerHTML = "Your Route:";
//     pathSection.appendChild(psHeader);
    
//     let pathTable = document.createElement("table");
//     let ptBody = document.createElement("tbody");
//     let ptHeader = document.createElement("tr");
//     let timeHeader = document.createElement("th");
//     let stationHeader = document.createElement("th");
//     let directionHeader = document.createElement("th");
//     let extraHeader = document.createElement("th");
//     let notifHeader = document.createElement("th");

//     timeHeader.innerHTML = "Departure/Arrival Time";
//     stationHeader.innerHTML = "Station";
//     directionHeader.innerHTML = "Direction";
//     extraHeader.innerHTML = "Information";
//     notifHeader.innerHTML = "Notifications";
//     ptHeader.appendChild(timeHeader);
//     ptHeader.appendChild(stationHeader);
//     ptHeader.appendChild(directionHeader);
//     ptHeader.appendChild(extraHeader);
//     ptHeader.appendChild(notifHeader);


//     pathTable.appendChild(ptHeader);

//     await fillRows(ptBody, path, departureTime);        


//     pathTable.appendChild(ptBody);
//     pathSection.appendChild(pathTable);
//     document.body.appendChild(pathSection);
// }

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

        let notifs = await getNotifications(stop.StationId);
        console.log(typeof(notifs));

        if(typeof notifs == "string"){
            notifCol.innerHTML = notifs
        }
        else{
            notifCol.appendChild(notifs);
        }

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

// Function which creates and returns a clickable button, with a dataset id attribute based on a passed station ID.
// Button will be used to trigger certain functions via eventListeners.
function getInfoButton(stationId){
    let infoButton = document.createElement("button");
    infoButton.innerHTML = "Click for more information";
    infoButton.setAttribute("class", "infoButton");
    infoButton.setAttribute("data-id", stationId);

    return infoButton;
}

// Async function to retrieve and display extra information about a given station.
// Called when the station's corresponding info button is clicked.
async function getExtraInfo(e){
    console.log(e.target);  // Function logs the target button for user's convenience.

    let infoContainer = e.target.parentNode; // Function grabs the button's containing td element.

    let stationId = e.target.dataset.id;    // Then it grabs the station's ID from the button's data-id attribute.

    let response = await fetch("http://10.101.0.12:8080/stations/" + stationId);    // Function sends a fetch request to the stations API, passing the ID.
    let stationsData = await response.json();   // Resolves to an array with a single element.
    let thisStation = stationsData[0];          // Picks out the station's element for ease of access.

    console.log(thisStation);

    let addressPara = document.createElement("p");  // Function then creates a paragraph and fills it with information about the station's location, taken from the station object.
    addressPara.innerHTML = "Located at " + thisStation.Number + " " + thisStation.StreetName + " in the city of " + thisStation.City + ".";

    let connectionsPara = document.createElement("p");  // Then it creates a second paragraph and fills it with information about the station's inter-network connectivity (i.e., connection [or lack thereof] to bus/metro/train networks).
    connectionsPara.innerHTML = (thisStation.BusId != null ? "Connects to a bus network" : "No connection to a bus network") + ". " + (thisStation.MetroId != null ? "Connected to a metro network" : "Not connected to a metro network") + ". " + (thisStation.TrainId != null ? "Connected to another train network." : "Not connected to another train network.");

    infoContainer.appendChild(addressPara); // Both paragraphs are then appended to the td element.
    infoContainer.appendChild(connectionsPara);

    e.target.removeEventListener("click", getExtraInfo);    // To prevent this from being repeated if the button is clicked again, the function removes its own eventListener.
    e.target.innerHTML = "Click to close."; // Then it changes the button's text...
    e.target.addEventListener("click", removeExtraInfo);    // ...and adds a new eventListener which will remove this extra information when the button is clicked.
}

// Async eventListener function which removes extraneous station information from its corresponding cell of the table.
// Called only when the corresponding button has been clicked and only if the cell has already been filled with this information.
async function removeExtraInfo(e){
    let infoContainer = e.target.parentNode;    // First, the function grabs the containing td element.
    let infoParas = infoContainer.getElementsByTagName("p");    // Then it grabs all paragraphs within the td.

    console.log("Info paragraphs: " + infoParas);
    console.log(infoContainer);

    // It then removes the paragraphs one by one, working backwards from the last one [a necessity for HTMLCollections, as I learned with the Rockets API assignment].
    for(let i = infoParas.length -1; i >= 0; i--){
        infoParas[i].remove(); 
    }

    e.target.removeEventListener("click", removeExtraInfo); // Once all paragraphs have been removed, the function removes its own eventListener.
    e.target.innerHTML = "Click for more information";  // It then restores the button's original text and original eventListener.
    e.target.addEventListener("click", getExtraInfo);
}

// Async function which retrieves any notifications currently in effect for a given station.
// Returns a Div with one or more paragraphs if notifications were found, or a string otherwise.
async function getNotifications(stationId){
    let response = await fetch("http://10.101.0.12:8080/notifications/" + stationId);   // Sends a fetch request to the notifications API, passing the station's ID as argument.
    let notificationsArray = await response.json(); //resolves to an array of notifications.

    console.log(notificationsArray);    // Logs the array for user's benefit.

    if(notificationsArray.length > 0){
        // If the array has at least one element (i.e., at least one notification), function does the following:
        let notiDiv = document.createElement("div");    // It creates an empty div element to store the upcoming information.

        // For each notification in the array...
        for(let i = 0; i < notificationsArray.length; i ++){
            const notification = notificationsArray[i]; // The function grabs and logs the Notification object...
            console.log(notification);

            let notiPara = document.createElement("p"); // ...creates an empty paragraph element...
            notiPara.innerHTML = notification.Description;  // ...and fills that paragraph with the contents of the Notification's Description property.
            console.log(notiPara);
            notiDiv.appendChild(notiPara);  // It then appends the new paragraph to the div.
        }
        console.log(notiDiv);   // Once all notification descriptions have been added to the div, function returns the div to the caller.
        return notiDiv;
    }
    else{
        return "N/A";   // If the Notifications array is empty, function returns a string indication that no notifications are applicable for this station.
    }
}
//#endregion

//#region External API Functions
// Async function which retrieves data from an external API--in this case, AccuWeather--based on a passed postal code value.
async function getExternalData(postalCode){
    let APIKey = "lPWmEWrO0gUAFIxqQcq9df4R06UtjXvD"; // Key which is needed to access the AccuWeather APIs. Without it, none of them will work.
    let pSResponse = await fetch("http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=" + APIKey + "&q=" + postalCode);
    let AccuPostalCode = await pSResponse.json(); // resolves to an array containing a single complex object with detailed information about the specified postal code. Need this so we can grab a key from the object to get more information about the forecast for that location.
    console.log(AccuPostalCode);

    let locationKey = AccuPostalCode[0].Key;
    console.log("Location key is " + locationKey);

    let forecastResponse = await fetch("http://dataservice.accuweather.com/forecasts/v1/daily/1day/" + locationKey + "?apikey=" + APIKey);
    let realForecast = await forecastResponse.json(); // Resolves to an object containing both an array of DailyForecasts objects, and a Headlines object.
    console.log(realForecast);

    return realForecast;
}

// Async function to retrieve a station's postal code through passing the station's name.
async function getPostalCodeByName(stationName){
    let response = await fetch("http://10.101.0.12:8080/stations"); // First the function fetches from the Stations API.
    let allStations = await response.json();    // It resolves to an array of all the stations, with only basic information.

    let desiredId;  // Declare an empty variable which will store the id of the desired station.

    for(let i = 1; i < allStations.length; i++){
        const station = allStations[i]; // Loop through all the stations in the array.
        if(station.Name == stationName){
            desiredId = station.StationId;  // If one station's name matches the passed name, store the station's ID in the desiredId variable and break the loop.
            break;
        }   // Otherwise, keep going.
    }

    if(desiredId != null){ // If the desired ID was found...
        desiredResponse = await fetch("http://10.101.0.12:8080/stations/" + desiredId); // ...the function fetches the corresponding station's in-depth data from the Stations API.
        let desiredArray = await desiredResponse.json(); // resolves to array with one element.
        // console.log(desiredArray);
        let desiredStation = desiredArray[0];   // The station itself is stored in this variable.
        // console.log(desiredStation);
        let postalCode = desiredStation.PostalCode; // The function then grabs the station's postal code and returns it to the caller.

        return postalCode;
    }
    else{
        return "Station not found." // If the ID was not found, the station returns this (should probably be reject instead).
    }

}

async function displayWeatherData(endStation, weatherData){
    removeParagraphs(AccuAside); // If any paragraphs have previously been added to the AccuWeather aside or its children, remove them all.
    weatherHeader.innerHTML = "Today's Forecast for " + endStation;

    let forecast = weatherData.DailyForecasts[0];   // Stores an Object containing information about the day's forecast. Technically this is an array with only one element.
    let headline = weatherData.Headline;            // Stores an Object containing the day's biggest weather-related headline.
    console.log(forecast);
    console.log(headline);

    let dayCast = forecast.Day;
    let nightCast = forecast.Night;
    console.log(dayCast);
    console.log(nightCast);

    // removeParagraphs(dayForecastDiv); // If paragraphs have previously been added to the day and night forecast divs, remove them.
    // removeParagraphs(nightForecastDiv);

    let dayP = document.createElement("p");
    dayP.innerHTML = (dayCast.HasPrecipitation == true ? dayCast.PrecipitationIntensity + " " + dayCast.IconPhrase : dayCast.IconPhrase);
    dayForecastDiv.appendChild(dayP);

    let nightP = document.createElement("p");
    nightP.innerHTML = (nightCast.HasPrecipitation == true ? nightCast.PrecipitationIntensity + " " + nightCast.IconPhrase : nightCast.IconPhrase);
    nightForecastDiv.appendChild(nightP);

    let maxTemp = forecast.Temperature.Maximum;
    let minTemp = forecast.Temperature.Minimum;
    console.log(maxTemp);
    console.log(minTemp);

    let celsiusMaxTemp = getCelsiusFromFahrenheit(maxTemp.Value);
    let celsiusMinTemp = getCelsiusFromFahrenheit(minTemp.Value);

    console.log(maxTemp.Value + " degrees Fahrenheit equals " + celsiusMaxTemp + " degrees Celsius.");

    let highTempP = document.createElement("p");
    highTempP.innerHTML = "High of <strong>" + Math.round(celsiusMaxTemp) + "</strong> &#176 C.";
    dayForecastDiv.appendChild(highTempP);

    let lowTempP = document.createElement("p");
    lowTempP.innerHTML = "Low of <strong>" + Math.round(celsiusMinTemp) + "</strong> &#176 C.";
    nightForecastDiv.appendChild(lowTempP);

    let headlineP = document.createElement("p");
    let headlineLink = document.createElement("a");
    headlineLink.innerHTML = headline.Text;
    headlineLink.setAttribute("href", headline.Link);
    headlineP.appendChild(headlineLink);
    headlinesDiv.appendChild(headlineP);

    AccuAside.style.display = 'grid';
    AccuAside.style.width = "20%";
}

// Function to convert the temperature from a passed Fahrenheit value to Celsius.
function getCelsiusFromFahrenheit(fahrenheitValue){
    return (fahrenheitValue - 32) * (5/9);
}

// Function to remove all paragraphs from a passed HTML element. If passed element has children, it removes paragraphs from them as well.
function removeParagraphs(containerElement){
    let paragraphs = containerElement.getElementsByTagName("p"); // First the function makes a list of all paragraphs in the element.

    if(paragraphs.length > 0){
        // If there are any paragraphs at all,
        for(let i = paragraphs.length - 1; i >= 0; i --){
            paragraphs[i].remove(); // The function cycles through them in reverse order and removes them one by one.
        }
    }
}

//#endregion