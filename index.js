fs = require('fs');

const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
const Arvelie =  require('./lib/arvelie')
const SunCalc = require('suncalc');

const {arc} = require('d3-shape')
const { wrap } = require('canvas-sketch-util/math');

const {clock, table} = require('./bundle.cjs.js')

const CleanCSS = require("clean-css");
const { isThursday } = require('date-fns');
const { time } = require('console');

const timeZone = 'Europe/Berlin'
const date = new Date()
const zonedDate = utcToZonedTime(date, timeZone)

let timeString = (date) =>{
  let string = "";
  if (date) {
    string = format(utcToZonedTime(date, timeZone), 'HH:mm')
  }
  return string
}


let calendarDate = `<span class="month">${format(zonedDate,'MMMM')}</span>
<span class="day">${format(zonedDate,'d')}</span>
<span class="dow">${format(zonedDate,'EEEE')}</span>`

let today =zonedDate.toArvelie()
let arvelieDate = `<span class="y">${today.y}</span><span class="m">${today.m}</span><span class="d">${today.d}</span>`

let times = SunCalc.getTimes(zonedDate, 50.935173, 6.953101);
let sunrise  = timeString(times.sunrise);
let sunset = timeString(times.sunset);
let moonTimes = SunCalc.getMoonTimes(zonedDate, 50.935173, 6.953101);
let moonrise = timeString(moonTimes.rise)
let moonset = timeString(moonTimes.set)
let {alwaysDown, alwaysUp } = moonset;


let sunBlock = `<span class="sunrise">${sunrise}</span><span class="sunset">${sunset}</span>`

let moonBlock = ``

if (alwaysDown === true){
  moonBlock += `<span class="moon-info">always down</span>`
} else if (alwaysUp === true){
  moonBlock += `<span class="moon-info">always up</span>`
} else {
  moonBlock += `<span class="moonrise">${moonrise}</span><span class="moonset">${moonset}</span>`
}

let {fraction, phase} = SunCalc.getMoonIllumination(zonedDate)
let {parallacticAngle}= SunCalc.getMoonPosition(zonedDate,50.935173, 6.953101)

fs.readFile('_includes/styles.css', (err, css) => {

let clean =  new CleanCSS({
    level: 2
  }).minify(css)

let styles = clean.styles;


let timeToAngle = (date) =>{

myDate = new Date(date);

let fullDay = 24 * 60 * 60; // Seconds in a Day 
let time = (myDate.getHours() * 60 * 60) + (myDate.getMinutes() * 60 ) + myDate.getSeconds() // Seconds in Time

let angle = (time / fullDay  ) * 2 * Math.PI - Math.PI;



console.log(wrap(angle, 0, 2 * Math.PI))
return wrap(angle, 0, 2 * Math.PI);

}

let code = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${today.toString()}</title>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${styles}</style>

</head>
<body>

<div class="arvelie">
${arvelieDate}
${calendarDate}
${sunBlock}
${moonBlock}
<div class="sun-clock"> ${clock()}</div>
<div class="sun-table"> ${table()}</div>
</div>



</body>
</html>`

var dir = './_site';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


fs.writeFile('_site/index.html',code, function (err) {
  if (err) return console.log(err);
  console.log(`${today} > _site/index.html`);
});


})


