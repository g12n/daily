const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')
const Arvelie =  require('./lib/arvelie')
const SunCalc = require('suncalc');

const date = new Date()
const timeZone = 'Europe/Berlin'
const zonedDate = utcToZonedTime(date, timeZone)

const moonPath =  require('./lib/moonpath')

console.log(moonPath())

let calendarDate = `<span class="month">${format(zonedDate,'MMMM')}</span>
<span class="day">${format(zonedDate,'d')}</span>
<span class="dow">${format(zonedDate,'EEEE')}</span>`

let today =zonedDate.toArvelie()
let arvelieDate = `<span class="y">${today.y}</span>
<span class="m">${today.m}</span>
<span class="d">${today.d}</span>`

let times = SunCalc.getTimes(zonedDate, 50.935173, 6.953101);
let sunBlock = `<span class="sunrise">${format(utcToZonedTime(times.sunrise,timeZone),'HH:mm')}</span>
<span class="sunset">${format(utcToZonedTime(times.sunset,timeZone),'HH:mm')}</span>`

let {rise:moonrise, set:moonset, alwaysDown, alwaysUp } =  SunCalc.getMoonTimes(zonedDate, 50.935173, 6.953101);
let moonBlock = ``

if (alwaysDown === true){
  moonBlock += `<span class="moon-info">always down</span>`
} else if (alwaysUp === true){
  moonBlock += `<span class="moon-info">always up</span>`
} else {
  moonBlock += `<span class="moonrise">${format(utcToZonedTime(moonrise,timeZone),'HH:mm')}</span>`
  moonBlock += `<span class="moonset">${format(utcToZonedTime(moonset,timeZone),'HH:mm')}</span>`
}

let moonSVG = `<div class="moon-svg"><svg viewBox="0 0  600 600">`

let {fraction, phase} = SunCalc.getMoonIllumination(zonedDate)
let {parallacticAngle}= SunCalc.getMoonPosition(zonedDate,50.935173, 6.953101)

moonSVG +=`<circle class="moon-shadow" cx="300" cy="300" r="300"/>`
moonSVG +=`<path class="moon-light" d="${moonPath(fraction,phase,parallacticAngle,300, [300,300])}" />`
moonSVG +=`</svg></div>`

//const rtf = new Intl.RelativeTimeFormat('de');
//rtf.format(-3.14, 'days')

class Test {
  // or `async data() {`
  // or `get data() {`
  data() {
    return {
      name: "d",
     // layout: "teds-rad-layout",
      // … other front matter keys
    };
  }

  render({name}) {
    // will always be "Ted"
    return `<!DOCTYPE html>
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
  }
}

module.exports = Test;