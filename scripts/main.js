
//Global variables to be used and manipulated in script files
const splashScreen = document.getElementById('splash');
const citySubmit = document.getElementById('city-submit');
const cityInput = document.getElementById('city-input');
const failure = document.getElementById('fail-request');
const city = document.getElementById('city');
const weather = document.getElementById('weather');
const temperature = document.getElementById('temperature');
const root = document.querySelector(':root');
const time = document.getElementById('time');
const icon = document.getElementById('icon');
const title = document.querySelector('title');
const navDown = document.querySelector('.down');
const navUp = document.querySelector('.up');

// initial tracker values
let greetingPos = 0;
let timeZoneAdjustment = 0;


// Changes the value of a CSS variable declared in :root
// only if it needs to be changed.
// returns true if the value has been changed and false if not
function changeVariable(vari, newVal) {
    const varVal = getComputedStyle(root).getPropertyValue(vari);
    if(newVal !== varVal) {
        root.style.setProperty(vari, newVal);
        return true
    }
    return false
}

// Formats a number to be double digit
function doubleDigit(num) {
    return num < 10 ? num = '0' + num : num
}

// Scrolls between the pages 2 sections
function scroll(event) {
    let change = '';

    // For button press, direction is determined.
    let down;
    let up;
    event.target.classList.contains('down') ? down = true : up = true;

    //Determines direction of the scroll and translates the body
    if (event.deltaY > 0 || down) {
        change = changeVariable('--page-position', '-100vh')  
    }
    else if (event.deltaY < 0 || up) {
        change = changeVariable('--page-position', '0');
    }
    else {
        return
    }
    
    //Prevents event triggering again until the transition is complete
    if(change) {
        document.removeEventListener('wheel', scroll);
        setTimeout(() => {
            document.addEventListener('wheel', scroll);
        }, 1100);
    }
}

function intro() {
    let randomTime = () => {
        let hrs = Math.floor(Math.random() * 24);
        let mins = Math.floor(Math.random() * 60);
        setTime(hrs, mins);
    }
    let inter = setInterval(randomTime, 50);
    setTimeout(() => {
        clearInterval(inter);
    }, 950)
}

intro();

navUp.addEventListener('click', scroll);
navDown.addEventListener('click', scroll);
document.addEventListener('wheel', scroll);