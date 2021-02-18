import SunCalc from 'suncalc';
import { format,isBefore} from 'date-fns';

export const sunTimesTable = (location=[50.935173, 6.953101], date=new Date ) =>{


var times = SunCalc.getTimes(date, location[0], location[1]);
let moonTimes = SunCalc.getMoonTimes(date, location[0], location[1])

Object.assign(times, moonTimes)

let timesArray = []


Object.keys(times).map( key => {
    timesArray.push(
        {
            key: key,
            date: times[key], 
            time: format(times[key],"HH:mm"),
        }
    )
})

var suntimeIsBefore = (st1, st2) =>{

    if (isBefore(st1.date, st2.date)) {
        return -1;
      }
      if (isBefore(st2.date, st1.date)) {
        return 1;
      }

      return 0;
}

timesArray = timesArray.sort(suntimeIsBefore)

let table = "<table class='sun-times-table'>"
timesArray.map(({time, key}) => {
      table += `<tr class="${key}"><th scope="row">${key}<th><td>${time}</td></tr>`
})


table += "</table>"

return table

}