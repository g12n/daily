const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')

const date = new Date()
const timeZone = 'Europe/Berlin'
const zonedDate = utcToZonedTime(date, timeZone)
let now = zonedDate;

const Arvelie =  require('./lib/arvelie')
let today =now.toArvelie()




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
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="arvelie">
      <span class="y">${today.y}</span>
      <span class="m">${today.m}</span>
      <span class="d">${today.d}</span>
      <span class="month">${format(zonedDate,'MMMM')}</span>
      <span class="day">${format(zonedDate,'d')}</span>
      <span class="dow">${format(zonedDate,'EEEE')}</span>
    </div>

    
  </body>
</html>`
  }
}

module.exports = Test;