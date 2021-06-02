/*
This script file handles time specific DOM changes.
Sets the time on the banner, chooses which greeting to display
and applys greyscale to the background image depending on time of day
*/

//determines which greeting is to be displayed based on time of day;
function setGreeting(hrs, mins) {

    //Represents height of the text and viewing window (vh)
    let viewHeight = 20;

    let position;
    switch (true) {
        case hrs === 0: 
            position = 0;
            if (mins == 0) break
        case hrs < 6:
            position = -1;
            break
        case hrs < 12: 
            position = -2;
            break
        case hrs === 12:
            position = -3;
            if(mins == 0) break
        case hrs < 18:
            position = -4;
            break
        case hrs < 22:
            position = -5;
            break
        case hrs < 24:
            position = -6;
            break
    }

    if(position !== greetingPos) {
        changeVariable('--greeting-position', position * viewHeight + 'vh')
    }

    // Tracks current position
    greetingPos = position;
}


// Formats the time and changes the h1 to the current time
function setTime(hrs, mins) {

    hrs = doubleDigit(hrs);
    mins = doubleDigit(mins);
    const timeOfDay = hrs + ':' + mins;

    if(timeOfDay !== time.innerHTML) {
        time.innerHTML = timeOfDay;
    }
}


// Applies a brightness background filter dependant on time of day
function nightFilter(hrs) {
    let scale = (hrs-12) * 0.85/12;
    let brightness = 1.1 - (Math.abs(scale));
    changeVariable('--time', brightness);
}

// Returns the hours & minutes for the city
function tzAdjust() {
    const date = new Date();
    let tzHrs = Math.floor(timeZoneAdjustment/3600);
    const tzMins = Math.floor((timeZoneAdjustment % 3600) / 60);
    let mins = date.getUTCMinutes() + tzMins;
    if(mins >= 60) { tzHrs++; mins = mins % 60 };
    let hrs = date.getUTCHours() + tzHrs;
    if(hrs >= 24) { hrs = hrs % 24 };
    return [hrs, mins]
}

// Takes timezone (ms adjustment from UTC) and parses the hours & minutes
// and passes it to the functions altering the DOM based on time
function timeChanges() {
    const [hours, minutes] = tzAdjust();
    
    setTime(hours, minutes);
    nightFilter(hours);
    setGreeting(hours, minutes);
}


// Makes time changes every second
timeChanges();
setInterval(timeChanges, 1000, timeZoneAdjustment);