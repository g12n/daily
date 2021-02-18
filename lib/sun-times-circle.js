import SunCalc from 'suncalc';
//import moonPath from './moonpath';
import {timeArc,timeArcCenter} from './time-arc';
import {getMoonIcon, moonPath} from './moonpath'



export const  sunTimesCircle = (location=[50.935173, 6.953101], date=new Date, day="#FFBB0E", night="070055" )=> {
    
    var times = SunCalc.getTimes(date, location[0], location[1]);
    
    let svg = `<g>`
	svg += `<path d="${timeArc(times.night,times.nightEnd)}" fill="#070055"></path>`
	svg += `<path d="${timeArc(times.nightEnd,times.nauticalDawn)}" fill="#0F00BB"></path>`
	svg += `<path d="${timeArc(times.nauticalDawn,times.dawn)}" fill="#573887"></path>`
	svg += `<path d="${timeArc(times.dawn,times.sunrise)}" fill="#9F7053"></path>`
	svg += `<path d="${timeArc(times.sunrise,times.sunset)}" fill="#FFBB0E"></path>`
	svg += `<path d="${timeArc(times.sunset,times.dusk)}" fill="#9F7053"></path>`
	svg += `<path d="${timeArc(times.dusk,times.nauticalDusk)}" fill="#573887"></path>`
	svg += `<path d="${timeArc(times.nauticalDusk,times.night)}" fill="#0F00BB"></path>`
    svg += "</g>";
	
	var moonTimes = SunCalc.getMoonTimes(date, location[0], location[1]);

	console.log(JSON.stringify(moonTimes))
	if(moonTimes.rise && moonTimes.set){

	svg += `<path d="${timeArc(moonTimes.rise,moonTimes.set, 80,82)}" fill="#fff"></path>`
	

	let moonCenter = timeArcCenter(moonTimes.rise,moonTimes.set, 81)

	svg += `<circle cx="${moonCenter[0]}" cy="${moonCenter[1]}" r="10" />`
	svg += getMoonIcon(location, date,9,moonCenter)


	}
	return svg;
}
