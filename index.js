fs = require('fs');

const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
const Arvelie =  require('./lib/arvelie')
const SunCalc = require('suncalc');
const moonPath =  require('./lib/moonpath')

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
let arvelieDate = `<span class="y">${today.y}</span>
<span class="m">${today.m}</span>
<span class="d">${today.d}</span>
`

let times = SunCalc.getTimes(zonedDate, 50.935173, 6.953101);
let sunrise  = timeString(times.sunrise);
console.log("sunrise:", sunrise);

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
let moonPathData = moonPath(fraction,phase,parallacticAngle,300, [300,300]);

let moonSVG = `<div class="moon-svg"><svg viewBox="0 0  600 600">`
moonSVG +=`<circle class="moon-shadow" cx="300" cy="300" r="300"/>`
moonSVG +=`<path class="moon-light" d="${moonPath(fraction,phase,parallacticAngle,300, [300,300])}" />`
moonSVG +=`</svg></div>`

let code = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${today.toString()}</title>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css" />

  </head>
  <body>
    <div class="arvelie">
      ${arvelieDate}
      ${calendarDate}
      ${sunBlock}
      ${moonBlock}
      ${moonSVG}
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